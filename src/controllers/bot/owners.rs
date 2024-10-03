use crate::{
	app::AppState,
	models::Bot,
	task::spawn_blocking,
	util::errors::{bot_not_found, AppResult},
	views::EncodableBotOwner,
};
use axum::{extract::Path, Json};
use diesel::OptionalExtension;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;
use serde_json::Value;

/// Handles `GET /bots/:bot_id/owners` requests.
pub async fn owners(state: AppState, Path(id): Path<String>) -> AppResult<Json<Value>> {
	let conn = state.db_read().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();
		let id = id.as_str();

		let bot: Bot = Bot::find(conn, id)
			.optional()?
			.ok_or_else(|| bot_not_found(id))?;

		let owners = bot
			.owners(conn)?
			.into_iter()
			.map(|owner| owner.into())
			.collect::<Vec<EncodableBotOwner>>();

		Ok(Json(json!({ "users": owners })))
	})
	.await
}
