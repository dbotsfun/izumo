use std::{collections::HashSet, net::IpAddr, str::FromStr};

use crates_io_env_vars::{list_parsed, var, var_parsed};

use crate::util::env::Env;

use super::{base::Base, discord::DiscordConfig, redis::RedisConfig};

pub struct Server {
	pub base: Base,
	pub ip: IpAddr,
	pub port: u16,
	pub max_blocking_threads: Option<usize>,
	pub discord: DiscordConfig,
	pub blocked_ips: HashSet<IpAddr>,
	pub redis: RedisConfig,
}

impl Server {
	pub fn from_environment() -> anyhow::Result<Self> {
		let docker = var("DEV_DOCKER")?.is_some();
		let coolify = var("COOLIFY_URL")?.is_some();

		let ip = if coolify || docker {
			[0, 0, 0, 0].into()
		} else {
			[127, 0, 0, 1].into()
		};

		let port = var_parsed("PORT")?.unwrap_or(8888);

		let blocked_ips = HashSet::from_iter(list_parsed("BLOCKED_IPS", IpAddr::from_str)?);
		let max_blocking_threads = var_parsed("SERVER_THREADS")?;

		let base = Base::from_environment()?;
		let discord = DiscordConfig::from_environment()?;

		let redis = RedisConfig::from_environment()?;

		Ok(Self {
			base,
			ip,
			port,
			max_blocking_threads,
			discord,
			blocked_ips,
			redis,
		})
	}
}

impl Server {
	pub fn env(&self) -> Env {
		self.base.env
	}
}
