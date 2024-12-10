import { connect } from "@openfin/core-web";
import { useEffect, useState } from "react";

export function useConnect(): {
	finReady: boolean;
	fdc3Ready: boolean;
} {
	const [finReady, setFinReady] = useState(false);
	const [fdc3Ready, setFdc3Ready] = useState(false);

	async function initFin() {
		if (window.fin) {
			console.log("Already connected");
			return;
		}
		window.fin = await connect({
			connectionInheritance: "enabled",
		});
		console.log("Connected to OpenFin api");
		window.dispatchEvent(new CustomEvent("finReady"));
		setFinReady(true);
	}

	function initFdc3() {
		if (window.fdc3 === undefined && window.fin?.me.interop.getFDC3Sync !== undefined) {
			window.fdc3 = fin.me.interop.getFDC3Sync("2.0");
			console.log("Connected to FDC3 api");
			window.dispatchEvent(new CustomEvent("fdc3Ready"));
			setFdc3Ready(true);
		}
	}

	useEffect(() => {
		console.log("Connecting to In-Browser API");
		initFin()
			.then(() => initFdc3())
			.catch((err) => console.error(err));
	}, []);

	return { finReady, fdc3Ready };
}
