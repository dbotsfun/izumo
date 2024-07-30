use actix_web::{middleware, web, App, HttpServer};
use diesel::{prelude::*, r2d2};
use tracing::info;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenvy::dotenv().ok();
	// initialize tracing subscriber
	initialize_tracing();

	// initialize DB pool outside of `HttpServer::new` so that it is shared across all workers
	let pool = initialize_db_pool();

	let port = std::env::var("PORT")
		.unwrap_or(String::from("8080"))
		.parse()
		.expect("PORT should be a number");

	info!("starting HTTP server at http://localhost:{:?}", port);

	HttpServer::new(move || {
		App::new()
			// add DB pool handle to app data; enables use of `web::Data<DbPool>` extractor
			.app_data(web::Data::new(pool.clone()))
			// add request logger middleware
			.wrap(middleware::Logger::default())
		// add route handlers
		// .service(get_user)
		// .service(add_user)
	})
	.bind(("127.0.0.1", port))?
	.run()
	.await
}

/// Short-hand for the database pool type to use throughout the app.
type DbPool = r2d2::Pool<r2d2::ConnectionManager<PgConnection>>;

/// Initialize database connection pool based on `DATABASE_URL` environment variable.
///
/// See more: <https://docs.rs/diesel/latest/diesel/r2d2/index.html>.
fn initialize_db_pool() -> DbPool {
	let conn_spec = std::env::var("DATABASE_URL").expect("DATABASE_URL should be set");
	let manager = r2d2::ConnectionManager::<PgConnection>::new(conn_spec);
	r2d2::Pool::builder()
		.build(manager)
		.expect("database URL should be valid path to SQLite DB file")
}

fn initialize_tracing() {
	tracing_subscriber::fmt()
		.with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
		.init();
}
