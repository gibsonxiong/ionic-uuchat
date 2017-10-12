import { NgModule } from '@angular/core';
import { TimediffPipe } from './timediff';
import { ConnectStatePipe } from './connect-state';
import { AvatarSrcPipe } from './avatar-src';
import { GenderPipe } from './gender';
import { ImgSrcPipe } from './img-src';

@NgModule({
	declarations: [
		TimediffPipe,
		ConnectStatePipe,
		AvatarSrcPipe,
		GenderPipe,
		ImgSrcPipe
	],
	imports: [],
	exports: [
		TimediffPipe,
		ConnectStatePipe,
		AvatarSrcPipe,
		GenderPipe,
		ImgSrcPipe
	]
})
export class PipesModule {}
