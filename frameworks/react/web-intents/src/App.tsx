import "./App.css";
import { Tabs } from "./components/Tabs.tsx";
import { useInBrowser } from "./hooks/useInBrowser";

function App() {
	const { layout, error, changeLayout } = useInBrowser();

	const handleTabClick = (key: string) => {
		changeLayout(key);
	};

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			<header className="row spread middle">
				<div className="col">
					<h1>Web layout with intent support</h1>
					<Tabs layout={layout} onTabClick={handleTabClick} />
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
