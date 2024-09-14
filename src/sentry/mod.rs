use crate::config::sentry::SentryConfig;
use sentry::{ClientInitGuard, ClientOptions, TransactionContext};
use std::sync::Arc;
use tracing::{info, warn};

/// Taken from https://github.com/rust-lang/crates.io/blob/main/src/sentry/mod.rs
/// Initializes the Sentry SDK from the environment variables.
///
/// If `SENTRY_DSN_API` is not set then Sentry will not be initialized,
/// otherwise it is required to be a valid DSN string. `SENTRY_ENV_API` must
/// be set if a DSN is provided.
///
/// `HEROKU_SLUG_COMMIT`, if present, will be used as the `release` property
/// on all events.
pub fn init() -> Option<ClientInitGuard> {
	let config = match SentryConfig::from_environment() {
		Ok(config) => config,
		Err(error) => {
			warn!(%error, "Failed to read Sentry configuration from environment");
			return None;
		}
	};

	let traces_sampler = move |ctx: &TransactionContext| -> f32 {
		if let Some(sampled) = ctx.sampled() {
			return if sampled { 1.0 } else { 0.0 };
		}

		config.traces_sample_rate
	};

	let opts = ClientOptions {
		auto_session_tracking: true,
		dsn: config.dsn,
		environment: config.environment.map(Into::into),
		release: config.release.map(Into::into),
		session_mode: sentry::SessionMode::Request,
		traces_sampler: Some(Arc::new(traces_sampler)),
		..Default::default()
	};

	info!("Sentry SDK initialized");

	Some(sentry::init(opts))
}
