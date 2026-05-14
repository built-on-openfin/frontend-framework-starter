import "./App.css";
import { useLayout } from "./hooks/use-layout.ts";
import { useWebProvider } from "./hooks/use-web-provider.ts";

function App() {
	const { fin } = useWebProvider();
	useLayout({ fin });

	return (
		<>
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
		</>
	);
}

export default App;
