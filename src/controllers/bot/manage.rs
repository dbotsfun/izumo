use crate::app::AppState;
use crate::auth::AuthCheck;
use crate::middleware::log_request::{RequestLog, RequestLogExt};
use crate::models::bot::{NewBot, NewBotBuilder};
use crate::models::token::EndpointScope;
use crate::models::util::diesel::Conn;
use crate::models::Category;
use crate::schema::*;
use crate::task::spawn_blocking;
use crate::util::errors::{bad_request, server_error, AppResult};
use crate::views::{EncodableBot, GoodBot, PublishWarnings};
use axum::http::request::Parts;
use axum::Json;
use diesel::dsl::{exists, select};
use diesel::prelude::*;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;

#[derive(Deserialize)]
pub struct RequestNewBot {
	pub id: String,
	pub description: String,
	pub short_description: String,
	pub prefix: String,
	pub is_slash: bool,
	pub invite_link: Option<String>,
	pub categories: Vec<String>,
}

/// Handles the `POST /bots/new` route.
pub async fn publish(
	app: AppState,
	parts: Parts,
	Json(bot): Json<RequestNewBot>,
) -> AppResult<Json<GoodBot>> {
	let request_log = parts.request_log().clone();
	request_log.add("bot_id", bot.id.clone());

	let conn = app.db_write().await?;
	spawn_blocking(move || {
        let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

        let auth = AuthCheck::default()
            .with_endpoint_scope(EndpointScope::PublishNew)
            .for_bot(&bot.id)
            .check(&parts, conn)?;

        let user = auth.user();

        let categories = bot.categories.clone();

        if categories.len() < 2 || categories.len() > 8 {
            return Err(bad_request("2 to 8 categories are expected at most."));
        }

        conn.transaction(|conn| {
            let categories = categories.iter().map(|c| c.as_str()).collect::<Vec<_>>();
            let bot_id = bot.id.as_str();

            if bot_exists(bot_id, conn)? {
                return Err(bad_request("bot already exists"));
            }

            let bot_info = get_bot_information(&app.clone(), &request_log, bot_id)?;

            let persist = NewBot::new(NewBotBuilder {
                id: bot_id,
                name: bot_info.bot.username.as_str(),
                avatar: Some(bot_info.bot.avatar.as_str()),
                banner: None,
                description: bot.description.as_str(),
                short_description: bot.short_description.as_str(),
                prefix: bot.prefix.as_str(),
                is_slash: bot.is_slash,
                github: None,
                website: None,
                invite_link: bot.invite_link.as_deref(),
                imported_from: None,
                support_server: None,
                supported_languages: vec![None],
                guild_count: bot_info.bot.approximate_guild_count,
            });

            let bot = persist.create(conn, user.id.clone())?;

            let unknown_categories = Category::update_bot(conn, &bot_id.to_owned(), &categories)?;
            if !unknown_categories.is_empty() {
                let unknown_categories = unknown_categories.join(", ");
                let domain = &app.config.domain_name;
                return Err(bad_request(format!("The following category slugs are not currently supported on {domain}: {unknown_categories}\n\nSee https://{domain}/category_slugs for a list of supported slugs.")));
            }

            let warnings = PublishWarnings {
                invalid_categories: vec![],
                other: vec![],
            };

            Ok(Json(GoodBot {
                bot: EncodableBot::from_minimal(bot),
                warnings,
            }))
        })
    })
        .await
}

fn bot_exists(id: &str, conn: &mut impl Conn) -> QueryResult<bool> {
	select(exists(bots::table.filter(bots::id.eq(id)))).get_result(conn)
}

#[derive(Serialize, Deserialize)]
pub struct APIBot {
	pub application: Application,
	pub bot: Bot,
}

#[derive(Serialize, Deserialize)]
pub struct Application {
	pub id: String,
	pub name: String,
	pub icon: String,
	pub description: String,
	pub is_verified: bool,
	pub bot_public: bool,
	// maybe I'm going to use this in a future.
	// pub tags: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Bot {
	pub id: String,
	pub username: String,
	pub avatar: String,
	pub bot: bool,
	pub approximate_guild_count: i32,
}

/// Gets information about the bot directly from the Discord API.
fn get_bot_information(
	state: &AppState,
	request_log: &RequestLog,
	bot_id: &str,
) -> AppResult<APIBot> {
	let domain = state.config.domain_name.as_str();
	let bot = state
        .http
        .get(format!(
            "https://discord.com/api/v9/oauth2/authorize?client_id={bot_id}&scope=bot"
        ))
        .header("Authorization", &state.config.discord.user_token)
        .send()?
        .json::<APIBot>()
        .map_err(|err| {
            request_log.add("cause", err);
            server_error(format!("Error getting bot information from Discord. If the error persists, please report it on our Discord server https://dc.{domain}"))
        })?;

	Ok(bot)
}
