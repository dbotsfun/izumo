use std::sync::Arc;

use super::controllers::*;
use crate::{
	middleware,
	util::errors::{not_found, AppResult},
};
use axum::routing::post;
use axum::{
	response::IntoResponse,
	routing::{delete, get},
	Json, Router,
};
use crates_io_env_vars::required_var;
use reqwest::{Method, StatusCode};
use serde_json::Value;

use crate::app::{App, AppState};

pub fn build_handler(app: Arc<App>) -> axum::Router {
	let state = AppState(app);

	let axum_router = build_axum_router(state.clone());
	middleware::apply_middleware(state, axum_router)
}

pub fn build_axum_router(state: AppState) -> Router<()> {
	let router = Router::new()
		.route("/", get(handler))
		.route("/summary", get(summary::summary))
		// Session management
		.route("/private/session/login", get(user::session::login))
		.route("/private/session/authorize", get(user::session::authorize))
		.route("/private/session", delete(user::session::logout))
		// Bots
		.route("/bots/:bot_id", get(bot::metadata::show))
		.route("/bots/total_votesnew", post(bot::manage::publish))
		.route("/bots/:bot_id/owners", get(bot::owners::owners))
		.route("/bots/:bot_id/votes", get(bot::votes::votes))
		// Categories
		.route("/categories", get(category::index))
		.route("/categories/:category_id", get(category::show))
		.route("/category_slugs", get(category::slugs))
		// Tokens
		.route("/me", get(user::me::me))
		.route("/me/tokens", get(token::list).put(token::new))
		.route("/me/tokens/:id", get(token::show).delete(token::revoke))
		.route("/tokens/current", delete(token::revoke_current));

	router
		.fallback(|method: Method| async move {
			match method {
				Method::HEAD => StatusCode::NOT_FOUND.into_response(),
				_ => not_found().into_response(),
			}
		})
		.with_state(state)
}

async fn handler() -> AppResult<Json<Value>> {
	let version = required_var("CARGO_PKG_VERSION");

	Ok(Json(serde_json::json!({
		"name": "izumo (api)",
		"version": version.unwrap_or("unknown".to_string()),
	})))
}
