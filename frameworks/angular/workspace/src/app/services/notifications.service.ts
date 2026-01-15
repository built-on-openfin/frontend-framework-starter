import { inject, Injectable } from "@angular/core";
import type * as Notifications from "@openfin/workspace/notifications";
import {
	addEventListener,
	create as createNotification,
	deregister as deregisterPlatform,
	register as registerPlatform,
} from "@openfin/workspace/notifications";
import { from, Observable, Subject, takeUntil, tap } from "rxjs";
import { SettingsService } from "./settings.service";

/**
 * Note openfin-notifications package is deprecated - use @openfin/workspace/notifications (as shown here)
 */
@Injectable({ providedIn: "root" })
export class NotificationsService {
	private settingsService = inject(SettingsService);
	private unsubscribe$ = new Subject<void>();

	constructor() {
		this.register();
	}

	/**
	 * Register notifications platform - necessary before creating notifications
	 */
	register(): void {
		console.log("Registering the Notifications provider");
		this.settingsService
			.getManifestSettings()
			.pipe(
				tap(({ platformSettings }) => {
					registerPlatform({
						notificationsPlatformOptions: platformSettings,
					});
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	observeNotificationActions(): Observable<Notifications.NotificationActionEvent> {
		return new Observable<Notifications.NotificationActionEvent>((observer) => {
			// Note addEventListener from HERE package (not default javascript function)
			addEventListener("notification-action", (event) => {
				observer.next(event);
			});
		});
	}

	deregister(platformId: string): Observable<void> {
		console.log("De-registering Notifications for id:", platformId);
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
		return from(deregisterPlatform(platformId));
	}

	create(config: Notifications.NotificationOptions): void {
		console.log("Create notification:", config);
		createNotification(config);
	}
}
