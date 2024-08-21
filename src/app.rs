use std::ops::Deref;
use std::sync::Arc;
use std::time::Duration;

use axum::extract::{FromRequestParts, State};
use database::{connection_url, make_manager_config};
use deadpool_diesel::Runtime;
use deadpool_redis::{Config as RedisConfig, Pool as RedisPool};
use diesel_async::pooled_connection::deadpool::{Object, Pool as DeadpoolPool, PoolError};
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::AsyncPgConnection;
use reqwest::Client as ReqwestClient;
use tracing::instrument;

use crate::config::server;

/// Result type for database operations
pub type DeadpoolResult = Result<Object<AsyncPgConnection>, PoolError>;
pub type RedisResult = Result<deadpool_redis::Connection, deadpool_redis::PoolError>;

pub struct App {
	pub db: DeadpoolPool<AsyncPgConnection>,
	pub http: ReqwestClient,
	pub config: Arc<server::Server>,
	pub redis: RedisPool,
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

		let http = ReqwestClient::new();

		// Create a new redis pool
		let redis = {
			let url = config.redis.url.clone();
			let cfg = RedisConfig::from_url(url);
			cfg.create_pool(Some(Runtime::Tokio1)).unwrap()
		};

		App {
			db,
			http,
			config: Arc::new(config),
			redis,
		}
	}

	/// Obtain a read/write database connection from the async primary pool
	#[instrument(skip_all)]
	pub async fn db_write(&self) -> DeadpoolResult {
		self.db.get().await
	}

	/// Obtain a read/write redis connection from the async primary pool
	#[instrument(skip_all)]
	pub async fn rd_write(&self) -> RedisResult {
		self.redis.get().await
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
