import { NgModule } from '@angular/core';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';

@NgModule({
	imports: [
		ProviderRoutingModule
	],
	declarations: [
		ProviderComponent
	]
})
export class ProviderModule { }