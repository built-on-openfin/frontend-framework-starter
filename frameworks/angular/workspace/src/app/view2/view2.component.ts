import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-view2',
  templateUrl: './view2.component.html'
})
export class View2Component {
	private _zone: NgZone;
	public message: string;

	constructor(zone: NgZone) {
		this._zone = zone;
		this.message = "";
	}

	async ngOnInit() {
		await this.listenForFDC3Context();
		await this.listenForFDC3ContextAppChannel();
	}

	async listenForFDC3Context() {
		if (window.fdc3) {
			await window.fdc3.addContextListener((context) => {
				this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}	

	async listenForFDC3ContextAppChannel() {
		if (window.fdc3) {
			const appChannel = await window.fdc3.getOrCreateChannel("CUSTOM-APP-CHANNEL");

			await appChannel.addContextListener((context) => {
				this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}	
}
