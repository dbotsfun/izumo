use crate::models::Bot;
use crate::schema::bot_votes;
use chrono::NaiveDate;

#[derive(Queryable, Identifiable, Associations, Debug, Clone)]
#[diesel(primary_key(bot_id, date), belongs_to(Bot))]
pub struct BotVote {
	pub bot_id: String,
	pub date: NaiveDate,
	pub votes: i32,
}
