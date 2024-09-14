use super::BotOwner;
use crate::models::util::diesel::Conn;
use crate::models::Bot;
use crate::schema::{bot_owners, users};
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

/// User model
#[derive(
	Debug,
	Serialize,
	Deserialize,
	Queryable,
	Identifiable,
	PartialEq,
	Selectable,
	AsChangeset,
	Eq,
	Clone,
)]
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

impl User {
	/// Get the user by their ID.
	pub fn find(conn: &mut impl Conn, id: &str) -> QueryResult<User> {
		users::table.find(id).first(conn)
	}

	pub fn owning(bot: &Bot, conn: &mut impl Conn) -> QueryResult<Vec<User>> {
		let users = BotOwner::boxed()
			.inner_join(users::table)
			.select(users::all_columns)
			.filter(bot_owners::bot_id.eq(bot.clone().id))
			.load(conn)?;

		Ok(users)
	}
}

#[derive(Insertable, AsChangeset, Default, Debug)]
#[diesel(table_name = users, check_for_backend(diesel::pg::Pg))]
pub struct NewUser<'a> {
	pub id: &'a str,
	pub username: &'a str,
	pub avatar: Option<&'a str>,
	pub banner: Option<&'a str>,
	pub bio: Option<&'a str>,
}

impl<'a> NewUser<'a> {
	pub fn new(id: &'a str, username: &'a str, avatar: Option<&'a str>) -> NewUser<'a> {
		NewUser {
			id,
			username,
			avatar,
			banner: None,
			bio: None,
		}
	}

	/// Insert or update the user in the database.
	pub fn upsert(&self, conn: &mut impl Conn) -> QueryResult<User> {
		diesel::insert_into(users::table)
			.values(self)
			.on_conflict(users::id)
			.do_update()
			.set(self)
			.get_result(conn)
	}
}
