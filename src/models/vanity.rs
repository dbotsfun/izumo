use crate::sql::pg_enum;
use diesel::{deserialize::FromSqlRow, expression::AsExpression};
use serde::{Deserialize, Serialize};

pg_enum! {
	pub enum VanityType {
		USER = 0,
		BOT = 1,
	}
}
