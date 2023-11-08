import { Component, NgZone } from '@angular/core';
import type OpenFin from "@openfin/core";
import { fin } from "@openfin/core";
import { Dock, Home, Storefront, type App } from "@openfin/workspace";
import { CustomActionCallerType, init } from "@openfin/workspace-platform";
import * as Notifications from "@openfin/workspace/notifications";
import { register as registerDock } from "./dock";
import { register as registerHome } from "./home";
import { launchApp } from "./launch";
import { register as registerNotifications } from "./notifications";
import type { CustomSettings, PlatformSettings } from "./shapes";
import { register as registerStore } from "./store";

@Component({
	selector: 'app-provider',
	templateUrl: './provider.component.html'
})
export class ProviderComponent {
	private _zone: NgZone;
	public message: string;

	constructor(zone: NgZone) {
		this._zone = zone;
		this.message = "";
	}

	logMessage(message: string) {
		this._zone.run(() => this.message = message);
	}

	async ngOnInit() {
		try {
			this.logMessage("Workspace platform initializing");

			// Load the settings from the manifest
			const settings = await this.getManifestCustomSettings();

			// When the platform api is ready we bootstrap the platform.
			const platform = fin.Platform.getCurrentSync();
			await platform.once("platform-api-ready", async () => {
				await this.initializeWorkspaceComponents(settings.platformSettings, settings.customSettings)
				this.logMessage("Workspace platform initialized");
			});

			// The DOM is ready so initialize the platform
			// Provide default icons and default theme for the browser windows
			await this.initializeWorkspacePlatform(settings.platformSettings);
		} catch (err) {
			this.logMessage(`Error Initializing Platform: ${err instanceof Error ? err.message : err}`);
		}
	}

	/**
 * Initialize the workspace platform.
 * @param platformSettings The platform settings from the manifest.
 */
	async initializeWorkspacePlatform(platformSettings: PlatformSettings): Promise<void> {
		this.logMessage("Initializing workspace platform");
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
	async initializeWorkspaceComponents(
		platformSettings: PlatformSettings,
		customSettings?: CustomSettings
	): Promise<void> {
		this.logMessage("Initializing the workspace components");

		// Register with home and show it
		this.logMessage("Initializing the workspace components: home");
		await registerHome(platformSettings, customSettings?.apps);
		await Home.show();

		// Register with store
		this.logMessage("Initializing the workspace components: store");
		await registerStore(platformSettings, customSettings?.apps);

		// Register with dock
		this.logMessage("Initializing the workspace components: dock");
		await registerDock(platformSettings, customSettings?.apps);

		// Register with notifications
		this.logMessage("Initializing the workspace components: notifications");
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
	async getManifestCustomSettings(): Promise<{
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
}
