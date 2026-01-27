import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@openfin/core-web/styles.css";
import "./index.css";
import { init } from "./provider.ts";

init()
	.then(() => {
		console.log("Created the HERE Web Layout.");
		return true;
	})
	.catch((err) => console.error(err));

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
