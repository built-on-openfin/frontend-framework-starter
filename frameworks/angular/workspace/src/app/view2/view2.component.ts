import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { Subscription } from "rxjs";
import { ChannelService } from "../services/channel.service";
import { ContextService } from "../services/context.service";

@Component({
	standalone: true,
	selector: "app-view2",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule],
	template: `
		<div class="col fill gap20">
			<header class="row spread middle">
				<div class="col">
					<h1>OpenFin Angular View 2</h1>
					<h1 class="tag">Angular app view in an OpenFin workspace</h1>
				</div>
				<div class="row middle gap10">
					<img src="logo.svg" alt="OpenFin" height="40px" />
				</div>
			</header>
			<main class="col gap10 left width-full">
				@if (message()) {
					<fieldset class="width-full">
						<label htmlFor="message">Context Received</label>
						<pre id="message" class="width-full" style="min-height: 110px">{{ message() }}</pre>
					</fieldset>
					<button (click)="clearMessage()">Clear</button>
				}
			</main>
		</div>
	`,
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
