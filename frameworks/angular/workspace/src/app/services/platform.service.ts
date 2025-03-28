import { Injectable } from "@angular/core";
import type OpenFin from "@openfin/core";
import type { App } from "@openfin/workspace";
import { CustomActionCallerType, init } from "@openfin/workspace-platform";
import { from, type Observable } from "rxjs";
import { launchApp } from "./launch";
import type { PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class PlatformService {
	initializeWorkspacePlatform(platformSettings: PlatformSettings): Observable<OpenFin.Platform> {
		console.log("Initializing workspace platform");

		return from(
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
			}),
		);
	}
}
