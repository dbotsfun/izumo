use anyhow::anyhow;
use anyhow::Context;
use axum::http::HeaderValue;
use crates_io_env_vars::{list, list_parsed, required_var, var, var_parsed};
use ipnetwork::IpNetwork;
use std::collections::HashSet;
use std::net::IpAddr;
use std::str::FromStr;

use crate::util::env::Env;

use super::base::Base;
use super::database_pools::DatabasePools;
use super::discord::DiscordConfig;

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
	pub max_allowed_page_offset: u32,
	pub page_offset_ua_blocklist: Vec<String>,
	pub page_offset_cidr_blocklist: Vec<IpNetwork>,
	pub domain_name: String,
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

		let page_offset_ua_blocklist = list("WEB_PAGE_OFFSET_UA_BLOCKLIST")?;
		let page_offset_cidr_blocklist =
			list_parsed("WEB_PAGE_OFFSET_CIDR_BLOCKLIST", parse_cidr_block)?;

		let base = Base::from_environment()?;
		let discord = DiscordConfig::from_environment()?;

		let domain_name = var("DOMAIN_NAME")?.unwrap_or(String::from("dbots.fun"));

		Ok(Self {
			db: DatabasePools::full_from_environment(&base)?,
			base,
			ip,
			port,
			max_blocking_threads,
			max_allowed_page_offset: var_parsed("WEB_MAX_ALLOWED_PAGE_OFFSET")?.unwrap_or(200),
			page_offset_ua_blocklist,
			page_offset_cidr_blocklist,
			session_key: cookie::Key::derive_from(required_var("SESSION_KEY")?.as_bytes()),
			allowed_origins,
			discord,
			blocked_ips,
			domain_name,
		})
	}
}

impl Server {
	pub fn env(&self) -> Env {
		self.base.env
	}
}

/// Parses a CIDR block string to a valid `IpNetwork` struct.
///
/// The purpose is to be able to block IP ranges that overload the API that uses pagination.
///
/// The minimum number of bits for a host prefix must be
///
/// * at least 16 for IPv4 based CIDRs.
/// * at least 64 for IPv6 based CIDRs
///
fn parse_cidr_block(block: &str) -> anyhow::Result<IpNetwork> {
	let cidr = block
		.parse()
		.context("WEB_PAGE_OFFSET_CIDR_BLOCKLIST must contain IPv4 or IPv6 CIDR blocks.")?;

	let host_prefix = match cidr {
		IpNetwork::V4(_) => 16,
		IpNetwork::V6(_) => 64,
	};

	if cidr.prefix() < host_prefix {
		return Err(anyhow!("WEB_PAGE_OFFSET_CIDR_BLOCKLIST only allows CIDR blocks with a host prefix of at least 16 bits (IPv4) or 64 bits (IPv6)."));
	}

	Ok(cidr)
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
