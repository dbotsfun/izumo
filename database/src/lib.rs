use diesel::{ConnectionError, ConnectionResult};
use diesel_async::{pooled_connection::ManagerConfig, AsyncPgConnection};
use futures_util::{future::BoxFuture, FutureExt};
use tokio_postgres::NoTls;
use url::Url;

pub mod models;
pub mod schema;

/// Create a new [ManagerConfig] for the database connection pool, which can
/// be used with [diesel_async::pooled_connection::AsyncDieselConnectionManager::new_with_config()].
pub fn make_manager_config() -> ManagerConfig<AsyncPgConnection> {
	let mut manager_config = ManagerConfig::default();
	manager_config.custom_setup = Box::new(move |url| Box::pin(initialize_db(url)));
	manager_config
}

/// Get the database connection URL from the `DATABASE_URL` environment variable.
pub fn connection_url() -> String {
	let url = std::env::var("DATABASE_URL").expect("DATABASE_URL should be set");
	let url = Url::parse(url.as_str()).expect("Invalid database URL");
	url.into()
}

/// Initialize database connection pool based on `DATABASE_URL` environment variable.
pub fn initialize_db(config: &str) -> BoxFuture<ConnectionResult<AsyncPgConnection>> {
	let fut = async {
		let (client, conn) = tokio_postgres::connect(config, NoTls)
			.await
			.map_err(|e| ConnectionError::BadConnection(e.to_string()))?;
		tokio::spawn(async move {
			if let Err(e) = conn.await {
				eprintln!("Database connection: {e}");
			}
		});
		AsyncPgConnection::try_from(client).await
	};
	fut.boxed()
}
