import { useOpenFinBootstrap } from "./useOpenFinBootstrap";

export function Provider() {
	const { statusMessage } = useOpenFinBootstrap();

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE Core Platform Window</h1>
					<h1 className="tag">Workspace platform window</h1>
				</div>
				<div className="row middle gap10">
					<img src="logo.svg" alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10">
				<p>This is the platform window, which initializes the platform.</p>
				<p>
					The window would usually be hidden, you can make it hidden on startup by setting the
					platform.autoShow flag to false in the manifest.fin.json
				</p>
				<p className="message" style={{ color: "orange" }}>
					Status: {statusMessage}
				</p>
			</main>
		</div>
	);
}
