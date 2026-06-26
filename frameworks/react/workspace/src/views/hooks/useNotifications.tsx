import {
	addEventListener,
	create,
	register,
	removeEventListener,
	type NotificationActionEvent,
	type NotificationOptions,
} from "@openfin/notifications";
import { useCallback, useEffect } from "react";

/**
 * Memoized registration promise so the notifications provider is registered at
 * most once per window, regardless of how many components mount the hook or how
 * many times React StrictMode re-runs the effect.
 */
let registrationPromise: Promise<unknown> | undefined;

function registerOnce(): Promise<unknown> {
	if (!registrationPromise) {
		console.log("Registering the notifications provider for this view");
		registrationPromise = register().catch((err) => {
			console.error("Failed to register the notifications provider", err);
			// Reset so a later mount can retry after a failed registration.
			registrationPromise = undefined;
		});
	}
	return registrationPromise;
}

/**
 * Hook for creating notifications and observing notification actions.
 *
 * @param onAction Optional handler invoked when a notification action is fired.
 * @returns A `create` function for raising notifications.
 */
export function useNotifications(onAction?: (event: NotificationActionEvent) => void) {
	useEffect(() => {
		void registerOnce();
	}, []);

	useEffect(() => {
		if (!onAction) {
			return;
		}

		// Note: addEventListener here is from the notifications package, not the DOM API.
		addEventListener("notification-action", onAction);
		return () => {
			removeEventListener("notification-action", onAction);
		};
	}, [onAction]);

	const createNotification = useCallback((options: NotificationOptions) => {
		console.log("Create notification:", options);
		create(options);
	}, []);

	return { create: createNotification };
}
