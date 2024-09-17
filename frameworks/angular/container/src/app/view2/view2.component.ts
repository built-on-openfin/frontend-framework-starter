import "@finos/fdc3";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, type OnInit, signal } from "@angular/core";

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
					<h1 class="tag">Angular app view in an OpenFin container</h1>
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
export class View2Component implements OnInit {
	message = signal<string>("");

	ngOnInit(): void {
		this.listenForFDC3Context();
		this.listenForFDC3ContextAppChannel();
	}

	listenForFDC3Context() {
		if (window.fdc3) {
			window.fdc3?.addContextListener("fdc3.instrument", (context) => {
				console.log("ContextService: received message", context);
				this.message.set(JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	async listenForFDC3ContextAppChannel() {
		if (window.fdc3) {
			const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");
			await appChannel.addContextListener((context) => {
				this.message.set(JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}

	clearMessage() {
		this.message.set("");
	}
}
