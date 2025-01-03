use crate::{app::AppState, models::Bot, util::errors::AppResult, views::EncodableBotOwner};
use axum::{extract::Path, Json};
use serde_json::Value;

/// Handles `GET /bots/:bot_id/owners` requests.
pub async fn owners(state: AppState, Path(id): Path<String>) -> AppResult<Json<Value>> {
	let mut conn = state.db_read().await?;
	let id = id.as_str();

	let bot: Bot = Bot::find(&mut conn, id).await?;

	let owners = bot
		.owners(&mut conn)
		.await?
		.into_iter()
		.map(|owner| owner.into())
		.collect::<Vec<EncodableBotOwner>>();

	Ok(Json(json!({ "users": owners })))
}
