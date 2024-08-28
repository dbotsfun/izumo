use std::sync::Arc;
use tokio::net::TcpListener;
use tracing::info;

use crate::app::App;
use crate::config::server;
use crate::router::build_handler;
use crate::util::signals::shutdown_signal;

mod app;
mod auth;
mod config;
mod controllers;
mod db;
mod headers;
mod middleware;
mod models;
mod redis;
mod router;
mod sentry;
mod util;
mod views;

const CORE_THREADS: usize = 4;

fn main() -> anyhow::Result<()> {
	dotenvy::dotenv().ok();

	// initialize tracing subscriber
	util::tracing::init();

	// initialize sentry
	let _guard = sentry::init();

	let config = server::Server::from_environment()?;
	let app = Arc::new(App::new(config));

	let mut builder = tokio::runtime::Builder::new_multi_thread();
	builder.enable_all();
	builder.worker_threads(CORE_THREADS);

	if let Some(threads) = app.config.max_blocking_threads {
		builder.max_blocking_threads(threads);
	}

	let rt = builder.build()?;

	rt.block_on(async move {
		let listener = TcpListener::bind((app.config.ip, app.config.port)).await?;

		let addr = listener.local_addr()?;

		info!("listening on {addr}");

		let axum_router = build_handler(app);

		axum::serve(listener, axum_router.into_make_service())
			.with_graceful_shutdown(shutdown_signal())
			.await
	})?;

	info!("Server has gracefully shutdown!");

	Ok(())
}
