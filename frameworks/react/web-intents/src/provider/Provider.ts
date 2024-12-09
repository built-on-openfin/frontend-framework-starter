import { cloudInteropOverride } from "@openfin/cloud-interop";
import { type OpenFin } from "@openfin/core";
import { connect, type WebLayoutSnapshot } from "@openfin/core-web";
import { type PlatformLayoutSnapshot } from "../shapes/layout-shapes.ts";
import { type Settings } from "../shapes/setting-shapes.ts";
import { getConstructorOverride } from "./broker/interop-override.ts";
import { makeOverride } from "./layout/layout-override.ts";
import { getDefaultLayout, getSettings } from "./settings/settings.ts";

export class Provider {
	public layout: PlatformLayoutSnapshot | null = null;

	constructor() {
		console.log("Provider initialized");
	}

	public async initializeWorkspacePlatform(): Promise<void> {
		const settings = await getSettings();
		const layoutSnapshot = await getDefaultLayout();

		if (settings === undefined || layoutSnapshot === undefined) {
			console.error(
				"Unable to run the sample as we have been unable to load the web manifest and it's settings from the currently running html page. Please ensure that the web manifest is being served and that it contains the custom_settings section.",
			);
			return;
		}

		this.listenForConfigRequests(settings);

		// Connect to the OpenFin Web Broker and pass the default layout.
		// It is good practice to specify providerId even if content is explicitly specifying it for cases where
		// this provider uses our layout system and content uses inheritance. currentContextGroup
		// is useful for defaulting any client that uses inheritance through our layout system.
		const fin = await connect({
			options: {
				brokerUrl: settings.platform.interop.brokerUrl,
				interopConfig: {
					providerId: settings.platform.interop.providerId,
					currentContextGroup: settings.platform.interop.defaultContextGroup,
				},
			},
			connectionInheritance: "enabled",
			platform: { layoutSnapshot: layoutSnapshot as WebLayoutSnapshot },
		});

		if (fin) {
			// Store the fin object in the window object for easy access.
			window.fin = fin;
			const layoutManagerOverride = makeOverride(
				fin,
				settings.platform.layout.layoutContainerId,
				settings.platform.layout.layoutSelectorId,
			);

			const interopOverride = await getConstructorOverride(settings.platform.interop.overrideOptions);
			const overrides = [interopOverride];

			if (settings?.platform?.cloudInterop?.connectParams?.url?.startsWith("http")) {
				const cloudOverride = (await cloudInteropOverride(
					settings.platform.cloudInterop.connectParams,
				)) as unknown as OpenFin.ConstructorOverride<OpenFin.InteropBroker>;
				overrides.push(cloudOverride);
			}
			// You may now use the `fin` object to initialize the broker and the layout.
			await fin.Interop.init(settings.platform.interop.providerId, overrides);
			// Show the main container and hide the loading container
			// initialize the layout and pass it the dom element to bind to
			await fin.Platform.Layout.init({
				layoutManagerOverride,
				containerId: settings.platform.layout.layoutContainerId,
			});
			// now that everything has been setup notify others of globals
			const finReadyEvent = new CustomEvent("finReady");
			window.dispatchEvent(finReadyEvent);
			if (window.fdc3 === undefined && window?.fin?.me.interop?.getFDC3Sync !== undefined) {
				window.fdc3 = fin.me.interop.getFDC3Sync("2.0");
				console.log("Finished initializing the fdc3 API.");
				// Create and dispatch the FDC3Ready event
				const fdc3ReadyEvent = new CustomEvent("fdc3Ready");
				window.dispatchEvent(fdc3ReadyEvent);
			}
			// setup listeners now that everything has been initialized
			// await attachListeners();

			this.layout = layoutSnapshot as PlatformLayoutSnapshot;
		}
	}

	public teardown(): void {
		console.log("Tearing down Provider");
	}

	/**
	 * Listen for config requests.
	 * @param settings passing the settings for use.
	 */
	public listenForConfigRequests(settings: Settings): void {
		// This allows iframes that are not in the layout to request the connect details if they do not have them
		// available to them.
		window.addEventListener(
			"message",
			(event) => {
				// Check the origin of the message
				// this is where you could check to see if the request is coming from domains registered in your app directory
				// alternatively this logic could be done in the interop broker when the connection is attempted. These are
				// just example origins we have put
				if (
					event.origin !== "https://built-on-openfin.github.io" &&
					!event.origin.startsWith("http://localhost:")
				) {
					console.warn(`Incoming request came from an untrusted domain: ${event.origin}`);
					return;
				}

				// The data sent with postMessage is stored in event.data
				const request = event.data;
				console.log(
					`Incoming request coming from: ${event.origin}. Received request: ${JSON.stringify(request)}`,
				);

				// this just our example namespace. You could create your own and decide what data to pass.
				const connectConfigContextType = "openfin.coreWeb.connectConfig";
				// ensure it is requesting connect details for core web
				if (request.type === connectConfigContextType) {
					// send back the connect details required by the client
					event.source?.postMessage(
						{
							type: connectConfigContextType,
							connectConfig: {
								options: {
									brokerUrl: settings.platform.interop.brokerUrl,
									interopConfig: {
										providerId: settings.platform.interop.providerId,
										currentContextGroup: settings.platform.interop.defaultContextGroup,
									},
								},
							},
						},
						{ targetOrigin: event.origin },
					);
				}
			},
			false,
		);
	}
}
