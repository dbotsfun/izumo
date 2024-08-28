use crate::db::{connection_url, make_manager_config, ConnectionConfig};
use axum::extract::{FromRequestParts, State};
use deadpool_diesel::Runtime;
use deadpool_redis::{Config as RedisConfig, Pool as RedisPool};
use diesel_async::pooled_connection::deadpool::Pool as DeadpoolPool;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::AsyncPgConnection;
use reqwest::Client as ReqwestClient;
use std::ops::Deref;
use std::sync::Arc;
use tracing::{instrument, warn};

use crate::config::server;

/// Result type for database operations
type DeadpoolResult = Result<
	diesel_async::pooled_connection::deadpool::Object<AsyncPgConnection>,
	diesel_async::pooled_connection::deadpool::PoolError,
>;
pub type RedisResult = Result<deadpool_redis::Connection, deadpool_redis::PoolError>;

pub struct App {
	/// Database connection pool connected to the primary database
	pub primary_database: DeadpoolPool<AsyncPgConnection>,

	/// Database connection pool connected to the read-only replica database
	pub replica_database: Option<DeadpoolPool<AsyncPgConnection>>,

	pub http: ReqwestClient,
	pub config: Arc<server::Server>,
	pub redis: RedisPool,
}

impl App {
	pub fn new(config: server::Server) -> App {
		let primary_database = {
			use secrecy::ExposeSecret;

			let primary_db_connection_config = ConnectionConfig {
				statement_timeout: config.db.statement_timeout,
				read_only: config.db.primary.read_only_mode,
			};

			let url = connection_url(&config.db, config.db.primary.url.expose_secret());
			let manager_config = make_manager_config();
			let manager = AsyncDieselConnectionManager::new_with_config(url, manager_config);

			DeadpoolPool::builder(manager)
				.runtime(Runtime::Tokio1)
				.max_size(config.db.primary.pool_size)
				.wait_timeout(Some(config.db.connection_timeout))
				.post_create(primary_db_connection_config)
				.build()
				.unwrap()
		};

		let replica_database = if let Some(pool_config) = config.db.replica.as_ref() {
			use secrecy::ExposeSecret;

			let replica_db_connection_config = ConnectionConfig {
				statement_timeout: config.db.statement_timeout,
				read_only: pool_config.read_only_mode,
			};

			let url = connection_url(&config.db, pool_config.url.expose_secret());
			let manager_config = make_manager_config();
			let manager = AsyncDieselConnectionManager::new_with_config(url, manager_config);

			let pool = DeadpoolPool::builder(manager)
				.runtime(Runtime::Tokio1)
				.max_size(pool_config.pool_size)
				.wait_timeout(Some(config.db.connection_timeout))
				.post_create(replica_db_connection_config)
				.build()
				.unwrap();

			Some(pool)
		} else {
			None
		};

		let http = ReqwestClient::new();

		// Create a new redis pool
		let redis = {
			let url = config.redis.url.clone();
			let cfg = RedisConfig::from_url(url);
			cfg.create_pool(Some(Runtime::Tokio1)).unwrap()
		};

		App {
			primary_database,
			replica_database,
			http,
			config: Arc::new(config),
			redis,
		}
	}

	/// Obtain a read/write database connection from the async primary pool
	#[instrument(skip_all)]
	pub async fn db_write(&self) -> DeadpoolResult {
		self.primary_database.get().await
	}

	/// Obtain a read/write redis connection from the async primary pool
	#[instrument(skip_all)]
	pub async fn rd_write(&self) -> RedisResult {
		self.redis.get().await
	}

	/// Obtain a readonly database connection from the primary pool
	///
	/// If the primary pool is unavailable, the replica pool is used instead, if not disabled.
	#[instrument(skip_all)]
	pub async fn db_read_prefer_primary(&self) -> DeadpoolResult {
		let Some(read_only_pool) = self.replica_database.as_ref() else {
			return self.primary_database.get().await;
		};

		match self.primary_database.get().await {
			// Primary is available
			Ok(connection) => Ok(connection),

			// Primary is not available, but replica might be available
			Err(error) => {
				// let _ = self
				//     .instance_metrics
				//     .database_fallback_used
				//     .get_metric_with_label_values(&["primary"])
				//     .map(|metric| metric.inc());

				warn!("Primary is unavailable, falling back to replica ({error})");
				read_only_pool.get().await
			}
		}
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
