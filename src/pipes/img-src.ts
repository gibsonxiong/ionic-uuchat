import { Pipe, PipeTransform } from '@angular/core';
import {HOST} from '../config';


@Pipe({
  name: 'imgSrc'
})
export class ImgSrcPipe implements PipeTransform {

  transform(value) {
    if( value !== null || value !== undefined){
      return HOST + value;
    }else{
      return  './assets/img/default-avatar.jpg';
    }
    
  }
}
