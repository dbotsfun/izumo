use crate::app::AppState;
use crate::util::env::Env;
use ::sentry::integrations::tower as sentry_tower;
use axum::middleware::from_fn;
use axum::Router;
use axum_extra::either::Either;
use axum_extra::middleware::option_layer;
use std::time::Duration;
use tower::layer::util::Identity;
use tower_http::add_extension::AddExtensionLayer;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::{CompressionLayer, CompressionLevel};
use tower_http::timeout::{RequestBodyTimeoutLayer, TimeoutLayer};

pub mod debug;

pub fn apply_middleware(state: AppState, router: Router<()>) -> Router {
	let config = &state.config;
	let env = config.env();

	let middlewares_1 = tower::ServiceBuilder::new()
		.layer(sentry_tower::NewSentryLayer::new_from_top())
		.layer(sentry_tower::SentryHttpLayer::with_transaction())
		.layer(CatchPanicLayer::new())
		.layer(conditional_layer(env == Env::Development, || {
			from_fn(debug::debug_requests)
		}));

	router
		.layer(middlewares_1)
		.layer(AddExtensionLayer::new(state.clone()))
		.layer(TimeoutLayer::new(Duration::from_secs(30)))
		.layer(RequestBodyTimeoutLayer::new(Duration::from_secs(30)))
		.layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
}

pub fn conditional_layer<L, F: FnOnce() -> L>(condition: bool, layer: F) -> Either<L, Identity> {
	option_layer(condition.then(layer))
}
