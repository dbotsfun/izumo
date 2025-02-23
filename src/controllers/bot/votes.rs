use crate::auth::AuthCheck;
use crate::models::vote::NewBotVote;
use crate::task::spawn_blocking;
use crate::util::errors::bot_not_found;
use crate::views::EncodableBotVote;
use crate::{
	app::AppState,
	models::{Bot, BotVote},
	schema::bot_votes,
	util::errors::AppResult,
};
use axum::extract::Path;
use axum::http::request::Parts;
use axum::Json;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;

#[derive(Serialize)]
pub struct BotVotes {
	bot_votes: Vec<EncodableBotVote>,
	extra: VoteExtra,
}

#[derive(Serialize)]
pub struct VoteExtra {
	total_votes: i64,
}

/// Handles the `GET /bots/:bot_id/votes` route.
pub async fn votes(app: AppState, Path(bot_id): Path<String>) -> AppResult<Json<BotVotes>> {
	let mut conn = app.db_read().await?;

	use diesel::dsl::*;
	use diesel::prelude::*;
	use diesel::sql_types::BigInt;
	use diesel_async::RunQueryDsl;

	let bot = Bot::find(&mut conn, bot_id.as_str()).await?;

	// last 90 votes
	let votes = BotVote::belonging_to(&bot)
		.filter(bot_votes::date.gt(date(now - 90.days())))
		.order((bot_votes::date.asc(), bot_votes::bot_id.desc()))
		.load(&mut conn)
		.await?
		.into_iter()
		.map(BotVote::into)
		.collect::<Vec<EncodableBotVote>>();

	let sum_votes = sql::<BigInt>("SUM(bot_votes.votes)");
	let total_votes: i64 = BotVote::belonging_to(&bot)
		.select(sum_votes)
		.get_result(&mut conn)
		.await
		.unwrap_or(0);

	Ok(Json(BotVotes {
		bot_votes: votes,
		extra: VoteExtra { total_votes },
	}))
}

// TODO: 12h user ratelimit
/// Handles the `POST /bots/:bot_id/votes` route.
pub async fn vote(
	app: AppState,
	Path(bot_id): Path<String>,
	req: Parts,
) -> AppResult<Json<EncodableBotVote>> {
	let conn = app.db_write().await?;
	use diesel::OptionalExtension;
	use diesel::RunQueryDsl;

	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		// Make sure user is logged in
		let _ = AuthCheck::only_cookie().check(&req, conn)?.user_id();
		let bot_id = bot_id.as_str();

		// Check if bot exists
		let _: Bot = Bot::by_id(bot_id)
			.first(conn)
			.optional()?
			.ok_or_else(|| bot_not_found(bot_id))?;

		let new_vote = NewBotVote::new(bot_id);
		let vote = new_vote.create(conn)?;

		Ok(Json(EncodableBotVote::from(vote)))
	})
	.await
}
