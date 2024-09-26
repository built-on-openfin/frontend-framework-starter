import { Injectable } from "@angular/core";
import { type App } from "@openfin/workspace";
import { BehaviorSubject, from, map, type Observable, tap } from "rxjs";
import { type CustomSettings, type ManifestWithCustomSettings, type PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class SettingsService {
	private readonly apps$ = new BehaviorSubject<App[]>([]);

	/**
	 * Reads the custom settings from the manifest.fin.json
	 * @returns The custom settings from the manifest.
	 */
	getManifestSettings(): Observable<{
		platformSettings: PlatformSettings;
		customSettings?: CustomSettings;
	}> {
		const app = fin.Application.getCurrentSync();
		return from(app.getManifest()).pipe(
			map((manifest: ManifestWithCustomSettings) => ({
				platformSettings: {
					id: manifest.platform?.uuid ?? fin.me.identity.uuid,
					title: manifest.shortcut?.name ?? "",
					icon: manifest.platform?.icon ?? "",
				},
				customSettings: manifest.customSettings,
			})),
			tap(({ customSettings }) => {
				this.apps$.next(customSettings?.apps ? customSettings.apps : []);
			}),
		);
	}

	getApps(): App[] {
		return this.apps$.getValue();
	}
}
