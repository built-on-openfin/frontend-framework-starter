import { type OpenFin } from "@openfin/core";
import { useEffect } from "react";
import { makeOverride } from "../layout/layout-override";

export type UseLayoutProps = {
	finApi: OpenFin.Fin<OpenFin.EntityType> | undefined;
};

export function useLayout({ finApi }: UseLayoutProps) {
	useEffect(() => {
		if (!finApi) return;

		// Get the dom element that should host the layout
		const container = document.querySelector<HTMLElement>("#layout_container");
		if (container === null) {
			console.error(
				"Please ensure the document has an element with the following id #layout_container so that the web-layout can be applied.",
			);
			return;
		}

		const layoutManagerOverride = makeOverride();

		finApi?.Platform.Layout.init({ layoutManagerOverride, container })
			.then(() => {
				console.log("Layout initialized");
			})
			.catch((err) => {
				console.error(err);
			});
	}, [finApi]);
}
