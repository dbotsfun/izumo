// @generated automatically by Diesel CLI.

diesel::table! {
	/// Representation of the `api_tokens` table.
	///
	/// (Automatically generated by Diesel.)
	api_tokens (id) {
		/// The `id` column of the `api_tokens` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		id -> Int4,
		/// The `user_id` column of the `api_tokens` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		user_id -> Varchar,
		/// The `token_name` column of the `api_tokens` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		token_name -> Varchar,
		/// The `token` column of the `api_tokens` table.
		///
		/// Its SQL type is `Bytea`.
		///
		/// (Automatically generated by Diesel.)
		token -> Bytea,
		/// The `last_used_at` column of the `api_tokens` table.
		///
		/// Its SQL type is `Nullable<Timestamp>`.
		///
		/// (Automatically generated by Diesel.)
		last_used_at -> Nullable<Timestamp>,
		/// The `revoked` column of the `api_tokens` table.
		///
		/// Its SQL type is `Bool`.
		///
		/// (Automatically generated by Diesel.)
		revoked -> Bool,
		/// The `endpoint_scopes` column of the `api_tokens` table.
		///
		/// Its SQL type is `Nullable<Array<Nullable<Text>>>`.
		///
		/// (Automatically generated by Diesel.)
		endpoint_scopes -> Nullable<Array<Nullable<Text>>>,
		/// The `expired_at` column of the `api_tokens` table.
		///
		/// Its SQL type is `Nullable<Timestamp>`.
		///
		/// (Automatically generated by Diesel.)
		expired_at -> Nullable<Timestamp>,
		/// The `created_at` column of the `api_tokens` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		created_at -> Timestamp,
	}
}

diesel::table! {
	/// Representation of the `bot_owners` table.
	///
	/// (Automatically generated by Diesel.)
	bot_owners (bot_id, user_id) {
		/// The `bot_id` column of the `bot_owners` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		bot_id -> Varchar,
		/// The `user_id` column of the `bot_owners` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		user_id -> Varchar,
		/// The `is_owner` column of the `bot_owners` table.
		///
		/// Its SQL type is `Bool`.
		///
		/// (Automatically generated by Diesel.)
		is_owner -> Bool,
		/// The `permissions` column of the `bot_owners` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		permissions -> Int4,
		/// The `created_at` column of the `bot_owners` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		created_at -> Timestamp,
	}
}

diesel::table! {
	/// Representation of the `bot_reviews` table.
	///
	/// (Automatically generated by Diesel.)
	bot_reviews (bot_id, user_id) {
		/// The `bot_id` column of the `bot_reviews` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		bot_id -> Varchar,
		/// The `user_id` column of the `bot_reviews` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		user_id -> Varchar,
		/// The `notes` column of the `bot_reviews` table.
		///
		/// Its SQL type is `Array<Nullable<Text>>`.
		///
		/// (Automatically generated by Diesel.)
		notes -> Array<Nullable<Text>>,
		/// The `created_at` column of the `bot_reviews` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		created_at -> Timestamp,
	}
}

