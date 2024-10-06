use crate::real_ip::process_xff_headers;
use axum::extract::{ConnectInfo, Request};
use axum::middleware::Next;
use axum::response::IntoResponse;
use std::net::{IpAddr, SocketAddr};
use tracing::debug;

#[derive(Copy, Clone, Debug)]
pub struct RealIp(IpAddr);

impl std::ops::Deref for RealIp {
	type Target = IpAddr;
	fn deref(&self) -> &Self::Target {
		&self.0
	}
}

pub async fn middleware(
	ConnectInfo(socket_addr): ConnectInfo<SocketAddr>,
	mut req: Request,
	next: Next,
) -> impl IntoResponse {
	let xff_ip = process_xff_headers(req.headers());
	let real_ip = xff_ip
		.inspect(|ip| debug!(target: "real_ip", "Using X-Forwarded-For header as real IP: {ip}"))
		.unwrap_or_else(|| {
			let ip = socket_addr.ip();
			debug!(target: "real_ip", "Using socket address as real IP: {ip}");
			ip
		});

	req.extensions_mut().insert(RealIp(real_ip));

	next.run(req).await
}
