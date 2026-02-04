import * as Notifications from "@openfin/workspace/notifications";

/**
 * Register the notification provider.
 * @returns The registration details for notifications.
 */
export async function register(): Promise<Notifications.NotificationsRegistration | undefined> {
	console.log("Initializing the notification provider.");

	try {
		const metaInfo = await Notifications.register();
		console.log("Notification provider initialized.", metaInfo);
		return metaInfo;
	} catch (err) {
		console.error("An error was encountered while trying to register the notifications provider", err);
	}
}
