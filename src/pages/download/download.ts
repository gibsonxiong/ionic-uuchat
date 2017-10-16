import { Component } from '@angular/core';
import { ANDROID_DOWNLOAD_URL } from '../../config/config';

@Component({
	selector: 'cy-download-page',
	templateUrl: 'download.html'
})
export class DownloadPage {

	private android_url = ANDROID_DOWNLOAD_URL;

	constructor(
	) {

	}


}
