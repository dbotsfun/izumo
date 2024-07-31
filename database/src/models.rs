use std::io::Write;

use crate::schema::{bots, users};
use diesel::{
	deserialize::{self, FromSql, FromSqlRow},
	expression::AsExpression,
	pg::{Pg, PgValue},
	prelude::*,
	serialize::{self, IsNull, Output, ToSql},
	sql_types::SqlType,
};
use serde::{Deserialize, Serialize};

/// User model
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, PartialEq, Selectable)]
#[diesel(table_name = users)]
pub struct User {
	/// Unique identifier for the user.
	pub id: String,
	/// Discord username of the user.
	pub username: String,
	/// Avatar hash of the user.
	pub avatar: Option<String>,
	/// Banner URL of the user.
	pub banner: Option<String>,
	/// A beautiful biography.
	pub bio: Option<String>,
	/// Permissions bitfield
	pub permissions: i32,
	/// When the user was created.
	pub created_at: chrono::NaiveDateTime,
	/// Last time the user changed something.
	pub updated_at: chrono::NaiveDateTime,
}

#[derive(SqlType)]
#[diesel(postgres_type(name = "BotStatus"))]
pub struct BotStatus;

#[derive(Serialize, Deserialize, Debug, PartialEq, FromSqlRow, AsExpression, Eq)]
#[diesel(sql_type = BotStatus)]
pub enum BotStatusEnum {
	DENIED,
	PENDING,
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
	/// Owner ID
	pub owner_id: String,
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
