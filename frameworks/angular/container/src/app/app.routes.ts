import { type Routes } from "@angular/router";

/*
Routes for OpenFin sample application

In a production app we would likely have each application as an independently deployable standalone project.
For this example we have separate routes representing the applications, this is an acceptable pattern for
cohesive code that makes sense to colocate in one repository. However, it's important to lazy-load each route
so that the whole application isn't bootstrapped when opening an individual window or view

(Note for standalone components use loadComponent and not loadChildren)
*/
export const routes: Routes = [
	{
		path: "provider",
		loadComponent: () => import("./provider/provider.component").then((m) => m.ProviderComponent),
	},
	{
		path: "view1",
		loadComponent: () => import("./view1/view1.component").then((m) => m.View1Component),
	},
	{
		path: "view2",
		loadComponent: () => import("./view2/view2.component").then((m) => m.View2Component),
	},
];
