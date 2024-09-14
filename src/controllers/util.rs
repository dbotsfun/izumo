use crate::util::bytes_request::BytesRequest;
use axum::http::request::Parts;
use axum::http::{Extensions, HeaderMap, HeaderValue, Method, Request, Uri, Version};

pub trait RequestPartsExt {
	fn method(&self) -> &Method;
	fn uri(&self) -> &Uri;
	fn version(&self) -> Version;
	fn headers(&self) -> &HeaderMap<HeaderValue>;
	fn extensions(&self) -> &Extensions;
}

impl RequestPartsExt for Parts {
	fn method(&self) -> &Method {
		&self.method
	}
	fn uri(&self) -> &Uri {
		&self.uri
	}
	fn version(&self) -> Version {
		self.version
	}
	fn headers(&self) -> &HeaderMap<HeaderValue> {
		&self.headers
	}
	fn extensions(&self) -> &Extensions {
		&self.extensions
	}
}

impl<B> RequestPartsExt for Request<B> {
	fn method(&self) -> &Method {
		self.method()
	}
	fn uri(&self) -> &Uri {
		self.uri()
	}
	fn version(&self) -> Version {
		self.version()
	}
	fn headers(&self) -> &HeaderMap<HeaderValue> {
		self.headers()
	}
	fn extensions(&self) -> &Extensions {
		self.extensions()
	}
}

impl RequestPartsExt for BytesRequest {
	fn method(&self) -> &Method {
		self.0.method()
	}
	fn uri(&self) -> &Uri {
		self.0.uri()
	}
	fn version(&self) -> Version {
		self.0.version()
	}
	fn headers(&self) -> &HeaderMap<HeaderValue> {
		self.0.headers()
	}
	fn extensions(&self) -> &Extensions {
		self.0.extensions()
	}
}
