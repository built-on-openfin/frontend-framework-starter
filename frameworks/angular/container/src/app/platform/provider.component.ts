import { fin } from "@openfin/core";
import { Component } from '@angular/core';

@Component({
	selector: 'app-provider',
	templateUrl: './provider.component.html'
})
export class ProviderComponent {
	public message: string;

	constructor() {
		this.message = "";
	}

	async ngOnInit() {
		let runtimeAvailable = false;
		if (fin) {
			try {
				await fin.Platform.init({});
				runtimeAvailable = true;
			} catch {
			}
		}

		if (runtimeAvailable) {
			const runtimeInfo = await fin.System.getRuntimeInfo();
			this.message = `OpenFin Runtime: ${runtimeInfo.version}`;
		} else {
			this.message = "OpenFin runtime is not available";
		}
	}
}
