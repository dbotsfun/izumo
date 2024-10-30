use crate::models::util::diesel::Conn;
use crate::models::{BotOwner, User};
use crate::schema::{bot_owners, bots, users};
use crate::sql::pg_enum;
use crate::util::errors::AppResult;
use derivative::Derivative;
use diesel::prelude::*;
use diesel::{deserialize::FromSqlRow, expression::AsExpression};
use serde::{Deserialize, Serialize};

pg_enum! {
	pub enum BotStatus {
		PENDING = 0,
		DENIED = 1,
		APPROVED = 2,
	}
}

impl From<BotStatus> for &'static str {
	fn from(status: BotStatus) -> Self {
		match status {
			BotStatus::PENDING => "PENDING",
			BotStatus::DENIED => "DENIED",
			BotStatus::APPROVED => "APPROVED",
		}
	}
}

impl From<BotStatus> for String {
	fn from(status: BotStatus) -> Self {
		let string: &'static str = status.into();

		string.into()
	}
}

pg_enum! {
	pub enum BotLanguages {
		ENGLISH = 0,
		SPANISH = 1,
		GERMAN = 2,
		JAPANESE = 3,
		CHINESE = 4,
	}
}

impl From<BotLanguages> for &'static str {
	fn from(lang: BotLanguages) -> Self {
		match lang {
			BotLanguages::ENGLISH => "English",
			BotLanguages::SPANISH => "Spanish",
			BotLanguages::GERMAN => "German",
			BotLanguages::JAPANESE => "Japanese",
			BotLanguages::CHINESE => "Chinese",
		}
	}
}

impl From<BotLanguages> for String {
	fn from(status: BotLanguages) -> Self {
		let string: &'static str = status.into();

		string.into()
	}
}

/// Bot model
#[derive(Debug, Clone, Queryable, Identifiable, AsChangeset, QueryableByName, Selectable)]
#[diesel(
    table_name = bots,
    check_for_backend(diesel::pg::Pg),
)]
pub struct Bot {
	/// Unique identifier
	pub id: String,
	/// Name of the bot
	pub name: String,
	/// Avatar hash of the bot
	pub avatar: Option<String>,
	/// Whether the bot is certified
	pub certified: bool,
	/// Banner URL
	pub banner: Option<String>,
	/// Status of the bot
	pub status: BotStatus,
	/// Description of the bot
	pub description: String,
	/// Short description of the bot
	pub short_description: String,
	/// Default prefix of the bot
	pub prefix: String,
	/// Whether the bot uses slash commands
	pub is_slash: bool,
	/// GitHub repository URL
	pub github: Option<String>,
	/// Website URL
	pub website: Option<String>,
	/// Invite link to add the bot
	pub invite_link: Option<String>,
	/// Support server invite link
	pub support_server: Option<String>,
	/// API key for the bot
	pub api_key: Option<String>,
	/// Where the bot was imported from (if any)
	pub imported_from: Option<String>,
	/// When the bot was created
	pub created_at: chrono::NaiveDateTime,
	/// Last time the bot was updated
	pub updated_at: chrono::NaiveDateTime,
	/// Yeah
	pub supported_languages: Vec<Option<BotLanguages>>,
	/// Approximate Guild Count
	pub guild_count: i32,
}

impl Bot {
	pub fn find(conn: &mut impl Conn, id: &str) -> QueryResult<Bot> {
		bots::table.find(id).first(conn)
	}

	pub fn owners(&self, conn: &mut impl Conn) -> AppResult<Vec<User>> {
		let owners = BotOwner::by_bot_id(&self.id)
			.inner_join(users::table)
			.select(users::all_columns)
			.load(conn)?;

		Ok(owners)
	}
}

impl From<Bot> for crate::views::OwnedBot {
	fn from(btu: Bot) -> Self {
		crate::views::OwnedBot {
			id: btu.id,
			name: btu.name,
		}
	}
}

#[derive(Insertable, Debug, Default)]
#[diesel(
    table_name = bots,
    check_for_backend(diesel::pg::Pg)
)]
pub struct NewBot<'a> {
	pub id: &'a str,
	pub name: &'a str,
	pub avatar: Option<&'a str>,
	pub certified: bool,
	pub banner: Option<&'a str>,
	pub description: &'a str,
	pub short_description: &'a str,
	pub prefix: &'a str,
	pub is_slash: bool,
	pub github: Option<&'a str>,
	pub website: Option<&'a str>,
	pub invite_link: Option<&'a str>,
	pub support_server: Option<&'a str>,
	pub api_key: Option<&'a str>,
	pub imported_from: Option<&'a str>,
	pub supported_languages: Vec<Option<BotLanguages>>,
	pub guild_count: i32,
}

#[derive(Debug, Default, Derivative)]
pub struct NewBotBuilder<'a> {
	pub id: &'a str,
	pub name: &'a str,
	pub avatar: Option<&'a str>,
	pub banner: Option<&'a str>,
	pub description: &'a str,
	pub short_description: &'a str,
	pub prefix: &'a str,
	#[derivative(Default(value = "false"))]
	pub is_slash: bool,
	pub imported_from: Option<&'a str>,
	pub github: Option<&'a str>,
	pub website: Option<&'a str>,
	pub invite_link: Option<&'a str>,
	pub support_server: Option<&'a str>,
	pub supported_languages: Vec<Option<BotLanguages>>,
	pub guild_count: i32,
}

impl<'a> NewBot<'a> {
	pub fn new(options: NewBotBuilder<'a>) -> Self {
		let NewBotBuilder {
			id,
			name,
			avatar,
			banner,
			description,
			short_description,
			prefix,
			is_slash,
			imported_from,
			github,
			website,
			invite_link,
			support_server,
			supported_languages,
			guild_count,
		} = options;

		Self {
			id,
			name,
			avatar,
			banner,
			certified: false,
			description,
			short_description,
			prefix,
			is_slash,
			github,
			website,
			invite_link,
			support_server,
			api_key: None,
			imported_from,
			supported_languages,
			guild_count,
		}
	}

	pub fn create(&self, conn: &mut impl Conn, user_id: String) -> QueryResult<Bot> {
		conn.transaction(|conn| {
			let bot: Bot = diesel::insert_into(bots::table)
				.values(self)
				.on_conflict_do_nothing()
				.returning(Bot::as_returning())
				.get_result(conn)?;

			let owner = BotOwner {
				bot_id: bot.id.clone(),
				user_id,
				is_owner: true,
				permissions: 0,
				created_at: chrono::Utc::now().naive_utc(),
			};

			diesel::insert_into(bot_owners::table)
				.values(&owner)
				.execute(conn)?;

			Ok(bot)
		})
	}
}
