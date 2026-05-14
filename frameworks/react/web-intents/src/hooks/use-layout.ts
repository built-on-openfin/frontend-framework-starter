import { type OpenFin } from "@openfin/core";
import { useEffect } from "react";
import { makeOverride } from "../layout/layout-override";
import { init } from "../provider.ts";

export type UseLayoutProps = {
	// settings: Settings;
	// defaultLayout: WebPageLayout | null;
	fin: OpenFin.Fin<OpenFin.EntityType> | undefined;
};

export function useLayout({ fin }: UseLayoutProps) {
	useEffect(() => {
		// Get the dom element that should host the layout
		const container = document.querySelector<HTMLElement>("#layout_container");
		if (container === null) {
			console.error(
				"Please ensure the document has an element with the following id #layout_container so that the web-layout can be applied.",
			);
			return;
		}

		void init().then(async () => {
			const layoutManagerOverride = makeOverride();
			await fin?.Platform.Layout.init({ layoutManagerOverride, container });
		});
	});
}
