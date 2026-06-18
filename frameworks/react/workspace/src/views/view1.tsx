import { useCallback } from "react";
import { type NotificationActionEvent } from "@openfin/notifications";
import { useNotifications } from "./hooks/useNotifications";
import { useFdc3Context } from "./hooks/useFdc3Context";
import { useFdc3Channel } from "./hooks/useFdc3Channel";

const CUSTOM_APP_CHANNEL = "CUSTOM-APP-CHANNEL";

export function View1() {
	const handleNotificationAction = useCallback((event: NotificationActionEvent) => {
		console.log("Notification clicked:", event.result?.["customData"]);
	}, []);

	const { create } = useNotifications(handleNotificationAction);
	const { broadcast: broadcastContext } = useFdc3Context();
	const { broadcast: broadcastChannel } = useFdc3Channel({ channelName: CUSTOM_APP_CHANNEL });

	const showNotification = () => {
		create({
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
	};

	const broadcastFDC3Context = () => {
		broadcastContext({
			type: "fdc3.instrument",
			name: "Microsoft Corporation",
			id: {
				ticker: "MSFT",
			},
		});
	};

	const broadcastFDC3ContextAppChannel = () => {
		broadcastChannel({
			type: "fdc3.instrument",
			name: "Apple Inc.",
			id: {
				ticker: "AAPL",
			},
		});
	};

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE React View 1</h1>
					<h1 className="tag">React app view in HERE Core</h1>
				</div>
				<div className="row middle gap10">
					<img src="logo.svg" alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10 left">
				<button type="button" onClick={showNotification}>
					Show Notification
				</button>
				<button type="button" onClick={broadcastFDC3Context}>
					Broadcast FDC3 Context
				</button>
				<button type="button" onClick={broadcastFDC3ContextAppChannel}>
					Broadcast FDC3 Context on App Channel
				</button>
			</main>
		</div>
	);
}
