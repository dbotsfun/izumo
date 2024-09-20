use diesel::deserialize::{self, FromSql};
use diesel::pg::Pg;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::Text;
use diesel::*;
use serde::Serialize;
use std::io::Write;

#[derive(Clone, Copy, Debug, PartialEq, Eq, AsExpression, Serialize)]
#[diesel(sql_type = Text)]
#[serde(rename_all = "kebab-case")]
pub enum EndpointScope {
	PublishNew,
	PublishUpdate,
	Yank,
	ChangeOwners,
}

impl From<&EndpointScope> for &[u8] {
	fn from(scope: &EndpointScope) -> Self {
		match scope {
			EndpointScope::PublishNew => b"publish-new",
			EndpointScope::PublishUpdate => b"publish-update",
			EndpointScope::Yank => b"yank",
			EndpointScope::ChangeOwners => b"change-owners",
		}
	}
}

impl ToSql<Text, Pg> for EndpointScope {
	fn to_sql(&self, out: &mut Output<'_, '_, Pg>) -> serialize::Result {
		out.write_all(self.into())?;
		Ok(IsNull::No)
	}
}

impl TryFrom<&[u8]> for EndpointScope {
	type Error = String;

	fn try_from(bytes: &[u8]) -> Result<Self, Self::Error> {
		match bytes {
			b"publish-new" => Ok(EndpointScope::PublishNew),
			b"publish-update" => Ok(EndpointScope::PublishUpdate),
			b"yank" => Ok(EndpointScope::Yank),
			b"change-owners" => Ok(EndpointScope::ChangeOwners),
			_ => Err("Unrecognized enum variant".to_string()),
		}
	}
}

impl FromSql<Text, Pg> for EndpointScope {
	fn from_sql(bytes: diesel::pg::PgValue<'_>) -> deserialize::Result<Self> {
		let value = <String as FromSql<Text, Pg>>::from_sql(bytes)?;
		Ok(EndpointScope::try_from(value.as_bytes())?)
	}
}
