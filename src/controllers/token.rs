use crate::models::ApiToken;
use crate::schema::api_tokens;
use crate::util::rfc3339;
use crate::views::EncodableApiTokenWithToken;

use crate::app::AppState;
use crate::auth::AuthCheck;
use crate::models::token::EndpointScope;
use crate::task::spawn_blocking;
use crate::util::errors::{bad_request, AppResult};
use axum::extract::{Path, Query};
use axum::http::request::Parts;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use chrono::NaiveDateTime;
use diesel::data_types::PgInterval;
use diesel::dsl::{now, IntervalDsl};
use diesel::prelude::*;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;
use serde_json::Value;

#[derive(Deserialize)]
pub struct GetParams {
	expired_days: Option<i32>,
}

impl GetParams {
	fn expired_days_interval(&self) -> PgInterval {
		match self.expired_days {
			Some(days) if days > 0 => days,
			_ => 0,
		}
		.days()
	}
}

/// Handles the `GET /me/tokens` route.
pub async fn list(
	app: AppState,
	Query(params): Query<GetParams>,
	req: Parts,
) -> AppResult<Json<Value>> {
	let conn = app.db_read_prefer_primary().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let auth = AuthCheck::only_cookie().check(&req, conn)?;
		let user = auth.user();

		let tokens: Vec<ApiToken> = ApiToken::belonging_to(user)
			.select(ApiToken::as_select())
			.filter(api_tokens::revoked.eq(false))
			.filter(
				api_tokens::expired_at.is_null().or(api_tokens::expired_at
					.assume_not_null()
					.gt(now - params.expired_days_interval())),
			)
			.order(api_tokens::id.desc())
			.load(conn)?;

		Ok(Json(json!({ "api_tokens": tokens })))
	})
	.await
}

/// The incoming serialization format for the `ApiToken` model.
#[derive(Deserialize)]
pub struct NewApiToken {
	name: String,
	endpoint_scopes: Option<Vec<String>>,
	#[serde(default, with = "rfc3339::option")]
	expired_at: Option<NaiveDateTime>,
}

/// The incoming serialization format for the `ApiToken` model.
#[derive(Deserialize)]
pub struct NewApiTokenRequest {
	api_token: NewApiToken,
}

/// Handles the `PUT /me/tokens` route.
pub async fn new(
	app: AppState,
	parts: Parts,
	Json(new): Json<NewApiTokenRequest>,
) -> AppResult<Json<Value>> {
	if new.api_token.name.is_empty() {
		return Err(bad_request("name must have a value"));
	}

	let conn = app.db_write().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let auth = AuthCheck::default().check(&parts, conn)?;
		if auth.api_token_id().is_some() {
			return Err(bad_request(
				"cannot use an API token to create a new API token",
			));
		}

		let user = auth.user();

		// The maximum number of tokens a user can have.
		let max_token_per_user = 500;
		let count: i64 = ApiToken::belonging_to(user).count().get_result(conn)?;
		if count >= max_token_per_user {
			return Err(bad_request(format!(
				"maximum tokens per user is: {max_token_per_user}"
			)));
		}

		let endpoint_scopes = new
			.api_token
			.endpoint_scopes
			.map(|scopes| {
				scopes
					.into_iter()
					.map(|scope| EndpointScope::try_from(scope.as_bytes()))
					.collect::<Result<Vec<_>, _>>()
			})
			.transpose()
			.map_err(|_err| bad_request("invalid endpoint scope"))?;

		let api_token = ApiToken::insert_with_scopes(
			conn,
			user.id.as_str(),
			&new.api_token.name,
			endpoint_scopes,
			new.api_token.expired_at,
		)?;

		let api_token = EncodableApiTokenWithToken::from(api_token);

		Ok(Json(json!({ "api_token": api_token })))
	})
	.await
}

/// Handles the `GET /me/tokens/:id` route.
pub async fn show(app: AppState, Path(id): Path<i32>, req: Parts) -> AppResult<Json<Value>> {
	let conn = app.db_write().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let auth = AuthCheck::default().check(&req, conn)?;
		let user = auth.user();
		let token = ApiToken::belonging_to(user)
			.find(id)
			.select(ApiToken::as_select())
			.first(conn)?;

		Ok(Json(json!({ "api_token": token })))
	})
	.await
}

/// Handles the `DELETE /me/tokens/:id` route.
pub async fn revoke(app: AppState, Path(id): Path<i32>, req: Parts) -> AppResult<Json<Value>> {
	let conn = app.db_write().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let auth = AuthCheck::default().check(&req, conn)?;
		let user = auth.user();
		diesel::update(ApiToken::belonging_to(user).find(id))
			.set(api_tokens::revoked.eq(true))
			.execute(conn)?;

		Ok(Json(json!({})))
	})
	.await
}

/// Handles the `DELETE /tokens/current` route.
pub async fn revoke_current(app: AppState, req: Parts) -> AppResult<Response> {
	let conn = app.db_write().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let auth = AuthCheck::default().check(&req, conn)?;
		let api_token_id = auth
			.api_token_id()
			.ok_or_else(|| bad_request("token not provided"))?;

		diesel::update(api_tokens::table.filter(api_tokens::id.eq(api_token_id)))
			.set(api_tokens::revoked.eq(true))
			.execute(conn)?;

		Ok(StatusCode::NO_CONTENT.into_response())
	})
	.await
}
