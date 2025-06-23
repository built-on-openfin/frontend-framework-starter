import "./App.css";
import type OpenFin from "@openfin/core";
import { useEffect, useState } from "react";
// @ts-ignore
import { NotificationsProvider } from "../notification-center/index.esm.js";
import { init } from "./provider.ts";

function App() {
	const [finApi, setFinApi] = useState<OpenFin.Fin<"external connection"> | undefined>(undefined);

	useEffect(() => {
		async function bootstrap() {
			try {
				setFinApi(await init());
			} catch (err) {
				console.error(err);
			}
		}
		void bootstrap();
	}, []);

	return (
		<NotificationsProvider finApi={finApi}>
			<header className="row spread middle">
				<div className="col">
					<h1>Web Layout Basic Example</h1>
					<h1 className="tag">Demonstrate a very basic layout with generic content</h1>
				</div>
				<div className="row middle gap20">
					<img src="./icon-blue.png" alt="OpenFin" height="40px"></img>
				</div>
			</header>
			<main id="layout_container" />
		</NotificationsProvider>
	);
}

export default App;
