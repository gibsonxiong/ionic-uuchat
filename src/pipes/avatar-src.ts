import { Pipe, PipeTransform } from '@angular/core';
import {HOST} from '../config';


@Pipe({
  name: 'avatarSrc'
})
export class AvatarSrcPipe implements PipeTransform {

  transform(value) {
    if( value !== null || value !== undefined){
      return HOST + value;
    }else{
      return  './assets/img/default-avatar.jpg';
    }
    
  }
}
