use crate::app::AppState;
use crate::middleware::session::encode;
use crate::middleware::{log_request::RequestLogExt, session::SessionExtension};
use crate::models::user::NewUser;
use crate::models::util::diesel::Conn;
use crate::models::User;
use crate::schema::users;
use crate::task::spawn_blocking;
use crate::util::errors::{bad_request, server_error, AppResult, BoxedAppError, ReadOnlyMode};
use crate::views::EncodableMe;
use axum::extract::{FromRequestParts, Query};
use axum::http::request::Parts;
use axum::Json;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;
use oauth2::reqwest::http_client;
use oauth2::PkceCodeVerifier;
use oauth2::{
	basic::BasicClient, AuthorizationCode, CsrfToken, PkceCodeChallenge, Scope, TokenResponse,
};
use oauth2::{AuthUrl, ClientId, ClientSecret, RedirectUrl, TokenUrl};
use serde_json::Value;
pub const COOKIE_AUTH_CSRF_STATE: &str = "auth_csrf_state";
pub const COOKIE_AUTH_CODE_VERIFIER: &str = "auth_code_verifier";

#[derive(Clone, Debug, Deserialize, FromRequestParts)]
#[from_request(via(Query))]
pub struct AuthorizeQuery {
	code: String,
	state: String,
}

//  Checkout available fields on: https://discord.com/developers/docs/resources/user
#[derive(Default, serde::Serialize, serde::Deserialize)]
struct DiscordUser {
	id: String,
	username: String,

	// For get the actual image we need to use: "https://cdn.discordapp.com/avatars/{id}/{avatar_hash}.png"
	#[serde(rename = "avatar")]
	avatar_hash: String,
}

fn get_oauth_client(app: &AppState) -> AppResult<BasicClient> {
	let config = &app.config.discord;
	let client_id = ClientId::new(config.client_id.clone());
	let client_secret = ClientSecret::new(config.client_secret.clone());

	let auth_url = AuthUrl::new("https://discord.com/oauth2/authorize".to_string())?;
	let token_url = TokenUrl::new("https://discord.com/api/oauth2/token".to_string())?;
	let redirect_url = RedirectUrl::new(config.redirect_uri.clone())?;

	let client = BasicClient::new(client_id, Some(client_secret), auth_url, Some(token_url))
		.set_redirect_uri(redirect_url);

	Ok(client)
}

/// Handles the `GET /private/session/login` route.
pub async fn login(app: AppState, session: SessionExtension) -> AppResult<Json<Value>> {
	let client = get_oauth_client(&app)?;
	let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

	let (authorize_url, csrf_state) = client
		.authorize_url(CsrfToken::new_random)
		.add_scope(Scope::new("identify".to_string()))
		.set_pkce_challenge(pkce_code_challenge)
		.url();

	let state = csrf_state.secret().to_owned();

	session.insert(COOKIE_AUTH_CSRF_STATE.to_string(), state.clone());
	session.insert(
		COOKIE_AUTH_CODE_VERIFIER.to_string(),
		pkce_code_verifier.secret().to_owned(),
	);

	Ok(Json(
		json!({ "url": authorize_url, "state": state.clone() }),
	))
}

/// Handles the `GET /private/session/authorize` route.
pub async fn authorize(
	query: AuthorizeQuery,
	app: AppState,
	session: SessionExtension,
	req: Parts,
) -> AppResult<Json<Value>> {
	let app_clone = app.clone();
	let request_log = req.request_log().clone();

	let conn = app.db_write().await?;
	let res = spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let session_state = session.remove(COOKIE_AUTH_CSRF_STATE).map(CsrfToken::new);
		if !session_state
			.as_ref()
			.map_or(false, |s| s.secret() == &query.state)
		{
			return Err(bad_request("Invalid CSRF state"));
		}

		let pkce_code_verifier = session
			.remove(COOKIE_AUTH_CODE_VERIFIER)
			.map(PkceCodeVerifier::new);

		if pkce_code_verifier.is_none() {
			return Err(bad_request("Missing code verifier"));
		}

		let client = get_oauth_client(&app)?;
		let code = AuthorizationCode::new(query.code);

		let token_response = client
			.exchange_code(code)
			.set_pkce_verifier(pkce_code_verifier.unwrap())
			.request(http_client)?;

		let access_token = token_response.access_token().secret();
		let discord_user = app
			.http
			.get("https://discord.com/api/users/@me")
			.bearer_auth(access_token)
			.send()?
			.json::<DiscordUser>()
			.map_err(|err| {
				request_log.add("cause", err);
				server_error("Error obtaining token")
			})?;

		let user = save_user_to_database(&discord_user, access_token, conn)?;

		session.insert("user_id".to_string(), user.id.clone());

		let session = session.read();

		Ok::<_, BoxedAppError>(encode(&session.data))
	})
	.await?;

	let user = super::me::me(app_clone, req).await?;

	Ok(Json(json!({
		"user": {
			"user": user.user,
			"owned_bots": user.owned_bots,
		},
		"session": res,
	})))
}

fn save_user_to_database(
	user: &DiscordUser,
	access_token: &str,
	conn: &mut impl Conn,
) -> AppResult<User> {
	use diesel::prelude::*;

	NewUser::new(
		user.id.as_str(),
		user.username.as_str(),
		Some(user.avatar_hash.as_str()),
		access_token,
	)
	.upsert(conn)
	.map_err(Into::into)
	.or_else(|e: BoxedAppError| {
		// If we're in read only mode, we can't update their details
		// just look for an existing user
		if e.is::<ReadOnlyMode>() {
			users::table
				.filter(users::id.eq(user.id.clone()))
				.first(conn)
				.optional()?
				.ok_or(e)
		} else {
			Err(e)
		}
	})
}

/// Handles the `DELETE /private/session` route.
pub async fn logout(session: SessionExtension) -> Json<bool> {
	session.remove("user_id");
	Json(true)
}
