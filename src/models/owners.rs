use crate::models::util::diesel::Conn;
use crate::models::{Bot, User};
use crate::schema::{bot_owners, bots};
use diesel::{pg::Pg, prelude::*};

#[derive(Insertable, Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(
    table_name = bot_owners,
	check_for_backend(diesel::pg::Pg),
    belongs_to(User, foreign_key = user_id),
    belongs_to(Bot, foreign_key = bot_id),
    primary_key(bot_id, user_id)
)]
pub struct BotOwner {
	pub bot_id: String,
	pub user_id: String,
	pub is_owner: bool,
	pub permissions: i32,
	pub created_at: chrono::NaiveDateTime,
}

type BoxedQuery<'a> = bot_owners::BoxedQuery<'a, Pg, bot_owners::SqlType>;

impl BotOwner {
	pub fn by_bot_id(bot_id: &String) -> BoxedQuery<'static> {
		bot_owners::table
			.filter(bot_owners::bot_id.eq(bot_id.to_owned()))
			.into_boxed()
	}

	pub fn find_owned_bots(conn: &mut impl Conn, user_id: &str) -> QueryResult<Vec<Bot>> {
		let bots = bot_owners::table
			.filter(bot_owners::user_id.eq(user_id))
			.inner_join(bots::table)
			.select(bots::all_columns)
			.load(conn)?;

		Ok(bots)
	}

	pub fn boxed() -> BoxedQuery<'static> {
		bot_owners::table.into_boxed()
	}
}
