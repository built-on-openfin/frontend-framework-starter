import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	template: `<router-outlet />`,
	styles: [":host { flex: 1 }"],
})
export class AppComponent {}
