import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, type OnInit, signal } from "@angular/core";
import { addEventListener, create, register } from "@openfin/workspace/notifications";

@Component({
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
				<div>{{ notificationActionMessage() }}</div>
			</main>
		</div>
	`,
})
export class View1Component implements OnInit {
	notificationActionMessage = signal("");

	ngOnInit(): void {
		register().then(() => {
			addEventListener("notification-action", (event) => {
				console.log("Notification clicked:", event.result["customData"]);
				this.notificationActionMessage.set(event.result["customData"]);
			});
		});
	}

	showNotification(): void {
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
						customData: "Notification action data",
					},
				},
			],
		});
	}

	broadcastFDC3Context() {
		if (fdc3) {
			fdc3.broadcast({
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
}
