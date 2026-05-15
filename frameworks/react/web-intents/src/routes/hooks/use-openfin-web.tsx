import { connect } from "@openfin/core-web";
import { useEffect } from "react";

export function useOpenFinWeb() {
	useEffect(() => {
		(async () => {
			window.fin = await connect({
				connectionInheritance: "enabled",
			});
			window.fdc3 = window.fin?.me.interop.getFDC3Sync("2.0");
			window.dispatchEvent(new CustomEvent("fdc3Ready"));

			console.log("Connected to OpenFin Web");
		})();
	}, []);
}
