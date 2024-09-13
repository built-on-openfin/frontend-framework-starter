import { Injectable } from "@angular/core";
import { fin } from "@openfin/core";
import { create, NotificationOptions, register } from "@openfin/workspace/notifications";
import { from } from "rxjs";
import { PlatformSettings } from "./types";

/**
 * Note openfin-notifications package is deprecated - use @openfin/workspace/notifications (as shown here)
 */
@Injectable({ providedIn: "root" })
export class NotificationsService {
	register(platformSettings: PlatformSettings) {
		console.log("Registering the Notifications provider");
		return from(
			register({
				notificationsPlatformOptions: platformSettings,
			}),
		);
	}

	create(config: NotificationOptions): void {
		create({
			platform: fin.me.identity.uuid,
			...config,
		});
	}
}
