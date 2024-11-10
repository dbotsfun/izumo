use crate::app::AppState;
use crate::models::{Bot, BotCategory, Category};
use crate::schema::{bots, bots_categories, categories};
use crate::util::errors::AppResult;
use crate::views::{EncodableBot, EncodableCategory};
use axum::Json;
use diesel::prelude::*;
use diesel::{BelongingToDsl, ExpressionMethods, QueryDsl, SelectableHelper};

use diesel_async::AsyncPgConnection;
use diesel_async::RunQueryDsl;
use serde_json::Value;

pub async fn summary(state: AppState) -> AppResult<Json<Value>> {
	let mut conn = state.db_read().await?;

	let popular_categories = Category::toplevel(&mut conn, "bots", 10, 0)
		.await?
		.into_iter()
		.map(Category::into)
		.collect::<Vec<EncodableCategory>>();

	let num_bots: i64 = bots::table.count().get_result(&mut conn).await?;

	async fn encode_bots(
		conn: &mut AsyncPgConnection,
		bot_list: Vec<Bot>,
	) -> AppResult<Vec<EncodableBot>> {
		use diesel_async::RunQueryDsl;

		let cats = BotCategory::belonging_to(&bot_list)
			.inner_join(categories::table)
			.select((bots_categories::bot_id, categories::slug))
			.load::<(String, String)>(conn)
			.await?;

		let encodable_bots = bot_list
			.into_iter()
			.map(|bot| {
				let bot_id = bot.id.clone();
				let cat_slugs = cats
					.iter()
					.filter(|(id, _)| *id == bot_id)
					.map(|(_, slug)| slug.clone())
					.collect::<Vec<_>>();

				EncodableBot::from_with_no_desc(bot, cat_slugs)
			})
			.collect();

		Ok(encodable_bots)
	}

	let selection = Bot::as_select();

	let new_bots = bots::table
		.order(bots::created_at.desc())
		.select(selection)
		.limit(10)
		.load(&mut conn)
		.await?;

	let just_updated = bots::table
		.filter(bots::updated_at.ne(bots::created_at))
		.order(bots::updated_at.desc())
		.select(selection)
		.limit(10)
		.load(&mut conn)
		.await?;

	// TODO: top rated, most voted
	Ok(Json(json!({
		"num_bots": num_bots,
		"new_bots": encode_bots(&mut conn, new_bots).await?,
		"just_updated": encode_bots(&mut conn, just_updated).await?,
		"popular_categories": popular_categories,
	})))
}
