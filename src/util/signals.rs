pub async fn shutdown_signal() {
	#[cfg(unix)]
	unix_signals().await;
	#[cfg(windows)]
	windows_signals().await;
}

#[cfg(unix)]
async fn unix_signals() {
	use tokio::signal::unix::{signal, SignalKind};
	let [mut s1, mut s2] = [
		signal(SignalKind::interrupt())
			.expect("failed to install signal handler")
			.recv(),
		signal(SignalKind::terminate())
			.expect("failed to install signal handler")
			.recv(),
	];
	tokio::select! {
		_ => s1 => {}
		v =  s2 => {},
	}
}

#[cfg(windows)]
async fn windows_signals() {
	let (mut s1, mut s2) = (
		tokio::signal::windows::ctrl_c().unwrap(),
		tokio::signal::windows::ctrl_break().unwrap(),
	);

	tokio::select! {
		v = s1.recv() => v.unwrap(),
		v = s2.recv() => v.unwrap(),
	}
}
