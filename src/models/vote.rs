use crate::diesel::ExpressionMethods;
use crate::models::util::diesel::Conn;
use crate::models::Bot;
use crate::schema::bot_votes;
use chrono::NaiveDate;
use diesel::RunQueryDsl;
use diesel::{QueryResult, SelectableHelper};

#[derive(Queryable, Identifiable, Associations, Selectable, Debug, Clone)]
#[diesel(primary_key(bot_id, date), belongs_to(Bot))]
pub struct BotVote {
	pub bot_id: String,
	pub date: NaiveDate,
	pub votes: i32,
}

#[derive(Insertable, Debug, Clone)]
#[diesel(
    table_name = bot_votes,
    check_for_backend(diesel::pg::Pg),
)]
pub struct NewBotVote<'a> {
	pub bot_id: &'a str,
}

impl<'a> NewBotVote<'a> {
	pub fn new(bot_id: &'a str) -> NewBotVote {
		Self { bot_id }
	}

	pub fn create(&self, conn: &mut impl Conn) -> QueryResult<BotVote> {
		conn.transaction(|conn| {
			use crate::schema::bot_votes::dsl::*;

			let vote: BotVote = diesel::insert_into(bot_votes)
				.values(self)
				.on_conflict((bot_id, date))
				.do_update()
				.set(votes.eq(votes + 1))
				.returning(BotVote::as_returning())
				.get_result(conn)?;

			Ok(vote)
		})
	}
}
