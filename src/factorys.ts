import { XHRBackend, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { MyHttp } from './providers/my-http';

export function myHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, loadingCtrl:LoadingController) {
    return new MyHttp(backend, defaultOptions, loadingCtrl);
}