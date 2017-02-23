import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Request, Response } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { Transfer } from 'ionic-native';
import { HOST } from '../../config';


@Injectable()
export class MyHttp extends Http {

	private loading;
	private requestHeaders = {};
	private requestCount = 0;

	constructor(
		_backend: ConnectionBackend,
		_defaultOptions: RequestOptions,
		private loadingCtrl: LoadingController,

	) {
		super(_backend, _defaultOptions);
	}

	request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

		return super.request(url, options);
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

	upload(filePath, fileName, remoteUrl, params?): Promise<any> {

		const fileTransfer = new Transfer();
		var options = {
			fileKey: 'file',
			fileName: fileName,
			headers: this.requestHeaders,
			params: params
		};

		return fileTransfer.upload(filePath, remoteUrl, options);

	}
}