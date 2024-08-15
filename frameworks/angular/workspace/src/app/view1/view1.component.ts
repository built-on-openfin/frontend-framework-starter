import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ChannelService } from "../services/channel.service";
import { ContextService } from "../services/context.service";
import { NotificationsService } from "../services/notifications.service";

@Component({
	standalone: true,
	selector: "app-view1",
	templateUrl: "./view1.component.html",
	styleUrls: ["./view1.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule],
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
