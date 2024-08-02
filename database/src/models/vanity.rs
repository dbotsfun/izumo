use diesel::{
	deserialize::{self, FromSql, FromSqlRow},
	expression::AsExpression,
	pg::{Pg, PgValue},
	serialize::{self, IsNull, Output, ToSql},
	sql_types::SqlType,
};
use serde::{Deserialize, Serialize};
use std::io::Write;

#[derive(diesel::query_builder::QueryId, SqlType)]
#[diesel(postgres_type(name = "vanity_type"))]
pub struct VanityType;

#[derive(Serialize, Deserialize, Debug, PartialEq, FromSqlRow, AsExpression, Eq)]
#[diesel(sql_type = VanityType)]
pub enum VanityTypeEnum {
	USER,
	BOT,
}

impl ToSql<VanityType, Pg> for VanityTypeEnum {
	fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
		match *self {
			VanityTypeEnum::BOT => out.write_all(b"BOT")?,
			VanityTypeEnum::USER => out.write_all(b"USER")?,
		}
		Ok(IsNull::No)
	}
}

impl FromSql<VanityType, Pg> for VanityTypeEnum {
	fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
		match bytes.as_bytes() {
			b"BOT" => Ok(VanityTypeEnum::BOT),
			b"USER" => Ok(VanityTypeEnum::USER),
			_ => Err("Unrecognized enum variant".into()),
		}
	}
}
