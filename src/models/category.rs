use super::util::diesel::Conn;
use crate::models::Bot;
use crate::schema::*;
use diesel::{self, *};

#[derive(Clone, Identifiable, Queryable, QueryableByName, Debug)]
#[diesel(
    table_name = categories,
    check_for_backend(pg::Pg),
)]
pub struct Category {
	pub id: i32,
	pub category: String,
	pub slug: String,
	pub description: Option<String>,
	pub bots_cnt: i32,
	pub created_at: chrono::NaiveDateTime,
}

type WithSlug<'a> = dsl::Eq<categories::slug, crate::sql::lower<&'a str>>;

#[derive(Associations, Insertable, Identifiable, Debug, Clone, Copy)]
#[diesel(
    table_name = bots_categories,
    check_for_backend(pg::Pg),
    primary_key(bot_id, category_id),
    belongs_to(Category),
    belongs_to(Bot),
)]
pub struct BotCategory {
	bot_id: &'static str,
	category_id: i32,
}

impl Category {
	pub fn with_slug(slug: &str) -> WithSlug<'_> {
		categories::slug.eq(crate::sql::lower(slug))
	}

	#[dsl::auto_type(no_type_alias)]
	pub fn by_slug<'a>(slug: &'a str) -> _ {
		let filter: WithSlug<'a> = Self::with_slug(slug);
		categories::table.filter(filter)
	}

	pub fn update_bot(
		&self,
		conn: &mut impl Conn,
		bot: &Bot,
		slugs: &[&str],
	) -> QueryResult<Vec<String>> {
		conn.transaction(|conn| {
			let categories: Vec<Category> = categories::table
				.filter(categories::slug.eq_any(slugs))
				.load(conn)?;

			let invalid_categories = slugs
				.iter()
				.filter(|s| !categories.iter().any(|c| c.slug == **s))
				.map(ToString::to_string)
				.collect();

			let bot_categories = categories
				.iter()
				.map(|c| BotCategory {
					category_id: c.id,
					bot_id: bot.id.as_str(),
				})
				.collect::<Vec<_>>();

			delete(BotCategory::belonging_to(bot)).execute(conn)?;
			insert_into(bots_categories::table)
				.values(&bot_categories)
				.execute(conn)?;
			Ok(invalid_categories)
		})
	}

	pub fn count_toplevel(conn: &mut impl Conn) -> QueryResult<i64> {
		categories::table
			.filter(categories::category.not_like("%::%"))
			.count()
			.get_result(conn)
	}
}

#[derive(Insertable, AsChangeset, Default, Debug)]
#[diesel(table_name = categories, check_for_backend(diesel::pg::Pg))]
pub struct NewCategory<'a> {
	pub category: &'a str,
	pub slug: &'a str,
	pub description: &'a str,
}

impl<'a> NewCategory<'a> {
	/// Insert or update a category in the database.
	pub fn upsert(&self, conn: &mut impl Conn) -> QueryResult<Category> {
		insert_into(categories::table)
			.values(self)
			.on_conflict(categories::slug)
			.do_update()
			.set(self)
			.get_result(conn)
	}
}
