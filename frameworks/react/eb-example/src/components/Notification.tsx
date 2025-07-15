import * as Notifications from "@openfin/workspace/notifications";
import { useEffect } from "react";

export function Notification() {
	useEffect(() => {
		Notifications.register().then(() => {
			Notifications.addEventListener("notification-action", (event) => {
				debugger;
				console.log("Notification clicked:", event.result["customData"]);
			});
		});
	}, []);

	async function sendNotification() {
		await Notifications.create({
			platform: fin.me.identity.uuid,
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
			buttons: [
				{
					title: "Click me",
					type: "button",
					cta: true,
					onClick: {
						customData: "Arbitrary custom data",
					},
				},
			],
		});
	}

	return (
		<>
			<button type="button" onClick={sendNotification}>
				Send notification
			</button>
		</>
	);
}
