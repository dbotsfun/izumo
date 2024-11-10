use crate::app::AppState;
use crate::models::{Bot, Category};
use crate::schema::bots;
use crate::task::spawn_blocking;
use crate::util::errors::AppResult;
use crate::views::{EncodableBot, EncodableCategory};
use axum::Json;
use diesel::prelude::*;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;
use serde_json::Value;

pub async fn summary(state: AppState) -> AppResult<Json<Value>> {
	let mut conn = state.db_read().await?;

	let popular_categories = Category::toplevel(&mut conn, "bots", 10, 0)
		.await?
		.into_iter()
		.map(Category::into)
		.collect::<Vec<EncodableCategory>>();

	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let num_bots: i64 = bots::table.count().get_result(conn)?;

		fn encode_bots(bot_list: Vec<Bot>) -> AppResult<Vec<EncodableBot>> {
			bot_list
				.into_iter()
				.map(|b| Ok(EncodableBot::from_minimal(b)))
				.collect()
		}

		let selection = Bot::as_select();

		let new_bots = bots::table
			.order(bots::created_at.desc())
			.select(selection)
			.limit(10)
			.load(conn)?;

		let just_updated = bots::table
			.filter(bots::updated_at.ne(bots::created_at))
			.order(bots::updated_at.desc())
			.select(selection)
			.limit(10)
			.load(conn)?;

		// TODO: top rated, most voted
		Ok(Json(json!({
			"num_bots": num_bots,
			"new_bots": encode_bots(new_bots)?,
			"just_updated": encode_bots(just_updated)?,
			"popular_categories": popular_categories,
		})))
	})
	.await
}
