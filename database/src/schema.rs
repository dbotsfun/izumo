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
		owner_id -> Text,
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
