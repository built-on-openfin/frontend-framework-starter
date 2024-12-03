import * as Notifications from "@openfin/workspace/notifications";
import logo from "../logo.svg";
import { useEffect } from "react";


function View3() {
	useEffect(() => {
		Notifications.register().then(() => {
			Notifications.addEventListener("notification-action", (event) => {
				console.log("Notification clicked:", event.result["customData"]);
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
						customData: "Arbitrary custom data",
					},
				},
			],
		});
	}

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>OpenFin React View 3</h1>
					<h1 className="tag">React app view in an OpenFin container</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10 left">
				<button onClick={() => showNotification()}>Show Notification</button>
			</main>
		</div>
	);
}

export default View3;
