import { Component, ViewChild, OnInit } from '@angular/core';
import { App } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

import { DownloadPage } from '../download/download';
import { SettingPage } from '../setting/setting';
import { MeDetailPage } from '../me-detail/me-detail';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { BackEnd } from '../../providers/backend';

@Component({
	selector: 'cy-me-page',
	templateUrl: 'me.html'
})
export class MePage implements OnInit {

	private own = {};

	private own_Subscription;

	constructor(
		private appCtrl: App,
		private userService: UserService,
		private backend: BackEnd,
		private systemService: SystemService,
	) {

	}

	ngOnInit() {
		this.own_Subscription = this.userService.own$.subscribe(own => this.own = own);
	}

	ngOnDestroy() {
		this.own_Subscription.unsubscribe();
	}

	scanBarCode() {
		let options = {
			showFlipCameraButton: true,
			showTorchButton: true,
			orientation: 'portrait'
		}
		BarcodeScanner.scan(options)
			.then((barcodeData) => {
				console.log('barcodeData', barcodeData);
				// Success! Barcode data is here
			}, (err) => this.systemService.handleError(err,'出错啦'));
	}


	gotoMeDetailPage() {
		this.appCtrl.getRootNav().push(MeDetailPage);
	}

	gotoDownloadPage() {
		this.appCtrl.getRootNav().push(DownloadPage);
	}

	gotoSettingPage() {
		this.appCtrl.getRootNav().push(SettingPage);
	}


}
