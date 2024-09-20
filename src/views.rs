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
}

impl EncodablePrivateUser {
	pub fn from(user: User) -> Self {
		let User {
			id,
			username,
			avatar,
			banner,
			bio,
			..
		} = user;

		EncodablePrivateUser {
			id: id.clone(),
			username,
			avatar: avatar_url(&id, avatar),
			banner,
			bio,
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
}

impl From<User> for EncodablePublicUser {
	fn from(user: User) -> Self {
		let User {
			id,
			username,
			avatar,
			banner,
			bio,
			..
		} = user;

		EncodablePublicUser {
			id: id.clone(),
			username,
			avatar: avatar_url(&id, avatar),
			banner,
			bio,
		}
	}
}

fn avatar_url(user_id: &str, hash: Option<String>) -> Option<String> {
	let avatar = hash.unwrap_or("0".to_string());
	let animated = avatar.starts_with("a_");
	let format = if animated { "gif" } else { "png" };

	Some(format!(
		"https://cdn.discordapp.com/avatars/{}/{}.{}",
		user_id, avatar, format
	))
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OwnedBot {
	pub id: String,
	pub name: String,
}
