import { NgModule } from '@angular/core';
import { ImgComponent } from './img/img';
import { ContentInputComponent } from './content-input/content-input';

@NgModule({
	declarations: [
		ImgComponent,
		ContentInputComponent
	],
	imports: [],
	exports: [
		ImgComponent,
		ContentInputComponent
	]
})
export class ComponentsModule {}
