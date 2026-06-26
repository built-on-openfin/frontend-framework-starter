import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	type OnDestroy,
	type OnInit,
	signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ChannelService } from "../services/channel.service";
import { ContextService } from "../services/context.service";

@Component({
	selector: "app-view2",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	template: `
		<div class="col fill gap20">
			<header class="row spread middle">
				<div class="col">
					<h1>HERE Angular View 2</h1>
					<h1 class="tag">Angular app view in an HERE workspace</h1>
				</div>
				<div class="row middle gap10">
					<img src="logo.svg" alt="HERE" height="40px" />
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
	private destroyRef = inject(DestroyRef);

	message = signal<string>("");

	ngOnInit(): void {
		this.contextService.registerContextListener("fdc3.instrument");
		this.contextService.context$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((context) => {
			this.message.set(JSON.stringify(context, undefined, "  "));
		});

		this.channelService.registerChannelListener("CUSTOM-APP-CHANNEL", "fdc3.instrument");
		this.channelService.channel$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((context) => {
			this.message.set(JSON.stringify(context, undefined, "  "));
		});
	}

	ngOnDestroy() {
		this.contextService.removeListener();
		this.channelService.removeListener();
	}

	clearMessage() {
		this.message.set("");
	}
}
