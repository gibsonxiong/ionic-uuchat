import { XHRBackend, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { SystemService } from './services/system';
import { MyHttp } from './providers/my-http';

export function myHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, loadingCtrl: LoadingController, systemService: SystemService) {
    return new MyHttp(backend, defaultOptions, loadingCtrl, systemService);
}