use actix_web::{middleware, web, App, HttpServer};
use crates_io_env_vars::var_parsed;
use database::{connection_url, make_manager_config};
use deadpool_diesel::Runtime;
use diesel_async::pooled_connection::deadpool::Pool as DeadpoolPool;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use std::time::Duration;
use tracing::info;

mod config;
mod sentry;
mod util;

extern crate sentry as sentry_crate;

fn main() -> anyhow::Result<()> {
	dotenvy::dotenv().ok();

	let _guard = sentry::init();

	// initialize tracing subscriber
	util::tracing::init();

	// initialize DB pool outside of `HttpServer::new` so that it is shared across all workers
	let pool = {
		let url = connection_url();
		let manager_config = make_manager_config();
		let manager = AsyncDieselConnectionManager::new_with_config(url, manager_config);

		DeadpoolPool::builder(manager)
			.runtime(Runtime::Tokio1)
			.max_size(16)
			.wait_timeout(Some(Duration::from_secs(30)))
			.build()
			.unwrap()
	};

	let port = match var_parsed("PORT")? {
		Some(port) => port,
		_ => {
			info!("PORT environment variable not set; defaulting to 8080");

			8080
		}
	};

	let runtime = tokio::runtime::Builder::new_multi_thread()
		.enable_all()
		.build()?;

	info!("starting HTTP server at http://localhost:{:?}", port);

	runtime.block_on(async move {
		HttpServer::new(move || {
			App::new()
				// add DB pool handle to app data; enables use of `web::Data<DbPool>` extractor
				.app_data(web::Data::new(pool.clone()))
				// add request logger middleware
				.wrap(sentry_actix::Sentry::with_transaction())
				.wrap(middleware::Logger::default())
			// add route handlers
			// .service(add_user)
		})
		.bind(("127.0.0.1", port))?
		.run()
		.await
	})?;

	Ok(())
}
