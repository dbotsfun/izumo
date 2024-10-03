use crate::{
	app::AppState,
	auth::AuthCheck,
	task::spawn_blocking,
	util::errors::AppResult,
	views::{EncodableMe, EncodablePrivateUser},
};
use crate::{
	models::{BotOwner, User},
	views::OwnedBot,
};
use axum::{http::request::Parts, Json};
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;

/// Handles the `GET /me` route.
pub async fn me(app: AppState, req: Parts) -> AppResult<Json<EncodableMe>> {
	let conn = app.db_read_prefer_primary().await?;

	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let user_id = AuthCheck::only_cookie().check(&req, conn)?.user_id();
		let user_id = user_id.as_str();

		let user = User::find(conn, user_id)?;

		let owned_bots = BotOwner::find_owned_bots(conn, user_id)?;
		let owned_bots: Vec<OwnedBot> = owned_bots.into_iter().map(OwnedBot::from).collect();

		Ok(Json(EncodableMe {
			user: EncodablePrivateUser::from(user),
			owned_bots,
		}))
	})
	.await
}
