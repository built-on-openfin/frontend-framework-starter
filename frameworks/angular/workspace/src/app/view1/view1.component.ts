import { Component } from '@angular/core';
import "@finos/fdc3";
import * as Notifications from "@openfin/workspace/notifications";

@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html'
})
export class View1Component {
	async showNotification() {
		await Notifications.create({
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
			category: "default",
			template: "markdown"
		});
	}

	async sendFDC3Context() {
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
}
