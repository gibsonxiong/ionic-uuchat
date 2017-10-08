import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Request, Response } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { SystemService } from '../services/system';


@Injectable()
export class MyHttp extends Http {

	private loading;
	private requestHeaders = {};
	private requestCount = 0;

	private timeoutLimit = 12000;
	private timeoutErrorMsg = '$$timeout';

	constructor(
		_backend: ConnectionBackend,
		_defaultOptions: RequestOptions,
		private loadingCtrl: LoadingController,
		private systemService : SystemService,

	) {
		super(_backend, _defaultOptions);
	}

	// request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

	// 	return super.request(url, options)

	// }


	private convertResponse(_res: Response) {
		let res = _res.json();

		//code < 0 的当错误处理
		if (res.code <  0) {
			throw {
				$custom: 1,
				code: res.code,
				msg: res.msg,
				data: res.data
			};
		}

		return res;
	}

	get(url: string, options?: RequestOptionsArgs): Observable<any> {
		return super.get(url, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}

	post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
		return super.post(url, body, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}

	put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
		return super.put(url, body, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}

	delete(url: string, options?: RequestOptionsArgs): Observable<any> {
		return super.delete(url, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}

	patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
		return super.patch(url, body, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}

	head(url: string, options?: RequestOptionsArgs): Observable<any> {
		return super.head(url, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}

	options(url: string, options?: RequestOptionsArgs): Observable<any> {
		return super.options(url, options)
			.timeout(this.timeoutLimit)
			.map(this.convertResponse)
	}


	setToken(token) {
		this._defaultOptions.headers.set('X-Access-Token', token);

		//上传手机资源
		this.requestHeaders['X-Access-Token'] = token;
	}

	removeToken() {
		this._defaultOptions.headers.delete('X-Access-Token');

		//上传手机资源
		delete this.requestHeaders['X-Access-Token'];
	}

	upload(filePath, fileName, remoteUrl, params?): Observable<any> {

		// const fileTransfer: FileTransferObject = this.transfer.create();

		// let options = {
		// 	fileKey: 'file',
		// 	fileName: fileName,
		// 	headers: this.requestHeaders,
		// 	params: params
		// };

		// let p = fileTransfer.upload(filePath, remoteUrl, options);

		// return Observable.fromPromise(p)
		// 	.timeout(this.timeoutLimit)
		// 	.map(result => {
		// 		var res = JSON.parse(result.response);

		// 		if (res.code) {
		// 			throw {
		// 				$custom: 1,
		// 				code: res.code,
		// 				msg: res.msg,
		// 				data: res.data
		// 			};
		// 		}

		// 		return res;
		// 	})

		return Observable.create();

	}

	handleError(err, defaultMsg: string = '出错啦') {
		if (err.message == '$$timeout') {
			return this.systemService.showToast('请求超时');
		}

		else if (err.status === 0) {
			return this.systemService.showToast('网络不通');
		}

		//程序错误(自定义)
		else if (err.$custom) {
			return this.systemService.showToast(err.msg || '出错啦');
		}

		//取消动作不提示
		else if (
			err.code === 'userCancelled'										//	android crop
			|| (err.message === "Error on cropping" && err.code === "404")		//	android imgPicker
			|| (err === 'Camera cancelled.')									//  android camera
		) {
			return;
		}

		//程序异常
		this.systemService.showToast(defaultMsg);
	}
}