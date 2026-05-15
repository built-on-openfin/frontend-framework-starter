/**
 * React hook that returns a memoized helper for raising FDC3 intents through
 * the global API when OpenFin Web interop has been initialized.
 */
import { type Context } from "@finos/fdc3";
import { useCallback } from "react";

export function useRaiseIntent() {
	return useCallback((intentName: string, context: Context) => {
		if (window.fdc3) {
			return window.fdc3.raiseIntent(intentName, context);
		} else {
			console.log("fdc3 not found");
		}
	}, []);
}
