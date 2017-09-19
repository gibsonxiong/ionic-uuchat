import { Injectable } from '@angular/core';
import { ToastController, ToastOptions, Toast, LoadingController, LoadingOptions, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';

declare var require;
var _ = require('../assets/js/underscore');

@Injectable()
export class SystemService {

	constructor(
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController
	) {

	}

	//Toast
	public createToast(options): Toast {
		var toastDefaults: ToastOptions = {
			duration: 2000,
			position: 'middle',
		};

		//只输入msg字符串
		if (_.isString(options)) options = { message: options };
		options = _.extend(toastDefaults, options);

		return this.toastCtrl.create(options);
		// toast.present();
	}

	public showToast(options): Toast {
		var toast = this.createToast(options);
		toast.present();
		return toast;
	}


	//Loading
	public createLoading(options?): Loading {
		var loadingDefaults: LoadingOptions = {};

		//只输入msg字符串
		if (_.isString(options)) options = { content: options };
		options = _.extendOwn(loadingDefaults, options);

		return this.loadingCtrl.create(options);
	}

	public showLoading(options?): Loading {
		var loading = this.createLoading(options);
		loading.present();
		return loading;
	}

	public closeLoading(loading: Loading) {
		loading.dismiss();
	}

	//依附在异步上,异步完成后自动销毁
	public linkLoading(observable: Observable<any>, LoadingOptions?): Observable<any> {
		var loading = this.showLoading(LoadingOptions);

		return observable.do(
			() => {
				this.closeLoading(loading);
			},
			() => {
				this.closeLoading(loading);
			}
		);

	}

	

}
