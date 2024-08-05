import { Routes } from '@angular/router';

/*
Routes for OpenFin sample application

In a production app we would likely have each application as an independently deployable standalone project.
For this example we have separate routes representing the applications, this is an acceptable pattern for
cohesive views and code that makes sense to colocate in your repository. However, it's important to
lazy-load each route so that the whole application isn't bootstrapped when opening a window/view which may be
a small subset of the total application
*/

export const routes: Routes = [
  {
    path: 'platform/provider',
    loadChildren: () => import('./provider/provider.component').then((m) => m.ProviderComponent),
  },
  {
    path: 'views/view1',
    loadChildren: () => import('./view1/view1.component').then((m) => m.View1Component),
  },
  {
    path: 'views/view2',
    loadChildren: () => import('./view2/view2.component').then((m) => m.View2Component),
  },
];
