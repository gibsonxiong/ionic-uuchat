import { Injectable } from '@angular/core';
import { ToastController, ToastOptions, LoadingController, LoadingOptions } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

declare var require;
var _ = require('../assets/js/underscore');

@Injectable()
export class SystemService {
	//toast
	public toastSubject = new Subject();
	public loadingSubject = new Subject();

	constructor(
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController
	) {
		this.toastSubject.subscribe(
			options => {
				this.presentToast(options);
			}
		)

		this.loadingSubject.subscribe(
			options => {
				this.presentLoading(options);
			}
		)
	}

	private presentToast(options): void {
		var toastDefaults: ToastOptions = {
			duration: 3500,
			position: 'top',
		};

		//只输入msg字符串
		if (_.isString(options)) options = { message: options };
		options = _.extend(toastDefaults, options);

		let toast = this.toastCtrl.create(options);
		toast.present();
	}

	private presentLoading(options): void {
		var loadingDefaults: LoadingOptions = {};

		//只输入msg字符串
		if (_.isString(options)) options = { content: options };
		options = _.extendOwn(loadingDefaults, options);

		let loading = this.loadingCtrl.create(options);
		loading.present();
	}


}
