use std::{
	any::{Any, TypeId},
	borrow::Cow,
	fmt,
};

mod json;

use axum::response::IntoResponse;
use json::custom;
use reqwest::StatusCode;
pub type BoxedAppError = Box<dyn AppError>;

/// Return an error with status 400 and the provided description as JSON
pub fn bad_request<S: ToString>(error: S) -> BoxedAppError {
	custom(StatusCode::BAD_REQUEST, error.to_string())
}

pub fn forbidden(detail: impl Into<Cow<'static, str>>) -> BoxedAppError {
	custom(StatusCode::FORBIDDEN, detail)
}

pub fn not_found() -> BoxedAppError {
	custom(StatusCode::NOT_FOUND, "Not Found")
}

/// Returns an error with status 500 and the provided description as JSON
pub fn server_error<S: ToString>(error: S) -> BoxedAppError {
	custom(StatusCode::INTERNAL_SERVER_ERROR, error.to_string())
}

/// Returns an error with status 503 and the provided description as JSON
pub fn service_unavailable() -> BoxedAppError {
	custom(StatusCode::SERVICE_UNAVAILABLE, "Service unavailable")
}

pub fn bot_not_found(bot: &str) -> BoxedAppError {
	let detail = format!("crate `{bot}` does not exist");
	custom(StatusCode::NOT_FOUND, detail)
}

// =============================================================================
// AppError trait

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
