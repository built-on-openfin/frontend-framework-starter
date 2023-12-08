import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: "", loadChildren: () => import('./instructions/instructions.module').then(m => m.InstructionsModule) },
	{ path: "platform/provider", loadChildren: () => import('./platform/provider.module').then(m => m.ProviderModule) },
	{ path: "views/view1", loadChildren: () => import('./view1/view1.module').then(m => m.View1Module) },
	{ path: "views/view2", loadChildren: () => import('./view2/view2.module').then(m => m.View2Module) },
];
