pub mod app;
pub mod debug;
pub mod log_request;
pub mod normalize_path;
pub mod real_ip;
mod require_user_agent;
pub mod session;

use crate::app::AppState;
use crate::util::env::Env;
use ::sentry::integrations::tower as sentry_tower;
use axum::middleware::{from_fn, from_fn_with_state};
use axum::Router;
use axum_extra::either::Either;
use axum_extra::middleware::option_layer;
use std::time::Duration;
use tower::layer::util::Identity;
use tower_http::add_extension::AddExtensionLayer;
use tower_http::catch_panic::CatchPanicLayer;
use tower_http::compression::{CompressionLayer, CompressionLevel};
use tower_http::timeout::{RequestBodyTimeoutLayer, TimeoutLayer};

pub fn apply_middleware(state: AppState, router: Router<()>) -> Router {
	let config = &state.config;
	let env = config.env();

	let middlewares_1 = tower::ServiceBuilder::new()
		.layer(sentry_tower::NewSentryLayer::new_from_top())
		.layer(sentry_tower::SentryHttpLayer::with_transaction())
		.layer(from_fn(self::real_ip::middleware))
		.layer(CatchPanicLayer::new())
		.layer(from_fn(log_request::log_requests))
		.layer(conditional_layer(env == Env::Development, || {
			from_fn(debug::debug_requests)
		}));

	let middlewares_2 = tower::ServiceBuilder::new()
		.layer(from_fn_with_state(state.clone(), session::attach_session))
		.layer(from_fn(require_user_agent::require_user_agent))
		// .layer(from_fn_with_state(state.clone(), block_traffic::middleware))
		.layer(AddExtensionLayer::new(state.clone()));

	router
		.layer(middlewares_2)
		.layer(middlewares_1)
		.layer(TimeoutLayer::new(Duration::from_secs(30)))
		.layer(RequestBodyTimeoutLayer::new(Duration::from_secs(30)))
		.layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
}

pub fn conditional_layer<L, F: FnOnce() -> L>(condition: bool, layer: F) -> Either<L, Identity> {
	option_layer(condition.then(layer))
}
