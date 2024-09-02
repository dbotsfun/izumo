use super::schema::{bots, users};
use super::sql::pg_enum;
use super::util::diesel::Conn;
use super::{BotOwner, User};
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

/// Bot model
#[derive(Clone, Debug, PartialEq, Eq, Queryable)]
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
	/// Github repository URL
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
	pub created_at: chrono::NaiveDateTime,
	pub updated_at: chrono::NaiveDateTime,
}

#[derive(Debug, Default, Derivative)]
pub struct NewBotBuilder<'a> {
	pub id: &'a str,
	pub name: &'a str,
	pub avatar: Option<&'a str>,
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
}

impl<'a> NewBot<'a> {
	pub fn new(options: NewBotBuilder<'a>) -> Self {
		let NewBotBuilder {
			id,
			name,
			avatar,
			description,
			short_description,
			prefix,
			is_slash,
			imported_from,
			github,
			website,
			invite_link,
			support_server,
		} = options;

		Self {
			id,
			name,
			avatar,
			banner: None,
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
			created_at: chrono::Utc::now().naive_utc(),
			updated_at: chrono::Utc::now().naive_utc(),
		}
	}
}
