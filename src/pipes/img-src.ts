import { Pipe, PipeTransform } from '@angular/core';
import {UPLOAD_HOST} from '../config/config';


@Pipe({
  name: 'imgSrc'
})
export class ImgSrcPipe implements PipeTransform {

  transform(value, size:number) {
    if(value === null || value === undefined || value === ''){
      return 'assets/img/default-avatar.jpg';
    }else{
      var url = UPLOAD_HOST + value;
      return size ? url + '@'+ size +'.jpg' : url;
    }
  }
}
