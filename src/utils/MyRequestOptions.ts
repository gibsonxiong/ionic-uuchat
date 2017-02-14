import {Injectable} from '@angular/core';
import {BaseRequestOptions} from '@angular/http';

@Injectable()
export class MyRequestOptions extends BaseRequestOptions {
  setToken(token){
  	this.headers.set('X-Access-Token', token);
  }

  removeToken(){
  	this.headers.delete('X-Access-Token');
  }
}