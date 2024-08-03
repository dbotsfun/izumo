diesel::table! {
	users (id) {
		id -> Text,
		username -> Varchar,
		avatar -> Nullable<Text>,
		banner -> Nullable<Text>,
		bio -> Nullable<Text>,
		permissions -> Int4,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	bots (id) {
		id -> Text,
		name -> Varchar,
		avatar -> Nullable<Text>,
		certified -> Bool,
		banner -> Nullable<Text>,
		status -> crate::models::BotStatus,
		description -> Text,
		short_description -> Text,
		prefix -> Varchar,
		/// Simxnet has told me to add this or she will kill my whole family in front of me.
		is_slash -> Bool,
		github -> Nullable<Text>,
		website -> Nullable<Text>,
		invite_link -> Nullable<Text>,
		support_server -> Nullable<Text>,
		api_key -> Nullable<Text>,
		imported_from -> Nullable<Text>,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	vanities (id) {
		id -> VarChar,
		target_id -> Text,
		user_id -> Text,
		#[sql_name = "type"]
		type_ -> crate::models::VanityType,
	}
}

diesel::table! {
	tags (id) {
		id -> VarChar,
		display_name -> Text,
		created_at -> Timestamp,
	}
}

diesel::table! {
	webhooks (id) {
		id -> VarChar,
		url -> Text,
		secret -> Text,
		events -> Array<Nullable<Text>>,
		payload_fields -> Array<Nullable<Text>>,
	}
}

diesel::table! {
	badges (name) {
		name -> Text,
		display_name -> Text,
		description -> Text,
		icon -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	reviews (id) {
		id -> Int4,
		bot_id -> Text,
		user_id -> Text,
		rating -> Int4,
		content -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	sessions (access_token, refresh_token) {
		user_id -> Text,
		refresh_token -> Text,
		access_token -> Text,
		created_at -> Timestamp,
		updated_at -> Timestamp,
	}
}

diesel::table! {
	votes (id) {
		id -> Uuid,
		bot_id -> Text,
		user_id -> Text,
		expires -> Int8,
	}
}

diesel::table! {
	bot_to_user (A, B) {
		/// The bot's ID.
		A -> Text,
		/// The user's ID.
		B -> Text,
		/// Whether the user is the owner of the bot.
		is_owner -> Bool,
		/// The user's permissions for the bot.
		permissions -> Int4,
		/// The date the user was added.
		created_at -> Timestamp,
	}
}

diesel::joinable!(bot_to_user -> bots (A));
diesel::joinable!(bot_to_user -> users (B));
diesel::joinable!(reviews -> bots (bot_id));
diesel::joinable!(reviews -> users (user_id));
diesel::joinable!(sessions -> users (user_id));
diesel::joinable!(vanities -> users (user_id));
diesel::joinable!(votes -> bots (bot_id));
diesel::joinable!(votes -> users (user_id));
diesel::joinable!(webhooks -> bots (id));

diesel::allow_tables_to_appear_in_same_query!(
	badges,
	bots,
	reviews,
	sessions,
	tags,
	users,
	vanities,
	votes,
	webhooks,
	bot_to_user
);
