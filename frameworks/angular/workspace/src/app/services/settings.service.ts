import { Injectable } from "@angular/core";
import { App } from "@openfin/workspace";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { CustomSettings, ManifestWithCustomSettings, PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class SettingsService {
	private readonly apps$ = new BehaviorSubject<App[]>([]);

	/**
	 * Reads the custom settings from the manifest.fin.json
	 * @returns The custom settings from the manifest.
	 */
	getManifestCustomSettings(): Observable<{
		platformSettings: PlatformSettings;
		customSettings?: CustomSettings;
	}> {
		const app = fin.Application.getCurrentSync();
		return fromPromise(app.getManifest()).pipe(
			map((manifest: ManifestWithCustomSettings) => ({
				platformSettings: {
					id: manifest.platform?.uuid ?? "",
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
