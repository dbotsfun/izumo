use crate::models::util::diesel::Conn;
use crate::models::{Bot, User};
use crate::schema::bot_reviews;
use diesel::{pg::Pg, prelude::*};

/// Represents the review of a bot by a reviewer. Each review contains a bot ID,
/// a user ID, optional notes, and the timestamp when the review was created.
#[derive(Identifiable, Selectable, Queryable, Associations, Debug, Clone)]
#[diesel(
    table_name = bot_reviews,
    belongs_to(User, foreign_key = user_id),
    belongs_to(Bot, foreign_key = bot_id),
    primary_key(bot_id, user_id)
)]
pub struct BotReview {
	/// ID of the bot being reviewed
	bot_id: String,

	/// ID of the user who reviewed the bot
	user_id: String,

	/// Optional notes associated with the review
	/// Notes are in the format `user_id:note`
	notes: Vec<Option<String>>,

	/// Timestamp of when the review was created
	created_at: chrono::NaiveDateTime,
}

/// Represents a boxed query for bot reviews, using PostgreSQL as the backend.
type BoxedQuery<'a> = bot_reviews::BoxedQuery<'a, Pg, bot_reviews::SqlType>;

impl BotReview {
	/// Returns a boxed query to fetch all reviews by a specific bot ID.
	///
	/// # Arguments
	///
	/// * `bot_id` - A reference to the ID of the bot whose reviews you want to fetch.
	///
	/// # Returns
	///
	/// A boxed query that can be executed to fetch reviews for the given bot ID.
	pub fn by_bot_id(bot_id: &String) -> BoxedQuery<'static> {
		bot_reviews::table
			.filter(bot_reviews::bot_id.eq(bot_id.to_owned()))
			.into_boxed()
	}
}

/// Represents the data needed to insert or update a bot review in the database.
#[derive(Insertable, AsChangeset, Default, Debug)]
#[diesel(table_name = bot_reviews, check_for_backend(diesel::pg::Pg))]
pub struct NewBotReview<'a> {
	/// ID of the bot being reviewed
	pub bot_id: &'a str,

	/// ID of the user reviewing the bot
	pub user_id: &'a str,

	/// Notes associated with the review, in the format `user_id:note`
	pub notes: Vec<Option<String>>,
}

/// Represents a note attached to a bot review, consisting of a user ID and the note content.
#[derive(Debug, Clone)]
pub struct Note<'a> {
	/// ID of the user who created the note
	pub user_id: &'a str,

	/// The content of the note
	pub note: &'a str,
}

impl<'a> Note<'a> {
	/// Creates a new note.
	///
	/// # Arguments
	///
	/// * `user_id` - The ID of the user creating the note.
	/// * `note` - The content of the note.
	///
	/// # Returns
	///
	/// A new instance of `Note`.
	pub fn new(user_id: &'a str, note: &'a str) -> Self {
		Self { user_id, note }
	}
}

impl std::fmt::Display for Note<'_> {
	/// Formats the note as `user_id:note` for display.
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		write!(f, "{}:{}", self.user_id, self.note)
	}
}

impl<'a> NewBotReview<'a> {
	/// Creates a new `NewBotReview` instance.
	///
	/// # Arguments
	///
	/// * `bot_id` - The ID of the bot being reviewed.
	/// * `user_id` - The ID of the user creating the review.
	///
	/// # Returns
	///
	/// A new `NewBotReview` instance with an empty notes list.
	pub fn new(bot_id: &'a str, user_id: &'a str) -> Self {
		Self {
			bot_id,
			user_id,
			notes: vec![],
		}
	}

	/// Adds a note to the review.
	///
	/// # Arguments
	///
	/// * `note` - A reference to the `Note` object to be added.
	///
	/// # Returns
	///
	/// A mutable reference to `self` for chaining.
	pub fn add_note(&mut self, note: &Note<'_>) -> &mut Self {
		self.notes.push(Some(note.to_string()));

		self
	}

	/// Removes a note from the review by its index.
	///
	/// # Arguments
	///
	/// * `index` - The index of the note to be removed.
	///
	/// # Returns
	///
	/// A mutable reference to `self` for chaining.
	pub fn remove_note(&mut self, index: usize) -> &mut Self {
		self.notes.remove(index);

		self
	}

	/// Inserts or updates the review in the database.
	///
	/// If a review with the same `bot_id` and `user_id` already exists, it is updated with the new
	/// values; otherwise, a new review is inserted.
	///
	/// # Arguments
	///
	/// * `conn` - A mutable reference to a Diesel database connection.
	///
	/// # Returns
	///
	/// A result containing the inserted or updated `BotReview`, or an error if the operation fails.
	pub fn upsert(&self, conn: &mut impl Conn) -> QueryResult<BotReview> {
		diesel::insert_into(bot_reviews::table)
			.values(self)
			.on_conflict(bot_reviews::notes)
			.do_update()
			.set(self)
			.get_result(conn)
	}
}
