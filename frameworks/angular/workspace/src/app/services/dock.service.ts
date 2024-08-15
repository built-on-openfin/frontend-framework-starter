import { Injectable } from "@angular/core";
import { App, Dock, DockButtonNames } from "@openfin/workspace";
import { PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class DockService {
	async register(platformSettings: PlatformSettings, apps?: App[]) {
		console.log("Initializing the Dock provider");

		await Dock.register({
			...platformSettings,
			workspaceComponents: ["home", "store", "notifications", "switchWorkspace"],
			disableUserRearrangement: false,
			buttons: [
				{
					type: "DropdownButton" as DockButtonNames.DropdownButton,
					tooltip: "Apps",
					id: "apps",
					iconUrl: platformSettings.icon,
					options: (apps ?? []).map((app) => ({
						tooltip: app.title,
						iconUrl: app.icons?.length ? app.icons[0].src : platformSettings.icon,
						action: {
							id: "launch-app",
							customData: app,
						},
					})),
				},
			],
		});
	}

	show() {
		Dock.show();
	}
}
