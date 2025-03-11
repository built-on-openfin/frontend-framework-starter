import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { connect, WebLayoutSnapshot } from "@openfin/core-web";
import { environment } from "../environments/environment";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
	@ViewChild("layoutContainer") layoutContainer!: ElementRef<HTMLElement>;

	ngOnInit(): void {
		this.init();
	}

	async init(): Promise<void> {
		const layoutSnapshot = await this.getDefaultLayout();

		if (!layoutSnapshot) {
			console.error("Unable to load the default snapshot");
			return;
		}
		if (!this.layoutContainer) {
			console.error("Host element #layout_container not found");
			return;
		}

		// Connect to the OpenFin Web Broker and pass the default layout.
		// It is good practice to specify providerId even if content is explicitly specifying it for cases where
		// this provider uses our layout system and content uses inheritance. currentContextGroup
		// is useful for defaulting any client that uses inheritance through our layout system.
		const fin = await connect({
			connectionInheritance: "enabled",
			options: {
				brokerUrl: environment.brokerUrl,
				interopConfig: {
					providerId: environment.providerId,
					currentContextGroup: "green",
				},
			},
			platform: { layoutSnapshot },
			logLevel: "info",
		});

		// You may now use the `fin` object to initialize the broker and the layout.
		await fin.Interop.init(environment.providerId);

		// initialize the layout and pass it the dom element to bind to
		await fin.Platform.Layout.init({
			container: this.layoutContainer.nativeElement,
		});
	}

	async getDefaultLayout(): Promise<WebLayoutSnapshot> {
		const layoutResponse = await fetch(environment.layoutUrl);
		const layoutJson = (await layoutResponse.json()) as WebLayoutSnapshot;
		return layoutJson;
	}
}
