import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';

@Component({
	selector: 'cy-setting-page',
	templateUrl: 'setting.html'
})
export class SettingPage {

	constructor(
		private navCtrl: NavController,
		public storage: Storage,
	) {

	}

	clearStorage() {
		this.storage.clear();
	}

	//登出
	signout(): void {
		var that = this;

		this.storage.remove('token').then(() => {
			that.navCtrl.setRoot(LoginPage);
		});
	}

}
