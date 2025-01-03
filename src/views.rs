use crate::models::bot::BotLanguages;
use crate::models::token::{ApiToken, CreatedApiToken};
use crate::models::{Bot, User};
use crate::models::{BotVote, Category};
use crate::util::rfc3339;
use chrono::NaiveDateTime;
use secrecy::ExposeSecret;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodableCategory {
	pub id: String,
	pub category: String,
	pub slug: String,
	pub description: String,
	#[serde(with = "rfc3339")]
	pub created_at: NaiveDateTime,
	pub bots_cnt: i32,
}

impl From<Category> for EncodableCategory {
	fn from(category: Category) -> Self {
		let Category {
			bots_cnt,
			category,
			slug,
			description,
			created_at,
			..
		} = category;
		Self {
			id: slug.clone(),
			slug,
			description: description.unwrap_or_default(),
			created_at,
			bots_cnt,
			category: category.rsplit("::").collect::<Vec<_>>()[0].to_string(),
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodableCategoryWithSubcategories {
	pub id: String,
	pub category: String,
	pub slug: String,
	pub description: String,
	#[serde(with = "rfc3339")]
	pub created_at: NaiveDateTime,
	pub bots_cnt: i32,
}

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
pub struct EncodableBotOwner {
	pub id: String,
	pub username: String,
	pub avatar: Option<String>,
	pub url: String,
}

impl From<User> for EncodableBotOwner {
	fn from(user: User) -> Self {
		let User {
			id,
			username,
			avatar,
			..
		} = user;

		let url = format!("https://discord.com/users/{}", id);

		EncodableBotOwner {
			id: id.clone(),
			username,
			avatar: avatar_url(&id, avatar),
			url,
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OwnedBot {
	pub id: String,
	pub name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodableBotWithDescription<T> {
	#[serde(flatten)]
	pub inner: T,
	pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodableBot {
	pub id: String,
	pub name: String,
	pub avatar: Option<String>,
	pub short_description: String,
	pub supported_languages: Vec<Option<BotLanguages>>,
	pub categories: Option<Vec<String>>,
	pub guild_count: i32,
	pub status: String,
	#[serde(with = "rfc3339")]
	pub updated_at: NaiveDateTime,
	#[serde(with = "rfc3339")]
	pub created_at: NaiveDateTime,
}

impl EncodableBot {
	pub fn from(bot: Bot, categories: Option<&[Category]>) -> EncodableBotWithDescription<Self> {
		let Bot {
			id,
			name,
			updated_at,
			created_at,
			description,
			short_description,
			supported_languages,
			guild_count,
			status,
			avatar,
			..
		} = bot;

		let category_ids = categories.map(|cats| cats.iter().map(|cat| cat.slug.clone()).collect());

		EncodableBotWithDescription::<EncodableBot> {
			inner: EncodableBot {
				id,
				name,
				updated_at,
				created_at,
				categories: category_ids,
				short_description,
				supported_languages,
				guild_count,
				status: status.into(),
				avatar,
			},
			description,
		}
	}

	pub fn from_minimal(bot: Bot) -> EncodableBotWithDescription<Self> {
		Self::from(bot, None)
	}

	pub fn from_with_no_desc(bot: Bot, categories: Vec<String>) -> Self {
		let Bot {
			id,
			name,
			updated_at,
			created_at,
			short_description,
			supported_languages,
			guild_count,
			status,
			avatar,
			..
		} = bot;

		EncodableBot {
			id,
			name,
			updated_at,
			created_at,
			categories: Some(categories),
			short_description,
			supported_languages,
			guild_count,
			status: status.into(),
			avatar,
		}
	}
}

/// The serialization format for the `ApiToken` model with its token value.
/// This should only be used when initially creating a new token to minimize
/// the chance of token leaks.
#[derive(Serialize, Debug)]
pub struct EncodableApiTokenWithToken {
	#[serde(flatten)]
	pub token: ApiToken,
	#[serde(rename = "token")]
	pub plaintext: String,
}

impl From<CreatedApiToken> for EncodableApiTokenWithToken {
	fn from(token: CreatedApiToken) -> Self {
		EncodableApiTokenWithToken {
			token: token.model,
			plaintext: token.plaintext.expose_secret().to_string(),
		}
	}
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GoodBot {
	pub bot: EncodableBotWithDescription<EncodableBot>,
	pub warnings: PublishWarnings,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PublishWarnings {
	pub invalid_categories: Vec<String>,
	pub other: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EncodableBotVote {
	pub bot_id: String,
	pub votes: i32,
	pub date: String,
}

impl From<BotVote> for EncodableBotVote {
	fn from(vote: BotVote) -> Self {
		EncodableBotVote {
			bot_id: vote.bot_id,
			date: vote.date.to_string(),
			votes: vote.votes,
		}
	}
}
