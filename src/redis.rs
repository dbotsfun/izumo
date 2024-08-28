use deadpool_redis::{
	redis::{cmd, RedisResult},
	Connection,
};

pub struct Redis;

impl Redis {
	pub async fn set(key: &str, value: &str, conn: &mut Connection) -> RedisResult<()> {
		cmd("SET").arg(key).arg(value).query_async::<()>(conn).await
	}

	pub async fn get(key: &str, conn: &mut Connection) -> RedisResult<String> {
		cmd("GET").arg(key).query_async(conn).await
	}

	pub async fn del(key: &str, conn: &mut Connection) -> RedisResult<()> {
		cmd("DEL").arg(key).query_async::<()>(conn).await
	}

	pub async fn keys(pattern: &str, conn: &mut Connection) -> RedisResult<Vec<String>> {
		cmd("KEYS").arg(pattern).query_async(conn).await
	}

	pub async fn flushall(conn: &mut Connection) -> RedisResult<()> {
		cmd("FLUSHALL").query_async::<()>(conn).await
	}

	pub async fn ping(conn: &mut Connection) -> RedisResult<String> {
		cmd("PING").query_async(conn).await
	}

	pub async fn info(conn: &mut Connection) -> RedisResult<String> {
		cmd("INFO").query_async(conn).await
	}
}
