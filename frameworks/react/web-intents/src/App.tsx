import "./App.css";
import { useInBrowser } from "./hooks/useInBrowser";

function App() {
	useInBrowser();

	return (
		<>
			<header className="row spread middle">
				<div className="col">
					<h1>Web Layout Basic Example</h1>
					<h1 className="tag">Web layout with intent support</h1>
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
