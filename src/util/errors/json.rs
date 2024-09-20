use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::{Extension, Json};
use serde_json::json;
use std::borrow::Cow;
use std::fmt;

use crate::middleware::log_request::CauseField;

use super::{AppError, BoxedAppError};

/// Generates a response with the provided status and description as JSON
fn json_error(detail: &str, status: StatusCode) -> Response {
	let json = json!({ "errors": [{ "detail": detail }] });
	(status, Json(json)).into_response()
}

// The following structs are empty and do not provide a custom message to the user

#[derive(Debug)]
pub(crate) struct ReadOnlyMode;

impl AppError for ReadOnlyMode {
	fn response(&self) -> Response {
		let detail = "dbots.fun is currently in read-only mode for maintenance. \
                      Please try again later.";
		json_error(detail, StatusCode::SERVICE_UNAVAILABLE)
	}
}

impl fmt::Display for ReadOnlyMode {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		"Tried to write in read only mode".fmt(f)
	}
}

// The following structs wrap owned data and provide a custom message to the user

pub fn custom(status: StatusCode, detail: impl Into<Cow<'static, str>>) -> BoxedAppError {
	Box::new(CustomApiError {
		status,
		detail: detail.into(),
	})
}

#[derive(Debug, Clone)]
pub struct CustomApiError {
	status: StatusCode,
	detail: Cow<'static, str>,
}

impl fmt::Display for CustomApiError {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		self.detail.fmt(f)
	}
}

impl AppError for CustomApiError {
	fn response(&self) -> Response {
		json_error(&self.detail, self.status)
	}
}

#[derive(Debug, Clone, Copy)]
pub struct InsecurelyGeneratedTokenRevoked;

impl InsecurelyGeneratedTokenRevoked {
	pub fn boxed() -> BoxedAppError {
		Box::new(Self)
	}
}

impl AppError for InsecurelyGeneratedTokenRevoked {
	fn response(&self) -> Response {
		let cause = CauseField("insecurely generated, revoked 2020-07".to_string());
		let response = json_error(&self.to_string(), StatusCode::UNAUTHORIZED);
		(Extension(cause), response).into_response()
	}
}

pub const TOKEN_FORMAT_ERROR: &str =
	"The given API token does not match the format used by dbots.fun.";

impl fmt::Display for InsecurelyGeneratedTokenRevoked {
	fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
		f.write_str(TOKEN_FORMAT_ERROR)?;
		Result::Ok(())
	}
}
