use super::helpers::pagination::*;
use crate::app::AppState;
use crate::models::Category;
use crate::schema::categories;
use crate::task::spawn_blocking;
use crate::util::errors::AppResult;
use crate::util::RequestUtils;
use crate::views::{EncodableCategory, EncodableCategoryWithSubcategories};
use axum::extract::Path;
use axum::http::request::Parts;
use axum::Json;
use diesel::prelude::*;
use diesel_async::async_connection_wrapper::AsyncConnectionWrapper;
use serde_json::Value;

/// Handles the `GET /categories` route.
pub async fn index(app: AppState, req: Parts) -> AppResult<Json<Value>> {
	let options = PaginationOptions::builder().gather(&req)?;

	let mut conn = app.db_read().await?;

	let query = req.query();
	let sort = query.get("sort").map_or("alpha", String::as_str);

	let offset = options.offset().unwrap_or_default();

	let categories = Category::toplevel(&mut conn, sort, options.per_page, offset).await?;
	let categories = categories
		.into_iter()
		.map(Category::into)
		.collect::<Vec<EncodableCategory>>();

	// Query for the total count of categories
	let total = Category::count_toplevel(&mut conn).await?;

	Ok(Json(json!({
		"categories": categories,
		"meta": { "total": total },
	})))
}

/// Handles the `GET /categories/:category_id` route.
pub async fn show(state: AppState, Path(slug): Path<String>) -> AppResult<Json<Value>> {
	let conn = state.db_read().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let cat: Category = Category::by_slug(&slug).first(conn)?;

		let cat = EncodableCategory::from(cat);
		let cat_with_subcats = EncodableCategoryWithSubcategories {
			id: cat.id,
			category: cat.category,
			slug: cat.slug,
			description: cat.description,
			created_at: cat.created_at,
			bots_cnt: cat.bots_cnt,
		};

		Ok(Json(json!({ "category": cat_with_subcats })))
	})
	.await
}

/// Handles the `GET /category_slugs` route.
pub async fn slugs(state: AppState) -> AppResult<Json<Value>> {
	let conn = state.db_read().await?;
	spawn_blocking(move || {
		let conn: &mut AsyncConnectionWrapper<_> = &mut conn.into();

		let slugs: Vec<Slug> = categories::table
			.select((categories::slug, categories::slug, categories::description))
			.order(categories::slug)
			.load(conn)?;

		#[derive(Serialize, Queryable)]
		struct Slug {
			id: String,
			slug: String,
			description: Option<String>,
		}

		Ok(Json(json!({ "category_slugs": slugs })))
	})
	.await
}
