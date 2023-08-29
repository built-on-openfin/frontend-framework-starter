import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { ProviderComponent } from './platform/provider.component';
import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';

const routes: Routes = [
	{ path: "", component: InstructionsComponent },
	{ path: "platform/provider", component: ProviderComponent },
	{ path: "views/view1", component: View1Component },
	{ path: "views/view2", component: View2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
