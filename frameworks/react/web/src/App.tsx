import "./App.css";

function App() {
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
			<main className="row fill gap10">
				<div className="row fill" id="main-page">
					<div id="layout_container" className="col fill"></div>
				</div>
			</main>
		</>
	);
}

export default App;
