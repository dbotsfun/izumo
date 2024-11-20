// build.rs
use std::env;
use std::fs;
use std::path::Path;

fn main() {
	let version = env::var("CARGO_PKG_VERSION").unwrap();
	let out_dir = env::var("OUT_DIR").unwrap();
	let dest_path = Path::new(&out_dir).join("version.rs");
	fs::write(
		dest_path,
		format!("pub const VERSION: &str = \"{}\";", version),
	)
	.unwrap();
}
