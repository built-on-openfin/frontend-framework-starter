import { useOpenFin } from "./hooks/useOpenFin";

export function Provider() {
	useOpenFin();

	return (
		<main>
			<h3>OpenFin platform provider</h3>
			<p>
				The window would usually be hidden, you can make it hidden on startup by setting the
				platform.autoShow flag to false in the manifest.fin.json
			</p>
		</main>
	);
}
