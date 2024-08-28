use crate::{
	app::AppState,
	util::errors::AppResult,
	views::{EncodableMe, EncodablePrivateUser},
};
use crate::{
	models::{BotToUser, User},
	views::OwnedBot,
};
use axum::{http::request::Parts, Json};
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;
use tokio::task::spawn_blocking;

pub async fn me(app: AppState, req: Parts) -> AppResult<Json<EncodableMe>> {
	let conn = app.db_read_prefer_primary().await?;

	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();
		let id = "462780441594822687";
		let user = User::find(conn, id)?;

		let owned_bots = BotToUser::find_owned_bots(conn, id)?;
		let owned_bots: Vec<OwnedBot> = owned_bots.into_iter().map(OwnedBot::from).collect();

		Ok(Json(EncodableMe {
			user: EncodablePrivateUser::from(user),
			owned_bots,
		}))
	})
	.await?
}
