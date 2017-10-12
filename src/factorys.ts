import { XHRBackend, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { SystemService } from './services/system';
import { MyHttp } from './providers/my-http';
import { FileTransfer } from '@ionic-native/file-transfer';

export function myHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, loadingCtrl: LoadingController, systemService: SystemService, fileTransfer: FileTransfer) {
    return new MyHttp(backend, defaultOptions, loadingCtrl, systemService, fileTransfer);
}