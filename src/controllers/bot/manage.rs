use crate::app::AppState;
use crate::auth::AuthCheck;
use crate::middleware::log_request::RequestLogExt;
use crate::models::bot::{NewBot, NewBotBuilder};
use crate::models::token::EndpointScope;
use crate::models::util::diesel::Conn;
use crate::schema::*;
use crate::task::spawn_blocking;
use crate::util::errors::{bad_request, AppResult};
use crate::views::{EncodableBot, GoodBot, PublishWarnings};
use axum::http::request::Parts;
use axum::Json;
use diesel::dsl::{exists, select};
use diesel::prelude::*;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;

#[derive(Deserialize)]
pub struct RequestNewBot {
    pub id: String,
    pub name: String,
    pub avatar: Option<String>,
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
    let request_log = parts.request_log();
    request_log.add("bot_id", bot.id.clone());
    request_log.add("bot_name", bot.name.clone());

    let conn = app.db_write().await?;
    spawn_blocking(move || {
        let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

        let auth = AuthCheck::default()
            .with_endpoint_scope(EndpointScope::PublishNew)
            .for_bot(&bot.id)
            .check(&parts, conn)?;

        let user = auth.user();

        let categories = bot.categories.clone();

        if categories.len() > 2 || categories.len() < 8 {
            return Err(bad_request("expected between 2 and 8 categories at most."));
        }

        conn.transaction(|conn| {
            let categories = categories.iter().map(|c| c.as_str()).collect::<Vec<_>>();

            let persist = NewBot::new(NewBotBuilder {
                id: bot.id.as_str(),
                name: bot.name.as_str(),
                avatar: bot.avatar.as_deref(),
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
            });

            if bot_exists(persist.id, conn)? {
                return Err(bad_request("bot already exists"));
            }

            let bot = persist.create(conn, user.id.clone())?;

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
