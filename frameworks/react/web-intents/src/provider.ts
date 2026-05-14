import { type OpenFin } from "@openfin/core";
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
 * Initializes the HERE Web Broker connection.
 */
export async function init(): Promise<OpenFin.Fin<OpenFin.EntityType> | undefined> {
	// Get the default layout
	const layoutSnapshot = await getDefaultLayout();

	if (layoutSnapshot === undefined) {
		console.error("Unable to load the default snapshot.");
		return;
	}
	// Connect to the https://resources.here.io/docs/core/ Web Broker and pass the default layout.
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

	return fin;
}
