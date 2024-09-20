use std::{collections::HashSet, net::IpAddr, str::FromStr};

use axum::http::HeaderValue;
use crates_io_env_vars::{list_parsed, required_var, var, var_parsed};

use crate::util::env::Env;

use super::{base::Base, database_pools::DatabasePools, discord::DiscordConfig};

pub struct Server {
	pub base: Base,
	pub ip: IpAddr,
	pub port: u16,
	pub max_blocking_threads: Option<usize>,
	pub allowed_origins: AllowedOrigins,
	pub discord: DiscordConfig,
	pub session_key: cookie::Key,
	pub blocked_ips: HashSet<IpAddr>,
	pub db: DatabasePools,
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
		let allowed_origins = AllowedOrigins::from_default_env()?;

		let base = Base::from_environment()?;
		let discord = DiscordConfig::from_environment()?;

		Ok(Self {
			db: DatabasePools::full_from_environment(&base)?,
			base,
			ip,
			port,
			max_blocking_threads,
			session_key: cookie::Key::derive_from(required_var("SESSION_KEY")?.as_bytes()),
			allowed_origins,
			discord,
			blocked_ips,
		})
	}
}

impl Server {
	pub fn env(&self) -> Env {
		self.base.env
	}
}

#[derive(Clone, Debug, Default)]
pub struct AllowedOrigins(Vec<String>);

impl AllowedOrigins {
	pub fn from_default_env() -> anyhow::Result<Self> {
		let allowed_origins = required_var("WEB_ALLOWED_ORIGINS")?
			.split(',')
			.map(ToString::to_string)
			.collect();

		Ok(Self(allowed_origins))
	}

	pub fn contains(&self, value: &HeaderValue) -> bool {
		self.0.iter().any(|it| it == value)
	}
}
