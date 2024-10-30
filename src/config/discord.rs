use crates_io_env_vars::required_var;

pub struct DiscordConfig {
	pub client_id: String,
	pub client_secret: String,
	pub redirect_uri: String,
	pub user_token: String,
}

impl DiscordConfig {
	pub fn from_environment() -> anyhow::Result<Self> {
		Ok(Self {
			client_id: required_var("DISCORD_CLIENT_ID")?,
			client_secret: required_var("DISCORD_CLIENT_SECRET")?,
			redirect_uri: required_var("DISCORD_REDIRECT_URI")?,
			user_token: required_var("DISCORD_USER_TOKEN")?,
		})
	}
}
