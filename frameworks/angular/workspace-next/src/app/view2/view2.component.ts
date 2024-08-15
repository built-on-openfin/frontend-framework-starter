import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { Subscription } from "rxjs";
import { ChannelService } from "../services/channel.service";
import { ContextService } from "../services/context.service";

@Component({
	standalone: true,
	selector: "app-view2",
	templateUrl: "./view2.component.html",
	styleUrls: ["./view2.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule],
})
export class View2Component implements OnInit, OnDestroy {
	private contextService = inject(ContextService);
	private channelService = inject(ChannelService);
	private contextSubscription: Subscription | null = null;
	private channelSubscription: Subscription | null = null;

	message = signal<string>("");

	ngOnInit(): void {
		this.contextService.registerContextListener("fdc3.instrument");
		this.contextSubscription = this.contextService.context$.subscribe((context) => {
			this.message.set(JSON.stringify(context, undefined, "  "));
		});

		this.channelService.registerChannelListener("CUSTOM-APP-CHANNEL", "fdc3.instrument");
		this.channelSubscription = this.channelService.channel$.subscribe((context) => {
			this.message.set(JSON.stringify(context, undefined, "  "));
		});
	}

	ngOnDestroy() {
		if (this.contextSubscription) {
			this.contextSubscription.unsubscribe();
		}
		if (this.channelSubscription) {
			this.channelSubscription.unsubscribe();
		}
		this.contextService.removeListener();
		this.channelService.removeListener();
	}

	clearMessage() {
		this.message.set("");
	}
}
