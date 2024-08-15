import { Injectable } from "@angular/core";
import { fin } from "@openfin/core";
import { addEventListener, create, NotificationOptions, register } from "@openfin/workspace/notifications";
import { PlatformSettings } from "./types";

/**
 * Note openfin-notifications package is deprecated - use @openfin/workspace/notifications (as shown here)
 */
@Injectable({ providedIn: "root" })
export class NotificationsService {
	async register(platformSettings: PlatformSettings) {
		console.log("Registering the Notifications provider");
		await register({
			notificationsPlatformOptions: platformSettings,
		});

		addEventListener("notification-action", (event) => {
			console.log("action", event);
		});
	}

	create(config: NotificationOptions): void {
		create({
			platform: fin.me.identity.uuid,
			...config,
		});
	}
}
