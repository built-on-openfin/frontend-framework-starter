import { inject, Injectable } from "@angular/core";
import {
	addEventListener,
	create as createNotification,
	register as registerNotificationPlatform,
	type NotificationActionEvent,
	type NotificationOptions,
} from "@openfin/workspace/notifications";
import { Observable, Subject, takeUntil, tap } from "rxjs";
import { SettingsService } from "./settings.service";

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
				tap(() => registerNotificationPlatform()),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	observeNotificationActions(): Observable<NotificationActionEvent> {
		return new Observable<NotificationActionEvent>((observer) => {
			// Note addEventListener from notifications package (not default javascript function)
			addEventListener("notification-action", (event) => {
				observer.next(event);
			});
		});
	}

	deregister(platformId: string): void {
		console.log("De-registering Notifications for id:", platformId);
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	create(config: NotificationOptions): void {
		console.log("Create notification:", config);
		createNotification(config);
	}
}
