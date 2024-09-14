use crates_io_env_vars::required_var_parsed;

pub struct RedisConfig {
	/// The URL of the Redis server.
	pub url: String,
}

impl RedisConfig {
	pub fn from_environment() -> anyhow::Result<Self> {
		let url = required_var_parsed("REDIS_URL")?;

		Ok(Self { url })
	}
}
