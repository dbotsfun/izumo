use std::sync::Arc;

use crate::{
	middleware,
	util::errors::{not_found, AppResult},
};
use axum::{response::IntoResponse, routing::get, Json, Router};
use reqwest::{Method, StatusCode};

use crate::app::{App, AppState};

pub fn build_handler(app: Arc<App>) -> axum::Router {
	let state = AppState(app);

	let axum_router = build_axum_router(state.clone());
	middleware::apply_middleware(state, axum_router)
}

pub fn build_axum_router(state: AppState) -> Router<()> {
	let router = Router::new().route("/", get(handler));

	router
		.fallback(|method: Method| async move {
			match method {
				Method::HEAD => StatusCode::NOT_FOUND.into_response(),
				_ => not_found().into_response(),
			}
		})
		.with_state(state)
}

#[derive(serde::Serialize)]
struct Empty {
	hello: String,
}

async fn handler(state: AppState) -> AppResult<Json<Empty>> {
	let _ = state;

	Ok(Json(Empty {
		hello: String::from("Yoyoyoyo"),
	}))
}
