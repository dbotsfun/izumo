use super::BotOwner;
use crate::models::util::diesel::Conn;
use crate::models::Bot;
use crate::schema::{bot_owners, users};
use diesel::prelude::*;

/// User model
#[derive(Clone, Debug, PartialEq, Eq, Queryable, Identifiable, AsChangeset)]
#[diesel(table_name = users, check_for_backend(diesel::pg::Pg))]
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
	/// When the user was created.
	pub created_at: chrono::NaiveDateTime,
	/// Last time the user changed something.
	pub updated_at: chrono::NaiveDateTime,
	/// Discord access token
	pub dc_access_token: String,
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

#[derive(Insertable, Debug, Default)]
#[diesel(table_name = users, check_for_backend(diesel::pg::Pg))]
pub struct NewUser<'a> {
	pub id: &'a str,
	pub username: &'a str,
	pub avatar: Option<&'a str>,
	pub dc_access_token: &'a str,
}

impl<'a> NewUser<'a> {
	pub fn new(
		id: &'a str,
		username: &'a str,
		avatar: Option<&'a str>,
		dc_access_token: &'a str,
	) -> NewUser<'a> {
		NewUser {
			id,
			username,
			avatar,
			dc_access_token,
		}
	}

	/// Insert or update the user in the database.
	pub fn upsert(&self, conn: &mut impl Conn) -> QueryResult<User> {
		use diesel::pg::upsert::excluded;

		diesel::insert_into(users::table)
			.values(self)
			.on_conflict(users::id)
			.do_update()
			.set((
				users::username.eq(excluded(users::username)),
				users::avatar.eq(excluded(users::avatar)),
				users::dc_access_token.eq(excluded(users::dc_access_token)),
			))
			.get_result(conn)
	}
}
