import { XHRBackend, RequestOptions } from '@angular/http';
import { MyHttp } from './providers/my-http';

export function myHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
    return new MyHttp(backend, defaultOptions);
}