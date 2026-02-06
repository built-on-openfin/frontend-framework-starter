import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, concatMap, forkJoin, map, Observable, of, tap } from "rxjs";
import { DockService } from "./dock.service";
import { HomeService } from "./home.service";
import { PlatformService } from "./platform.service";
import { SettingsService } from "./settings.service";
import { StoreService } from "./store.service";
import type { CustomSettings, PlatformSettings } from "./types";

/**
 * Bootstraps the OpenFin workspace
 */
@Injectable({ providedIn: "root" })
export class WorkspaceService {
	//
	private platformService = inject(PlatformService);
	private dockService = inject(DockService);
	private homeService = inject(HomeService);
	private storeService = inject(StoreService);
	private settingsService = inject(SettingsService);

	private readonly status$: BehaviorSubject<string>;

	constructor() {
		this.status$ = new BehaviorSubject("");
	}

	init(): Observable<boolean> {
		if (!this.isOpenFin()) {
			this.status$.next("Not running in HERE Core");
			return of(false);
		}

		this.status$.next("Workspace platform initializing...");
		return this.settingsService.getManifestSettings().pipe(
			concatMap((settings) =>
				this.platformService.initializeWorkspacePlatform(settings.platformSettings).pipe(
					concatMap(() => this.awaitPlatformReady()),
					concatMap(() => this.registerComponents(settings)),
					concatMap(() => this.showStartupComponents()),
					tap(() => this.status$.next("Platform initialized")),
				),
			),
			map(() => true),
			catchError((e) => {
				const msg = e instanceof Error ? e.message : e;
				console.error("Error Initializing Platform", msg);
				this.status$.next(`Error Initializing Platform ${msg}`);
				return of(false);
			}),
		);
	}

	awaitPlatformReady(): Observable<void> {
		return new Observable<void>((observer) => {
			const platform = fin.Platform.getCurrentSync();
			platform.once("platform-api-ready", () => {
				this.status$.next("Platform api ready...");
				observer.next();
				observer.complete();
			});
		});
	}

	registerComponents({
		platformSettings,
		customSettings,
	}: {
		platformSettings: PlatformSettings;
		customSettings?: CustomSettings;
	}): Observable<unknown[]> {
		this.status$.next("Registering workspace components...");
		return forkJoin([
			this.dockService.register(platformSettings, customSettings?.apps),
			this.homeService.register(platformSettings),
			this.storeService.register(platformSettings),
		]);
	}

	showStartupComponents(): Observable<void[]> {
		// Display the workspace components to the user at startup (they are hidden by default)
		return forkJoin([this.homeService.show(), this.dockService.show()]);
	}

	isOpenFin() {
		return fin?.me.isOpenFin;
	}

	quit() {
		if (this.isOpenFin()) {
			fin.Platform.getCurrentSync().quit();
		}
	}

	getStatus$(): Observable<string> {
		return this.status$;
	}
}
