use crates_io_env_vars::var;
use sentry::integrations::tracing::EventFilter;
use tracing::level_filters::LevelFilter;
use tracing::{warn, Level, Metadata};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;
use tracing_subscriber::{EnvFilter, Layer};

pub fn init() {
	initialize_tracing(LevelFilter::INFO);
}

/// Initialize tracing subscriber with default configuration.
fn initialize_tracing(level: LevelFilter) {
	let env_filter = EnvFilter::builder()
		.with_default_directive(level.into())
		.from_env_lossy();

	let log_format = var("RUST_LOG_FORMAT")
		.inspect_err(|error| {
			warn!("Failed to read RUST_LOG_FORMAT, falling back to default: {error}")
		})
		.unwrap_or_default();

	let log_layer = match log_format.as_deref() {
		Some("json") => tracing_subscriber::fmt::layer()
			.json()
			.with_filter(env_filter)
			.boxed(),
		_ => tracing_subscriber::fmt::layer()
			.compact()
			.without_time()
			.with_filter(env_filter)
			.boxed(),
	};

	let sentry_layer = sentry::integrations::tracing::layer()
		.event_filter(event_filter)
		.with_filter(LevelFilter::INFO);

	tracing_subscriber::registry()
		.with(log_layer)
		.with(sentry_layer)
		.init();
}

fn event_filter(metadata: &Metadata<'_>) -> EventFilter {
	match metadata.level() {
		&Level::ERROR if metadata.target() == "http" => EventFilter::Breadcrumb,
		&Level::ERROR => EventFilter::Exception,
		&Level::WARN | &Level::INFO => EventFilter::Breadcrumb,
		&Level::DEBUG | &Level::TRACE => EventFilter::Ignore,
	}
}
