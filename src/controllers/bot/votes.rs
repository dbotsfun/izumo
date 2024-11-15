use crate::views::EncodableBotVote;
use crate::{
	app::AppState,
	models::{Bot, BotVote},
	schema::bot_votes,
	util::errors::AppResult,
};
use axum::extract::Path;
use axum::Json;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;
use serde_json::Value;

/// Handles the `GET /bots/:bot_id/votes` route.
pub async fn votes(app: AppState, Path(bot_id): Path<String>) -> AppResult<Json<Value>> {
	let mut conn = app.db_read().await?;

	use diesel::dsl::*;

	let bot = Bot::find(&mut conn, bot_id.as_str()).await?;

	// last 90 votes
	let votes = BotVote::belonging_to(&bot)
		.filter(bot_votes::date.eq(date(now - 90.days())))
		.order((bot_votes::date.asc(), bot_votes::bot_id.desc()))
		.load(&mut conn)
		.await?
		.into_iter()
		.map(BotVote::into)
		.collect::<Vec<EncodableBotVote>>();

	let total_votes: i64 = bot_votes::table.count().get_result(&mut conn).await?;

	Ok(Json(json!({
		"bot_votes": votes,
		"extra": {
			"total_votes": total_votes,
		}
	})))
}
