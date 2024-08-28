use super::{schema::users, util::diesel::Conn};
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
}
