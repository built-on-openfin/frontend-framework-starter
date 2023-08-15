import React from 'react';
import logo from '../logo.svg';
import * as Notifications from "openfin-notifications";
import "@finos/fdc3";

function View1() {
	async function showNotification() {
		await Notifications.create({
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
			category: "default",
			template: "markdown"
		});
	}

	async function sendFDC3Context() {
		if (window.fdc3) {
			await window.fdc3.broadcast({
				type: 'fdc3.instrument',
				name: 'Microsoft Corporation',
				id: {
					ticker: 'MSFT'
				}
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	return (
		<div className="col fill gap20">
			<header className="row spread middle">
				<div className="col">
					<h1>OpenFin React View 1</h1>
					<h1 className="tag">React app view in an OpenFin container</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10 left">
				<button onClick={() => showNotification()}>Show Notification</button>
				<button onClick={() => sendFDC3Context()}>Send FDC3 Context</button>
			</main>
		</div>
	);
}

export default View1;
