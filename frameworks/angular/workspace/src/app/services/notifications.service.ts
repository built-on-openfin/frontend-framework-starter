import { Injectable } from "@angular/core";
import { fin } from "@openfin/core";
import { addEventListener, create, NotificationOptions, register } from "@openfin/workspace/notifications";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { PlatformSettings } from "./types";

/**
 * Note openfin-notifications package is deprecated - use @openfin/workspace/notifications (as shown here)
 */
@Injectable({ providedIn: "root" })
export class NotificationsService {
	register(platformSettings: PlatformSettings) {
		console.log("Registering the Notifications provider");

		addEventListener("notification-action", (event) => {
			console.log("action", event);
		});

		return fromPromise(
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
