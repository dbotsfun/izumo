mod scopes;

use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::Serialize;

pub use self::scopes::EndpointScope;
use crate::models::util::diesel::Conn;
use crate::models::User;
use crate::schema::api_tokens;
use crate::util::rfc3339;
use crate::util::token::{HashedToken, PlainToken};

/// The model representing a row in the `api_tokens` database table.
#[derive(Debug, Identifiable, Queryable, Selectable, Associations, Serialize)]
#[diesel(belongs_to(User), check_for_backend(diesel::pg::Pg))]
pub struct ApiToken {
	pub id: i32,
	#[serde(skip)]
	pub user_id: String,
	pub token_name: String,
	#[serde(with = "rfc3339")]
	pub created_at: NaiveDateTime,
	#[serde(with = "rfc3339::option")]
	pub last_used_at: Option<NaiveDateTime>,
	#[serde(skip)]
	pub revoked: bool,
	/// A list of endpoint scopes or `None` for the `legacy` endpoint scope (see RFC #2947)
	pub endpoint_scopes: Option<Vec<EndpointScope>>,
	#[serde(with = "rfc3339::option")]
	pub expired_at: Option<NaiveDateTime>,
}

impl ApiToken {
	/// Generates a new named API token for a user
	pub fn insert(conn: &mut impl Conn, user_id: &str, name: &str) -> QueryResult<CreatedApiToken> {
		Self::insert_with_scopes(conn, user_id, name, None, None)
	}

	pub fn insert_with_scopes(
		conn: &mut impl Conn,
		user_id: &str,
		name: &str,
		endpoint_scopes: Option<Vec<EndpointScope>>,
		expired_at: Option<NaiveDateTime>,
	) -> QueryResult<CreatedApiToken> {
		let token = PlainToken::generate();

		let model: ApiToken = diesel::insert_into(api_tokens::table)
			.values((
				api_tokens::user_id.eq(user_id),
				api_tokens::token_name.eq(name),
				api_tokens::token.eq(token.hashed()),
				api_tokens::endpoint_scopes.eq(endpoint_scopes),
				api_tokens::expired_at.eq(expired_at),
			))
			.returning(ApiToken::as_returning())
			.get_result(conn)?;

		Ok(CreatedApiToken {
			plaintext: token,
			model,
		})
	}

	pub fn find_by_api_token(conn: &mut impl Conn, token: &HashedToken) -> QueryResult<ApiToken> {
		use diesel::{dsl::now, update};

		let tokens = api_tokens::table
			.filter(api_tokens::revoked.eq(false))
			.filter(
				api_tokens::expired_at
					.is_null()
					.or(api_tokens::expired_at.gt(now)),
			)
			.filter(api_tokens::token.eq(token));

		// If the database is in read only mode, we can't update last_used_at.
		// Try updating in a new transaction, if that fails, fall back to reading
		conn.transaction(|conn| {
			update(tokens)
				.set(api_tokens::last_used_at.eq(now.nullable()))
				.returning(ApiToken::as_returning())
				.get_result(conn)
		})
		.or_else(|_| tokens.select(ApiToken::as_select()).first(conn))
		.map_err(Into::into)
	}
}

#[derive(Debug)]
pub struct CreatedApiToken {
	pub model: ApiToken,
	pub plaintext: PlainToken,
}
