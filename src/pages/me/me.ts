import { Component, ViewChild, OnInit } from '@angular/core';
import { App } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { SigninPage } from '../signin/signin';
import { MeDetailPage } from '../me-detail/me-detail';
import { UserService } from '../../services/user';
import { MyHttp } from '../../providers/my-http';
import { SocketIO } from '../../providers/socket-io';

@Component({
	selector: 'cy-me-page',
	templateUrl: 'me.html'
})
export class MePage implements OnInit {

	private own = {};

	constructor(
		public appCtrl: App,
		public storage: Storage,
		public userService: UserService,
		public myHttp: MyHttp,
		public socketIO: SocketIO,
	) {

	}

	ngOnInit() {
		this.userService.own$.subscribe(own => this.own = own);
	}

	
	scanBarCode() {
		// let options = {
		// 	showFlipCameraButton: true,
		// 	showTorchButton: true,
		// 	orientation: 'portrait'
		// }
		// BarcodeScanner.scan(options).then((barcodeData) => {
		// 	console.log('barcodeData', barcodeData);
		// 	// Success! Barcode data is here
		// }, (err) => {
		// 	// An error occurred
		// 	console.log('[err] barcodeData', err);
		// });
	}

	clearStorage() {
		this.storage.clear();
	}

	//登出
	signout(): void {
		var that = this;

		this.storage.remove('token').then(() => {
			that.myHttp.removeToken();
			that.socketIO.signout();
			that.appCtrl.getRootNav().setRoot(SigninPage);
		});
	}

	gotoMeDetailPage() {
		this.appCtrl.getRootNav().push(MeDetailPage);
	}



}
