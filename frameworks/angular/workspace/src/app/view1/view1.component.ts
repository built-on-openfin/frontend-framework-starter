import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ChannelService } from "../services/channel.service";
import { ContextService } from "../services/context.service";
import { NotificationsService } from "../services/notifications.service";

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
					<h1 class="tag">Angular app view in an OpenFin workspace</h1>
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
	private notificationService = inject(NotificationsService);
	private contextService = inject(ContextService);
	private channelService = inject(ChannelService);

	showNotification(): void {
		this.notificationService.create({
			title: "Simple Notification",
			body: "This is a simple notification",
			toast: "transient",
			buttons: [
				{
					title: "Click me",
				},
			],
		});
	}

	broadcastFDC3Context(): void {
		this.contextService.broadcast({
			type: "fdc3.instrument",
			name: "Microsoft Corporation",
			id: {
				ticker: "MSFT",
			},
		});
	}

	broadcastFDC3ContextAppChannel(): void {
		this.channelService.broadcast("CUSTOM-APP-CHANNEL", {
			type: "fdc3.instrument",
			name: "Apple Inc.",
			id: {
				ticker: "AAPL",
			},
		});
	}
}
