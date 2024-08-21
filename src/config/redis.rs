use crates_io_env_vars::required_var_parsed;

pub struct RedisConfig {
	pub url: String,
	pub pool_size: u32,
	pub pool_timeout: u64,
}

impl RedisConfig {
	pub fn from_environment() -> anyhow::Result<Self> {
		let url = required_var_parsed("REDIS_URL")?;
		let pool_size = required_var_parsed("REDIS_POOL_SIZE")?;
		let pool_timeout = required_var_parsed("REDIS_POOL_TIMEOUT")?;

		Ok(Self {
			url,
			pool_size,
			pool_timeout,
		})
	}
}
