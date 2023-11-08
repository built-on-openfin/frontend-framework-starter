import type OpenFin from "@openfin/core";
import React, { useEffect, useState } from 'react';
import logo from '../logo.svg';
import { Dock, Home, Storefront, type App } from "@openfin/workspace";
import { CustomActionCallerType, init } from "@openfin/workspace-platform";
import * as Notifications from "@openfin/workspace/notifications";
import { register as registerDock } from "./dock";
import { register as registerHome } from "./home";
import { launchApp } from "./launch";
import { register as registerNotifications } from "./notifications";
import type { CustomSettings, PlatformSettings } from "./shapes";
import { register as registerStore } from "./store";

let isInitialized = false;
let logMessage: React.Dispatch<React.SetStateAction<string>>;

function Provider() {
	const [message, setMessage] = useState("");

	logMessage = setMessage;

	useEffect(() => {
		(async function () {
			if (!isInitialized) {
				isInitialized = true;
				try {
					setMessage("Workspace platform initializing");

					// Load the settings from the manifest
					const settings = await getManifestCustomSettings();

					// When the platform api is ready we bootstrap the platform.
					const platform = fin.Platform.getCurrentSync();
					await platform.once("platform-api-ready", async () => {
						await initializeWorkspaceComponents(settings.platformSettings, settings.customSettings)
						setMessage("Workspace platform initialized");
					});

					// The DOM is ready so initialize the platform
					// Provide default icons and default theme for the browser windows
					await initializeWorkspacePlatform(settings.platformSettings);
				} catch (err) {
					setMessage(`Error Initializing Platform: ${err instanceof Error ? err.message : err}`)
				}
			}
		})();
	}, []);

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>OpenFin Platform Window</h1>
					<h1 className="tag">Workspace platform window</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10">
				<p>This is the platform window, which initializes the platform.</p>
				<p>The window would usually be hidden, you can make it hidden on startup by setting the platform.autoShow flag to false in the manifest.fin.json</p>
				<p>{message}</p>
			</main>
		</div>
	);
}

/**
 * Initialize the workspace platform.
 * @param platformSettings The platform settings from the manifest.
 */
async function initializeWorkspacePlatform(platformSettings: PlatformSettings): Promise<void> {
	logMessage("Initializing workspace platform");
	await init({
		browser: {
			defaultWindowOptions: {
				icon: platformSettings.icon,
				workspacePlatform: {
					pages: [],
					favicon: platformSettings.icon
				}
			}
		},
		theme: [
			{
				label: "Default",
				default: "dark",
				palette: {
					brandPrimary: "#0A76D3",
					brandSecondary: "#383A40",
					backgroundPrimary: "#1E1F23"
				}
			}
		],
		customActions: {
			"launch-app": async (e): Promise<void> => {
				if (
					e.callerType === CustomActionCallerType.CustomButton ||
					e.callerType === CustomActionCallerType.CustomDropdownItem
				) {
					await launchApp(e.customData as App);
				}
			}
		}
	});
}

/**
 * Bring the platform to life.
 * @param platformSettings The platform settings from the manifest.
 * @param customSettings The custom settings from the manifest.
 */
async function initializeWorkspaceComponents(
	platformSettings: PlatformSettings,
	customSettings?: CustomSettings
): Promise<void> {
	logMessage("Initializing the workspace components");

	// Register with home and show it
	logMessage("Initializing the workspace components: home");
	await registerHome(platformSettings, customSettings?.apps);
	await Home.show();

	// Register with store
	logMessage("Initializing the workspace components: store");
	await registerStore(platformSettings, customSettings?.apps);

	// Register with dock
	logMessage("Initializing the workspace components: dock");
	await registerDock(platformSettings, customSettings?.apps);

	// Register with notifications
	logMessage("Initializing the workspace components: notifications");
	await registerNotifications(platformSettings);

	// When the platform requests to be close we deregister from home and quit
	const providerWindow = fin.Window.getCurrentSync();
	await providerWindow.once("close-requested", async () => {
		await Home.deregister(platformSettings.id);
		await Storefront.deregister(platformSettings.id);
		await Dock.deregister();
		await Notifications.deregister(platformSettings.id);
		await fin.Platform.getCurrentSync().quit();
	});
}

/**
 * Read the custom settings from the manifest.fin.json.
 * @returns The custom settings from the manifest.
 */
async function getManifestCustomSettings(): Promise<{
	platformSettings: PlatformSettings;
	customSettings?: CustomSettings;
}> {
	// Get the manifest for the current application
	const app = await fin.Application.getCurrent();

	// Extract the custom settings for this application
	const manifest: OpenFin.Manifest & { customSettings?: CustomSettings } = await app.getManifest();
	return {
		platformSettings: {
			id: manifest.platform?.uuid ?? "",
			title: manifest.shortcut?.name ?? "",
			icon: manifest.platform?.icon ?? ""
		},
		customSettings: manifest.customSettings
	};
}

export default Provider;