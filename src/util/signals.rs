#[cfg(unix)]
pub async fn shutdown_signal() {
	use tokio::signal::unix::{signal, SignalKind};

	let mut sig_int = signal(SignalKind::interrupt()).expect("failed to install signal handler");
	let mut sig_term = signal(SignalKind::terminate()).expect("failed to install signal handler");

	tokio::select! {
		_ = sig_int.recv() => {},
		_ = sig_term.recv() => {},
	}
}

#[cfg(windows)]
pub async fn shutdown_signal() {
	use tokio::signal::windows::{ctrl_break, ctrl_c};

	tokio::select! {
		_ = ctrl_c().unwrap() => {},
		_ = ctrl_break().unwrap() => {},
	}
}
