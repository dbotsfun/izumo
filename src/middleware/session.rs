use crate::controllers::util::RequestPartsExt;
use axum::extract::{Extension, FromRequestParts, Request};
// use base64::{engine::general_purpose, Engine};
// use cookie::time::Duration;
// use cookie::{Cookie, SameSite};
use parking_lot::RwLock;
use std::collections::HashMap;
use std::ops::Deref;
use std::sync::Arc;

static COOKIE_NAME: &str = "izumo_session";
static MAX_AGE_DAYS: i64 = 90;

#[derive(Clone, FromRequestParts)]
#[from_request(via(Extension))]
pub struct SessionExtension(Arc<RwLock<Session>>);

impl SessionExtension {
	fn new(session: Session) -> Self {
		Self(Arc::new(RwLock::new(session)))
	}

	pub fn get(&self, key: &str) -> Option<String> {
		let session = self.read();
		session.data.get(key).cloned()
	}

	pub fn insert(&self, key: String, value: String) -> Option<String> {
		let mut session = self.write();
		session.dirty = true;
		session.data.insert(key, value)
	}

	pub fn remove(&self, key: &str) -> Option<String> {
		let mut session = self.write();
		session.dirty = true;
		session.data.remove(key)
	}
}

impl Deref for SessionExtension {
	type Target = RwLock<Session>;

	fn deref(&self) -> &Self::Target {
		self.0.as_ref()
	}
}

pub struct Session {
	data: HashMap<String, String>,
	dirty: bool,
}

impl Session {
	fn new(data: HashMap<String, String>) -> Self {
		Self { data, dirty: false }
	}
}

pub trait RequestSession {
	fn session(&self) -> &SessionExtension;
}

impl<T: RequestPartsExt> RequestSession for T {
	fn session(&self) -> &SessionExtension {
		self.extensions()
			.get::<SessionExtension>()
			.expect("missing cookie session")
	}
}
