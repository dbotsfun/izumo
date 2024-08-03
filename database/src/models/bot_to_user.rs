use crate::{
	models::{Bot, User},
	schema::bot_to_user,
};
use diesel::{pg::Pg, prelude::*};

#[derive(Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(
    table_name = bot_to_user,
    belongs_to(User, foreign_key = A),
    belongs_to(Bot, foreign_key = B),
    primary_key(A, B)
)]
#[allow(dead_code)] // Not used yet
pub struct BotToUser {
	#[diesel(column_name = "A")]
	bot_id: String,
	#[diesel(column_name = "B")]
	user_id: String,
	is_owner: bool,
	permissions: i32,
	created_at: chrono::NaiveDateTime,
}

type BoxedQuery<'a> = bot_to_user::BoxedQuery<'a, Pg, bot_to_user::SqlType>;

impl BotToUser {
	pub fn by_bot_id(bot_id: &String) -> BoxedQuery<'static> {
		bot_to_user::table
			.filter(bot_to_user::A.eq(bot_id.to_owned()))
			.into_boxed()
	}
}
