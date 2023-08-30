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
		if (window.fdc3) {
			await window.fdc3.addContextListener((context) => {
				this._zone.run(() => this.message = JSON.stringify(context, undefined, "  "));
			});
		} else {
			console.error("FDC3 is not available");
		}
	}
}
