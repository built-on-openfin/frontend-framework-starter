import { Injectable } from "@angular/core";
import { type App, Dock, type DockButtonNames, type RegistrationMetaInfo } from "@openfin/workspace";
import { from, type Observable } from "rxjs";
import { type PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class DockService {
	register(platformSettings: PlatformSettings, apps?: App[]): Observable<RegistrationMetaInfo | undefined> {
		console.log("Initializing the Dock provider");

		return from(
			Dock.register({
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
			}),
		);
	}

	show(): Promise<void> {
		return Dock.show();
	}
}
