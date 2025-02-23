use crate::app::AppState;
use crate::models::category::{BotCategory, Category};
use crate::models::{Bot, BotVote};
use crate::schema::{bot_votes, categories};
use crate::util::errors::{bad_request, AppResult, BoxedAppError};
use crate::util::request_helper::RequestUtils;
use crate::views::{EncodableBot, EncodableBotVote, EncodableCategory};
use axum::extract::Path;
use axum::http::request::Parts;
use axum::Json;
use diesel::dsl::*;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;
use serde_json::Value;
use std::str::FromStr;

/// Handles the `GET /bots/:bot_id`
pub async fn show(app: AppState, Path(id): Path<String>, req: Parts) -> AppResult<Json<Value>> {
	let mut conn = app.db_read().await?;

	let include = req
		.query()
		.get("include")
		.map(|mode| ShowIncludeMode::from_str(mode))
		.transpose()?
		.unwrap_or_default();

	let bot = Bot::find(&mut conn, &id).await?;

	let cats = if include.categories {
		Some(
			BotCategory::belonging_to(&bot)
				.inner_join(categories::table)
				.select(categories::all_columns)
				.load(&mut conn)
				.await?,
		)
	} else {
		None
	};

	let votes = if include.votes {
		Some(
			BotVote::belonging_to(&bot)
				.filter(bot_votes::date.gt(date(now - 90.days())))
				.order((bot_votes::date.asc(), bot_votes::bot_id.desc()))
				.load(&mut conn)
				.await?
				.into_iter()
				.map(BotVote::into)
				.collect::<Vec<EncodableBotVote>>(),
		)
	} else {
		None
	};

	let encodable_bot = EncodableBot::from(bot.clone(), cats.as_deref());

	let encodable_cats = cats.map(|cats| {
		cats.into_iter()
			.map(Category::into)
			.collect::<Vec<EncodableCategory>>()
	});

	Ok(Json(json!({
		"bot": encodable_bot,
		"categories": encodable_cats,
		"votes": votes,
	})))
}

#[derive(Debug)]
struct ShowIncludeMode {
	categories: bool,
	votes: bool,
}

impl Default for ShowIncludeMode {
	fn default() -> Self {
		Self {
			categories: true,
			votes: false,
		}
	}
}

impl ShowIncludeMode {
	const INVALID_COMPONENT: &'static str =
		"Invalid component for ?include= (available: categories)";
}

impl FromStr for ShowIncludeMode {
	type Err = BoxedAppError;

	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let mut mode = ShowIncludeMode {
			categories: false,
			votes: false,
		};

		for component in s.split(',') {
			match component {
				"" => {}
				"full" => {
					mode = Self {
						categories: true,
						votes: true,
					}
				}
				"categories" => mode.categories = true,
				"votes" => mode.votes = true,
				_ => return Err(bad_request(Self::INVALID_COMPONENT)),
			}
		}

		Ok(mode)
	}
}
