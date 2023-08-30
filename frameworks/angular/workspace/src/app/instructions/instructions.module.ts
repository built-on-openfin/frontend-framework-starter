import { NgModule } from '@angular/core';

import { InstructionsRoutingModule } from './instructions-routing.module';
import { InstructionsComponent } from './instructions.component';

@NgModule({
	imports: [
		InstructionsRoutingModule
	],
	declarations: [
		InstructionsComponent
	]
})
export class InstructionsModule { }