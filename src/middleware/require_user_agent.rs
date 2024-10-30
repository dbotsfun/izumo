//! Middleware that blocks requests with no user-agent header

use crate::middleware::log_request::RequestLogExt;
use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::IntoResponse;
use axum_extra::headers::UserAgent;
use axum_extra::TypedHeader;

pub async fn require_user_agent(
	user_agent: Option<TypedHeader<UserAgent>>,
	req: Request,
	next: Next,
) -> axum::response::Response {
	let agent = match user_agent {
		Some(ref header) => header.as_str(),
		None => "",
	};

	if agent.is_empty() {
		req.request_log().add("cause", "no user agent");

		let request_id = req
			.headers()
			.get("x-request-id")
			.map(|header| header.to_str().unwrap_or_default())
			.unwrap_or_default();

		let body = format!(include_str!("no_user_agent_message.txt"), request_id);

		(StatusCode::FORBIDDEN, body).into_response()
	} else {
		next.run(req).await
	}
}
