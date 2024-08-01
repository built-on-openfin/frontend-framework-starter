import { inject, Injectable } from "@angular/core";
import {
	App,
	CLITemplate,
	Home,
	HomeDispatchedSearchResult,
	HomeProvider,
	HomeRegistration,
	HomeSearchListenerRequest,
	HomeSearchListenerResponse,
	HomeSearchResult,
} from "@openfin/workspace";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { launchApp } from "./launch";
import { SettingsService } from "./settings.service";
import { PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class HomeService {
	private settingsService = inject(SettingsService);

	register(platformSettings: PlatformSettings): Observable<HomeRegistration | undefined> {
		console.log("Initializing the Home provider");

		const homeProvider: HomeProvider = {
			...platformSettings,
			onUserInput: async (request: HomeSearchListenerRequest, response: HomeSearchListenerResponse) => {
				//
				// Here you decide what to do with the user input
				// In this example we simulate an asynchronous lookup and return results via the response param

				const queryLower = request.query.toLowerCase();

				// Async results
				response.respond([]);

				// Immediate results
				return {
					results: this.mapAppEntriesToSearchEntries(this.settingsService.getApps()),
				};
			},
			/**
			 * The callback fired when a selection is made in home.
			 * @param result The item that was selected in home.
			 */
			onResultDispatch: async (result: HomeDispatchedSearchResult): Promise<void> => {
				if (result.data !== undefined) {
					await launchApp(result.data as App);
				} else {
					console.warn("Unable to execute result without data being passed");
				}
			},
		};

		return fromPromise(Home.register(homeProvider));
	}

	show(): Promise<void> {
		return Home.show();
	}

	/**
	 * Convert the app definitions into search results.
	 * @param apps The list of apps to convert.
	 * @returns The search result templates.
	 */
	mapAppEntriesToSearchEntries(apps: App[]): HomeSearchResult[] {
		const results: HomeSearchResult[] = [];

		if (Array.isArray(apps)) {
			for (const app of apps) {
				const action = { name: "Launch View", hotkey: "enter" };
				const entry: Partial<HomeSearchResult> = {
					key: app.appId,
					title: app.title,
					data: app,
					description: app.description,
					shortDescription: app.description,
					template: CLITemplate.SimpleText,
					templateContent: app.description,
				};

				if (app.manifestType === "view") {
					entry.label = "View";
					entry.actions = [action];
				} else if (app.manifestType === "snapshot") {
					entry.label = "Snapshot";
					action.name = "Launch Snapshot";
					entry.actions = [action];
				} else if (app.manifestType === "manifest") {
					entry.label = "App";
					action.name = "Launch App";
					entry.actions = [action];
				} else if (app.manifestType === "external") {
					action.name = "Launch Native App";
					entry.label = "Native App";
					entry.actions = [action];
				}

				if (Array.isArray(app.icons) && app.icons.length > 0) {
					entry.icon = app.icons[0].src;
				}

				results.push(entry as HomeSearchResult);
			}
		}

		return results;
	}
}
