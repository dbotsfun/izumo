use super::util::diesel::Conn;
use crate::models::Bot;
use crate::schema::*;
use diesel::{
	delete, dsl, insert_into, pg, sql_query, ExpressionMethods, QueryDsl, QueryResult,
	TextExpressionMethods,
};

use diesel_async::AsyncPgConnection;

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

#[derive(Associations, Insertable, Identifiable, Debug, Clone)]
#[diesel(
    table_name = bots_categories,
    check_for_backend(pg::Pg),
    primary_key(bot_id, category_id),
    belongs_to(Category),
    belongs_to(Bot),
)]
pub struct BotCategory {
	bot_id: String,
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
		conn: &mut impl Conn,
		bot_id: &String,
		slugs: &[&str],
	) -> QueryResult<Vec<String>> {
		use diesel::RunQueryDsl;
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
					bot_id: bot_id.clone(),
				})
				.collect::<Vec<_>>();

			delete(bots_categories::table)
				.filter(bots_categories::bot_id.eq(bot_id.as_str()))
				.execute(conn)?;

			insert_into(bots_categories::table)
				.values(&bot_categories)
				.execute(conn)?;

			Ok(invalid_categories)
		})
	}

	pub async fn count_toplevel(conn: &mut AsyncPgConnection) -> QueryResult<i64> {
		use diesel_async::RunQueryDsl;
		categories::table
			.filter(categories::category.not_like("%::%"))
			.count()
			.get_result(conn)
			.await
	}
	pub async fn toplevel(
		conn: &mut AsyncPgConnection,
		sort: &str,
		limit: i64,
		offset: i64,
	) -> QueryResult<Vec<Category>> {
		use diesel::sql_types::Int8;
		use diesel_async::RunQueryDsl;

		let sort_sql = match sort {
			"bots" => "ORDER BY bots_cnt DESC",
			_ => "ORDER BY category ASC",
		};

		// Collect all the top-level categories and sum up the bots_cnt of
		// the bots in all subcategories
		sql_query(format!(include_str!("toplevel.sql"), sort_sql))
			.bind::<Int8, _>(limit)
			.bind::<Int8, _>(offset)
			.load(conn)
			.await
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
		use diesel::RunQueryDsl;
		insert_into(categories::table)
			.values(self)
			.on_conflict(categories::slug)
			.do_update()
			.set(self)
			.get_result(conn)
	}
}
