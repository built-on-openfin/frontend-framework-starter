import "@finos/fdc3";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { fin } from "@openfin/core";
import { create } from "@openfin/workspace/notifications";

@Component({
	standalone: true,
	selector: "app-view1",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule],
	template: `
		<div class="col fill gap20">
			<header class="row spread middle">
				<div class="col">
					<h1>OpenFin Angular View 1</h1>
					<h1 class="tag">Angular app view in an OpenFin container</h1>
				</div>
				<div class="row middle gap10">
					<img src="logo.svg" alt="OpenFin" height="40px" />
				</div>
			</header>
			<main class="col gap10 left">
				<button (click)="showNotification()">Show Notification</button>
				<button (click)="broadcastFDC3Context()">Broadcast FDC3 Context</button>
				<button (click)="broadcastFDC3ContextAppChannel()">
					Broadcast FDC3 Context on App Channel
				</button>
			</main>
		</div>
	`,
})
export class View1Component {
	showNotification(): void {
		create({
			platform: fin.me.identity.uuid,
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
		});
	}

	broadcastFDC3Context() {
		if (window.fdc3) {
			window.fdc3.broadcast({
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

	async broadcastFDC3ContextAppChannel() {
		if (window.fdc3) {
			const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

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
}
