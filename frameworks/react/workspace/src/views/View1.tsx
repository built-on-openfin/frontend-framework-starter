import { fin } from "@openfin/core";
import React from 'react';
import logo from '../logo.svg';
import * as Notifications from "@openfin/workspace/notifications";
import "@finos/fdc3";

function View1() {
	async function showNotification() {
		await Notifications.create({
			platform: fin.me.identity.uuid,
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
			category: "default",
			template: "markdown"
		});
	}

	async function broadcastFDC3Context() {
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

	async function broadcastFDC3ContextAppChannel() {
		if (window.fdc3) {
			const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

			await appChannel.broadcast({
				type: 'fdc3.instrument',
				name: 'Apple Inc.',
				id: {
					ticker: 'AAPL'
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
					<h1 className="tag">React app view in an OpenFin workspace</h1>
				</div>
				<div className="row middle gap10">
					<img src={logo} alt="OpenFin" height="40px" />
				</div>
			</header>
			<main className="col gap10 left">
				<button onClick={() => showNotification()}>Show Notification</button>
				<button onClick={() => broadcastFDC3Context()}>Broadcast FDC3 Context</button>
				<button onClick={() => broadcastFDC3ContextAppChannel()}>Broadcast FDC3 Context on App Channel</button>
			</main>
		</div>
	);
}

export default View1;
