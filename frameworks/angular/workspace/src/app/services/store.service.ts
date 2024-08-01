import { inject, Injectable } from "@angular/core";
import { Storefront, StorefrontTemplate, StoreRegistration } from "@openfin/workspace";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { launchApp } from "./launch";
import { SettingsService } from "./settings.service";
import { PlatformSettings } from "./types";

@Injectable({ providedIn: "root" })
export class StoreService {
	private settingsService = inject(SettingsService);

	register(platformSettings: PlatformSettings): Observable<StoreRegistration | undefined> {
		console.log("Initializing the Store provider");

		const apps = this.settingsService.getApps();

		return fromPromise(
			Storefront.register({
				...platformSettings,
				getNavigation: async () => [
					{
						id: "apps",
						title: "Apps",
						items: [
							{
								id: "all-apps",
								title: "All Apps",
								templateId: StorefrontTemplate.AppGrid,
								templateData: {
									apps: apps ?? [],
								},
							},
						],
					},
				],
				getLandingPage: async () => ({
					topRow: {
						title: "Custom Top Row Content",
						items: [
							{
								id: "top-row-item-1",
								title: "All Apps",
								description: "All of your applications.",
								image: {
									src: platformSettings.icon,
								},
								templateId: StorefrontTemplate.AppGrid,
								templateData: {
									apps: apps ?? [],
								},
							},
						],
					},
					middleRow: {
						title: "",
						apps: [],
					},
					bottomRow: {
						title: "",
						items: [],
					},
				}),
				getFooter: async () => ({
					logo: { src: platformSettings.icon, size: "32" },
					text: platformSettings.title,
					links: [],
				}),
				getApps: async () => apps ?? [],
				launchApp: async (app) => {
					await launchApp(app);
				},
			}),
		);
	}

	show() {
		Storefront.show();
	}
}