diesel::table! {
	/// Representation of the `bots` table.
	///
	/// (Automatically generated by Diesel.)
	bots (id) {
		/// The `id` column of the `bots` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		id -> Varchar,
		/// The `name` column of the `bots` table.
		///
		/// Its SQL type is `Text`.
		///
		/// (Automatically generated by Diesel.)
		name -> Text,
		/// The `avatar` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		avatar -> Nullable<Text>,
		/// The `certified` column of the `bots` table.
		///
		/// Its SQL type is `Bool`.
		///
		/// (Automatically generated by Diesel.)
		certified -> Bool,
		/// The `banner` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		banner -> Nullable<Text>,
		/// The `status` column of the `bots` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		status -> Int4,
		/// The `description` column of the `bots` table.
		///
		/// Its SQL type is `Text`.
		///
		/// (Automatically generated by Diesel.)
		description -> Text,
		/// The `short_description` column of the `bots` table.
		///
		/// Its SQL type is `Text`.
		///
		/// (Automatically generated by Diesel.)
		short_description -> Text,
		/// The `prefix` column of the `bots` table.
		///
		/// Its SQL type is `Text`.
		///
		/// (Automatically generated by Diesel.)
		prefix -> Text,
		/// The `is_slash` column of the `bots` table.
		///
		/// Its SQL type is `Bool`.
		///
		/// (Automatically generated by Diesel.)
		is_slash -> Bool,
		/// The `github` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		github -> Nullable<Text>,
		/// The `website` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		website -> Nullable<Text>,
		/// The `invite_link` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		invite_link -> Nullable<Text>,
		/// The `support_server` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		support_server -> Nullable<Text>,
		/// The `api_key` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		api_key -> Nullable<Text>,
		/// The `imported_from` column of the `bots` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		imported_from -> Nullable<Text>,
		/// The `created_at` column of the `bots` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		created_at -> Timestamp,
		/// The `updated_at` column of the `bots` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		updated_at -> Timestamp,
	}
}

diesel::table! {
	/// Representation of the `bots_categories` table.
	///
	/// (Automatically generated by Diesel.)
	bots_categories (bot_id, category_id) {
		/// The `bot_id` column of the `bots_categories` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		bot_id -> Varchar,
		/// The `category_id` column of the `bots_categories` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		category_id -> Int4,
	}
}

diesel::table! {
	/// Representation of the `categories` table.
	///
	/// (Automatically generated by Diesel.)
	categories (id) {
		/// The `id` column of the `categories` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		id -> Int4,
		/// The `category` column of the `categories` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		#[max_length = 25]
		category -> Varchar,
		/// The `slug` column of the `categories` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		#[max_length = 25]
		slug -> Varchar,
		/// The `description` column of the `categories` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		description -> Nullable<Text>,
		/// The `bots_cnt` column of the `categories` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		bots_cnt -> Int4,
		/// The `created_at` column of the `categories` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		created_at -> Timestamp,
	}
}

diesel::table! {
	/// Representation of the `users` table.
	///
	/// (Automatically generated by Diesel.)
	users (id) {
		/// The `id` column of the `users` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		id -> Varchar,
		/// The `username` column of the `users` table.
		///
		/// Its SQL type is `Varchar`.
		///
		/// (Automatically generated by Diesel.)
		username -> Varchar,
		/// The `avatar` column of the `users` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		avatar -> Nullable<Text>,
		/// The `banner` column of the `users` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		banner -> Nullable<Text>,
		/// The `bio` column of the `users` table.
		///
		/// Its SQL type is `Nullable<Text>`.
		///
		/// (Automatically generated by Diesel.)
		bio -> Nullable<Text>,
		/// The `permissions` column of the `users` table.
		///
		/// Its SQL type is `Int4`.
		///
		/// (Automatically generated by Diesel.)
		permissions -> Int4,
		/// The `created_at` column of the `users` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		created_at -> Timestamp,
		/// The `updated_at` column of the `users` table.
		///
		/// Its SQL type is `Timestamp`.
		///
		/// (Automatically generated by Diesel.)
		updated_at -> Timestamp,
	}
}

diesel::joinable!(api_tokens -> users (user_id));
diesel::joinable!(bot_owners -> bots (bot_id));
diesel::joinable!(bot_owners -> users (user_id));
diesel::joinable!(bot_reviews -> bots (bot_id));
diesel::joinable!(bot_reviews -> users (user_id));
diesel::joinable!(bots_categories -> bots (bot_id));
diesel::joinable!(bots_categories -> categories (category_id));

diesel::allow_tables_to_appear_in_same_query!(
	api_tokens,
	bot_owners,
	bot_reviews,
	bots,
	bots_categories,
	categories,
	users,
);
