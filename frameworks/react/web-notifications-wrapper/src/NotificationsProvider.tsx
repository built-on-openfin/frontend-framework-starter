import OpenFin from "@openfin/core";
import { initNotificationCenter } from "@openfin/web-notifications";
import { type ReactNode, useEffect, useRef } from "react";

export type NotificationsProviderProps = {
	finApi: OpenFin.Fin<"external connection">;
	children: ReactNode;
};

export function NotificationsProvider({ finApi, children }: NotificationsProviderProps) {
	const initialised = useRef(false);

	useEffect(() => {
		async function init(fin: OpenFin.Fin<"external connection">) {
			if (!fin || initialised.current) {
				return;
			}

			const notificationCenterContainer = document.querySelector<HTMLElement>(
				"#notification_center_container",
			);

			if (!notificationCenterContainer) {
				console.error("No notification center container found");
				return;
			}

			await initNotificationCenter({
				finContext: fin,
				serviceId: "web-notification-service-channel",
				container: notificationCenterContainer,
			});

			initialised.current = true;
		}

		void init(finApi);
	}, [finApi]);

	return (
		<>
			<div>{children}</div>
			<div id="notification_center_container"></div>
		</>
	);
}
