import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-service-worker",
	template: `<button (click)="sync()" class="update-btn">Sync</button>`
})
export class ServiceWorkerComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		if ("serviceWorker" in navigator && "SyncManager" in window) {
			console.log('Registering service worker')

			navigator.serviceWorker
				.register("/service-worker.js", { scope: "/" })
				.then((registration) => {
					console.log("Service Worker Registered with Scope:", registration.scope);
				})
				.catch((error) => {
					console.error("Service Worker Registration Failed:", error);
				});
		}
	}

	sync() {
		this.requestBackgroundSync();
	}

	async requestBackgroundSync() {
		if (!("serviceWorker" in navigator)) {
			console.log("Service Worker Not Supported");
			return;
		}

		if (!("SyncManager" in window)) {
			console.log("Background Sync Not Supported in this environment");
			return;
		}

		try {
			// Wait for service worker to be ready and active
			const registration = await navigator.serviceWorker.ready;

			console.log("Service Worker State:", registration.active?.state);

			// Check if sync is available on the registration
			if (!("sync" in registration)) {
				console.log("Background Sync API not available on this registration");
				return;
			}

			// Check if we're in a secure context (required for Background Sync)
			if (!window.isSecureContext) {
				console.warn("Background Sync requires a secure context (HTTPS or localhost)");
			}

			// Attempt to register the sync
			// @ts-ignore
			await registration.sync.register("sync-access-logs");
			console.log("Background Sync Registered Successfully");
		} catch (e) {
			console.error("Background Sync Registration Failed", e);

			// Provide more helpful error messages
			if (e instanceof Error) {

				alert(e.toString())

				if (e.name === "NotAllowedError") {
					console.error("Permission denied. Possible causes:");
					console.error("- Running in OpenFin which may restrict Background Sync API");
					console.error("- Browser settings or policies blocking Background Sync");
					console.error("- Not in a secure context (HTTPS required, except localhost)");
				} else if (e.name === "InvalidStateError") {
					console.error("Service Worker is not in active state");
				}
			}
		}
	}
}
