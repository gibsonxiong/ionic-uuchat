import { NgModule } from '@angular/core';
import { ImgComponent } from './img/img';
import { ContentInputComponent } from './content-input/content-input';
import { QrcodeComponent } from './qrcode/qrcode';

@NgModule({
	declarations: [
		ImgComponent,
		ContentInputComponent,
		QrcodeComponent
	],
	imports: [],
	exports: [
		ImgComponent,
		ContentInputComponent,
		QrcodeComponent
	]
})
export class ComponentsModule {}
