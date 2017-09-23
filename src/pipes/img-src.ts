import { Pipe, PipeTransform } from '@angular/core';
import {UPLOAD_HOST} from '../config/config';


@Pipe({
  name: 'imgSrc'
})
export class ImgSrcPipe implements PipeTransform {

  transform(value) {
    if( value !== null || value !== undefined){
      return UPLOAD_HOST + value;
    }else{
      return  './assets/img/default-avatar.jpg';
    }
    
  }
}
