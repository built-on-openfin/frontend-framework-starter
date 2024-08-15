import { Injectable } from "@angular/core";
import type { App } from "@openfin/workspace";
import { CustomActionCallerType, init } from "@openfin/workspace-platform";
import { launchApp } from "./launch";
import type { PlatformSettings } from "./types";

/**
 */
@Injectable({ providedIn: "root" })
export class PlatformService {
	initializeWorkspacePlatform(platformSettings: PlatformSettings): void {
		console.log("Initializing workspace platform");

		init({
			browser: {
				defaultWindowOptions: {
					icon: platformSettings.icon,
					workspacePlatform: {
						pages: [],
						favicon: platformSettings.icon,
					},
				},
			},
			theme: [
				{
					label: "Default",
					default: "dark",
					palette: {
						brandPrimary: "#0A76D3",
						brandSecondary: "#383A40",
						backgroundPrimary: "#1E1F23",
					},
				},
			],
			customActions: {
				"launch-app": async (e): Promise<void> => {
					if (
						e.callerType === CustomActionCallerType.CustomButton ||
						e.callerType === CustomActionCallerType.CustomDropdownItem
					) {
						await launchApp(e.customData as App);
					}
				},
			},
		});
	}
}
