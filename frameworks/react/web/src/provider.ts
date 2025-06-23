import type OpenFin from "@openfin/core";
import { connect, type WebLayoutSnapshot } from "@openfin/core-web";
import { BROKER_URL, LAYOUT_URL } from "./config.ts";

/**
 * Gets the default layout for this app.
 * @returns The default layout for this app.
 */
async function getDefaultLayout(): Promise<WebLayoutSnapshot> {
	const layoutResponse = await fetch(LAYOUT_URL);
	const layoutJson = (await layoutResponse.json()) as WebLayoutSnapshot;
	return layoutJson;
}
/**
 * Initializes the OpenFin Web Broker connection.
 */
export async function init(): Promise<OpenFin.Fin<"external connection"> | undefined> {
	// Get the default layout
	const layoutSnapshot = await getDefaultLayout();

	if (layoutSnapshot === undefined) {
		console.error("Unable to load the default snapshot.");
		return;
	}
	// Get the dom element that should host the layout
	const layoutContainer = document.querySelector<HTMLElement>("#layout_container");
	if (layoutContainer === null) {
		console.error(
			"Please ensure the document has an element with the following id #layout_container so that the web-layout can be applied.",
		);
		return;
	}
	// Connect to the OpenFin Web Broker and pass the default layout.
	// It is good practice to specify providerId even if content is explicitly specifying it for cases where
	// this provider uses our layout system and content uses inheritance. currentContextGroup
	// is useful for defaulting any client that uses inheritance through our layout system.
	const fin = await connect({
		connectionInheritance: "enabled",
		options: {
			brokerUrl: BROKER_URL,
			interopConfig: {
				providerId: "web-layout-basic",
				currentContextGroup: "green",
			},
		},
		platform: { layoutSnapshot },
	});

	// You may now use the `fin` object to initialize the broker and the layout.
	await fin.Interop.init("web-layout-basic");
	// initialize the layout and pass it the dom element to bind to
	await fin.Platform.Layout.init({
		container: layoutContainer,
	});

	return fin;
}
