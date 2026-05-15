import "../../App.css";

import { useLayout } from "../../hooks/use-layout.ts";
import { useWebProvider } from "../../hooks/use-web-provider.ts";

export function Provider() {
	const finApi = useWebProvider();
	useLayout({ finApi });

	return (
		<>
			<header className="row spread middle">
				<div className="col">
					<h1>FDC3 Intents Basic Example</h1>
					<h1 className="tag">Demonstrate the basic raise intent flow</h1>
				</div>
				<div className="row middle gap20">
					<img src="./icon-blue.png" alt="OpenFin" height="40px"></img>
				</div>
			</header>
			<main id="layout_container" />
		</>
	);
}
