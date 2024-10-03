use crate::controllers::util::RequestPartsExt;
use axum::http::header::AsHeaderName;
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use indexmap::IndexMap;

pub trait HeaderMapExt {
	/// Returns the value of the request header, or an empty slice if it is not
	/// present.
	///
	/// If a header appears multiple times, this will return only one of them.
	///
	/// If the header value is invalid utf8, an empty slice will be returned.
	fn get_str_or_default<K: AsHeaderName>(&self, key: K) -> &str;
}

impl HeaderMapExt for HeaderMap {
	fn get_str_or_default<K: AsHeaderName>(&self, key: K) -> &str {
		self.get(key)
			.map(|value| value.to_str().unwrap_or_default())
			.unwrap_or_default()
	}
}

pub fn redirect(url: String) -> Response {
	(StatusCode::FOUND, [(header::LOCATION, url)]).into_response()
}

pub trait RequestUtils {
	fn query(&self) -> IndexMap<String, String>;
	fn wants_json(&self) -> bool;
	fn query_with_params(&self, params: IndexMap<String, String>) -> String;
}

impl<T: RequestPartsExt> RequestUtils for T {
	fn query(&self) -> IndexMap<String, String> {
		url::form_urlencoded::parse(self.uri().query().unwrap_or("").as_bytes())
			.into_owned()
			.collect()
	}

	fn wants_json(&self) -> bool {
		self.headers()
			.get_all(header::ACCEPT)
			.iter()
			.any(|val| val.to_str().unwrap_or_default().contains("json"))
	}

	fn query_with_params(&self, new_params: IndexMap<String, String>) -> String {
		let mut params = self.query();
		params.extend(new_params);
		let query_string = url::form_urlencoded::Serializer::new(String::new())
			.extend_pairs(params)
			.finish();
		format!("?{query_string}")
	}
}
