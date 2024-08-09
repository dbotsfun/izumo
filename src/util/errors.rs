use axum::Json;
use serde_json::json;
use std::{
	any::{Any, TypeId},
	borrow::Cow,
	fmt,
};

use axum::response::{IntoResponse, Response};
use reqwest::StatusCode;
pub type BoxedAppError = Box<dyn AppError>;

pub trait AppError: Send + fmt::Display + fmt::Debug + 'static {
	/// Generate an HTTP response for the error
	///
	/// If none is returned, the error will bubble up the middleware stack
	/// where it is eventually logged and turned into a status 500 response.
	fn response(&self) -> axum::response::Response;

	fn get_type_id(&self) -> TypeId {
		TypeId::of::<Self>()
	}
}

impl dyn AppError {
	pub fn is<T: Any>(&self) -> bool {
		self.get_type_id() == TypeId::of::<T>()
	}
}

impl AppError for BoxedAppError {
	fn response(&self) -> axum::response::Response {
		(**self).response()
	}

	fn get_type_id(&self) -> TypeId {
		(**self).get_type_id()
	}
}

impl IntoResponse for BoxedAppError {
	fn into_response(self) -> axum::response::Response {
		self.response()
	}
}

pub type AppResult<T> = Result<T, BoxedAppError>;

pub fn not_found() -> BoxedAppError {
	custom(StatusCode::NOT_FOUND, "Not Found")
}

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

/// Generates a response with the provided status and description as JSON
fn json_error(detail: &str, status: StatusCode) -> Response {
	let json = json!({ "errors": [{ "detail": detail }] });
	(status, Json(json)).into_response()
}
