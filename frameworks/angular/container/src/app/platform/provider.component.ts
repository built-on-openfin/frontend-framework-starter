import { fin } from "@openfin/core";
import { Component } from '@angular/core';
import * as Notifications from "@openfin/workspace/notifications";

@Component({
	selector: 'app-provider',
	templateUrl: './provider.component.html'
})
export class ProviderComponent {
	public message: string;

	constructor() {
		this.message = "";
	}

	async ngOnInit() {
		let runtimeAvailable = false;
		if (fin) {
			try {
				await fin.Platform.init({});

				await Notifications.register({
					notificationsPlatformOptions: {
						id: fin.me.identity.uuid,
						title: "Angular Container Starter",
						icon: "http://localhost:4200/favicon.ico"
					}
				});
				
				runtimeAvailable = true;
			} catch {
			}
		}

		if (runtimeAvailable) {
			const runtimeInfo = await fin.System.getRuntimeInfo();
			this.message = `OpenFin Runtime: ${runtimeInfo.version}`;
		} else {
			this.message = "OpenFin runtime is not available";
		}
	}
}
