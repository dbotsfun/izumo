use super::{bot::Bot, schema::bot_to_user, user::User, util::diesel::Conn};
use diesel::{pg::Pg, prelude::*};

#[derive(Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(
    table_name = bot_to_user,
    belongs_to(User, foreign_key = user_id),
    belongs_to(Bot, foreign_key = bot_id),
    primary_key(bot_id, user_id)
)]
#[allow(dead_code)] // Not used yet
pub struct BotToUser {
	bot_id: String,
	user_id: String,
	is_owner: bool,
	permissions: i32,
	created_at: chrono::NaiveDateTime,
}

type BoxedQuery<'a> = bot_to_user::BoxedQuery<'a, Pg, bot_to_user::SqlType>;

impl BotToUser {
	pub fn by_bot_id(bot_id: &String) -> BoxedQuery<'static> {
		bot_to_user::table
			.filter(bot_to_user::bot_id.eq(bot_id.to_owned()))
			.into_boxed()
	}

	pub fn find_owned_bots(conn: &mut impl Conn, user_id: &str) -> QueryResult<Vec<Bot>> {
		let bots = bot_to_user::table
			.filter(bot_to_user::user_id.eq(user_id))
			.inner_join(super::schema::bots::table)
			.select(super::schema::bots::all_columns)
			.load(conn)?;
		Ok(bots)
	}
}
