//! Base configuration options
//!
//! - `HEROKU`: Is this instance of crates_io:: currently running on Heroku.

use crate::util::env::Env;
use crates_io_env_vars::var;

pub struct Base {
	pub env: Env,
}

impl Base {
	pub fn from_environment() -> anyhow::Result<Self> {
		// https://coolify.io/docs/knowledge-base/environment-variables#coolify-url
		let env = match var("COOLIFY_URL")? {
			Some(_) => Env::Production,
			_ => Env::Development,
		};

		Ok(Self { env })
	}
}
