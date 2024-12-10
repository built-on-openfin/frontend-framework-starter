import "./App.css";
import { Tabs } from "./components/Tabs.tsx";
import { useApps } from "./hooks/useApps.ts";
import { useInBrowser } from "./hooks/useInBrowser";
import { useSettings } from "./hooks/useSettings.ts";

function App() {
	const { settings } = useSettings();
	const { apps } = useApps();
	const { layout, error, changeLayout } = useInBrowser({ apps, settings });

	const handleTabClick = (key: string) => {
		changeLayout(key);
	};

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			<header className="row spread middle">
				<Tabs layout={layout} onTabClick={handleTabClick} />
				<div className="row middle gap20">
					<img src="./icon-blue.png" alt="OpenFin" height="40px"></img>
				</div>
			</header>
			<main id="layout_container" />
		</>
	);
}

export default App;
