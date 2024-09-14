use crate::models::User;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodableMe {
	pub user: EncodablePrivateUser,
	pub owned_bots: Vec<OwnedBot>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodablePrivateUser {
	pub id: String,
	pub username: String,
	pub avatar: Option<String>,
	pub banner: Option<String>,
	pub bio: Option<String>,
	pub permissions: i32,
}

impl EncodablePrivateUser {
	pub fn from(user: User) -> Self {
		let User {
			id,
			username,
			avatar,
			banner,
			bio,
			permissions,
			..
		} = user;

		EncodablePrivateUser {
			id,
			username,
			avatar,
			banner,
			bio,
			permissions,
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodablePublicUser {
	pub id: String,
	pub username: String,
	pub avatar: Option<String>,
	pub banner: Option<String>,
	pub bio: Option<String>,
	pub permissions: i32,
}

impl From<User> for EncodablePublicUser {
	fn from(user: User) -> Self {
		let User {
			id,
			username,
			avatar,
			banner,
			bio,
			permissions,
			..
		} = user;

		EncodablePublicUser {
			id,
			username,
			avatar,
			banner,
			bio,
			permissions,
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OwnedBot {
	pub id: String,
	pub name: String,
}
