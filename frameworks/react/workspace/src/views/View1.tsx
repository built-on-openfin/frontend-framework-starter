import * as Notifications from "@openfin/workspace/notifications";
import React, { useEffect, useState } from "react";
import logo from "../logo.svg";

function View1() {
	const [notificationActionMessage, setNotificationActionMessage] = useState("");

	useEffect(() => {
		Notifications.register().then(() => {
			Notifications.addEventListener("notification-action", (event) => {
				console.log("Notification clicked:", event.result["customData"]);
				setNotificationActionMessage(event.result["customData"]);
			});
		});
	}, []);

	async function showNotification() {
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
						customData: "custom notification data",
					},
				},
			],
		});
	}

	async function broadcastFDC3Context() {
		if (fdc3) {
			await fdc3.broadcast({
				type: "fdc3.instrument",
				name: "Microsoft Corporation",
				id: {
					ticker: "MSFT",
				},
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	async function broadcastFDC3ContextAppChannel() {
		if (fdc3) {
			const appChannel = await fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

			await appChannel.broadcast({
				type: "fdc3.instrument",
				name: "Apple Inc.",
				id: {
					ticker: "AAPL",
				},
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>HERE React View 1</h1>
					<h1 className="tag">React app view in an HERE workspace</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="HERE" height="40px" />
				</div>
			</header>
			<main className="col gap10 left">
				<button onClick={() => showNotification()}>Show Notification</button>
				<button onClick={() => broadcastFDC3Context()}>Broadcast FDC3 Context</button>
				<button onClick={() => broadcastFDC3ContextAppChannel()}>
					Broadcast FDC3 Context on App Channel
				</button>
				{notificationActionMessage && <div>Notification action: {notificationActionMessage}</div>}
			</main>
		</div>
	);
}

export default View1;
