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

// diesel::table! {
// 	bots (id) {
// 		id -> Text,
// 		name -> Varchar,
// 		avatar -> Nullable<Text>,
// 		banner -> Nullable<Text>,
// 		description -> Nullable<Text>,
// 		source -> Text,
// 		owner_id -> Int4,
// 		created_at -> Timestamp,
// 		updated_at -> Timestamp,
// 	}
// }
