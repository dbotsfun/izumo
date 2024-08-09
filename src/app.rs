use std::ops::Deref;
use std::sync::Arc;
use std::time::Duration;

use axum::extract::{FromRequestParts, State};
use database::{connection_url, make_manager_config};
use deadpool_diesel::Runtime;
use diesel_async::pooled_connection::deadpool::{Object, Pool as DeadpoolPool, PoolError};
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::AsyncPgConnection;
use reqwest::Client;
use tracing::instrument;

use crate::config::server;

/// Result type for database operations
type DeadpoolResult = Result<Object<AsyncPgConnection>, PoolError>;

pub struct App {
	pub db: DeadpoolPool<AsyncPgConnection>,
	pub http: Client,
	pub config: Arc<server::Server>,
}

impl App {
	pub fn new(config: server::Server) -> App {
		let db = {
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

		let http = Client::new();

		App {
			db,
			http,
			config: Arc::new(config),
		}
	}

	/// Obtain a read/write database connection from the async primary pool
	#[instrument(skip_all)]
	pub async fn db_write(&self) -> DeadpoolResult {
		self.db.get().await
	}
}

#[derive(Clone, FromRequestParts)]
#[from_request(via(State))]
pub struct AppState(pub Arc<App>);

// deref so you can still access the inner fields easily
impl Deref for AppState {
	type Target = App;

	fn deref(&self) -> &Self::Target {
		&self.0
	}
}
