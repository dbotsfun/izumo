use std::io::Write;

use crate::{
	models::BotToUser,
	schema::{bots, users},
	util::diesel::Conn,
};
use derivative::Derivative;
use diesel::{
	deserialize::{self, FromSql, FromSqlRow},
	expression::AsExpression,
	pg::{Pg, PgValue},
	prelude::*,
	serialize::{self, IsNull, Output, ToSql},
	sql_types::SqlType,
};
use serde::{Deserialize, Serialize};

use super::User;

#[derive(SqlType)]
#[diesel(postgres_type(name = "BotStatus"))]
pub struct BotStatus;

#[derive(Serialize, Deserialize, Debug, PartialEq, FromSqlRow, AsExpression, Eq, Default)]
#[diesel(sql_type = BotStatus)]
pub enum BotStatusEnum {
	#[default]
	PENDING,
	DENIED,
	APPROVED,
}

impl ToSql<BotStatus, Pg> for BotStatusEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			BotStatusEnum::DENIED => out.write_all(b"DENIED")?,
			BotStatusEnum::PENDING => out.write_all(b"PENDING")?,
			BotStatusEnum::APPROVED => out.write_all(b"APPROVED")?,
		}
		Ok(IsNull::No)
	}
}

impl FromSql<BotStatus, Pg> for BotStatusEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"DENIED" => Ok(BotStatusEnum::DENIED),
			b"PENDING" => Ok(BotStatusEnum::PENDING),
			b"APPROVED" => Ok(BotStatusEnum::APPROVED),
			_ => Err("Unrecognized enum variant".into()),
		}
	}
}

/// Bot model
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, PartialEq, Selectable)]
#[diesel(belongs_to(BotToUser))]
#[diesel(table_name = bots)]
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
	pub status: BotStatusEnum,
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

#[derive(Insertable, Debug, Default)]
#[diesel(table_name = bots, check_for_backend(diesel::pg::Pg))]
pub struct NewBot<'a> {
	pub id: &'a str,
	pub name: &'a str,
	pub avatar: Option<&'a str>,
	pub certified: bool,
	pub banner: Option<&'a str>,
	pub status: BotStatusEnum,
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
			status: BotStatusEnum::PENDING,
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

impl Bot {
	pub fn find(conn: &mut impl Conn, id: &str) -> QueryResult<Bot> {
		bots::table.find(id).first(conn)
	}

	pub fn owners(&self, conn: &mut impl Conn) -> QueryResult<Vec<User>> {
		let owners = BotToUser::by_bot_id(&self.id)
			.inner_join(users::table)
			.select(users::all_columns)
			.load(conn)?;

		Ok(owners)
	}
}
