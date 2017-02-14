import {Injectable} from '@angular/core';
import {Http, ConnectionBackend, RequestOptions} from '@angular/http';


@Injectable()
export class MyHttp extends Http {

	constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions){
		super(_backend,_defaultOptions);
	}

  setToken(token){
  	this._defaultOptions.headers.set('X-Access-Token', token);
  }

  removeToken(){
  	this._defaultOptions.headers.delete('X-Access-Token');
  }
}