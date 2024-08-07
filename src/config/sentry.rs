use anyhow::Context;
use crates_io_env_vars::{required_var, var, var_parsed};
use sentry::types::Dsn;
use sentry::IntoDsn;

pub struct SentryConfig {
	pub dsn: Option<Dsn>,
	pub environment: Option<String>,
	pub release: Option<String>,
	pub traces_sample_rate: f32,
}

impl SentryConfig {
	pub fn from_environment() -> anyhow::Result<Self> {
		let dsn = var("SENTRY_DSN_API")?
			.into_dsn()
			.context("SENTRY_DSN_API is not a valid Sentry DSN value")?;

		let environment = match dsn {
			None => None,
			Some(_) => Some(
				required_var("SENTRY_ENV_API")
					.context("SENTRY_ENV_API must be set when using SENTRY_DSN_API")?,
			),
		};

		Ok(Self {
			dsn,
			environment,
			release: var("SOURCE_COMMIT")?, // https://coolify.io/docs/knowledge-base/environment-variables#source-commit
			traces_sample_rate: var_parsed("SENTRY_TRACES_SAMPLE_RATE")?.unwrap_or(1.0),
		})
	}
}
