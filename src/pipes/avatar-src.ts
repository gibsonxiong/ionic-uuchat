import { Pipe, PipeTransform } from '@angular/core';
import { UPLOAD_HOST } from '../config/config';

@Pipe({
  name: 'avatarSrc'
})
export class AvatarSrcPipe implements PipeTransform {

  transform(value, size:number=100) {
    if(value === null || value === undefined || value === ''){
      return 'assets/img/default-avatar.jpg';
    }else{
      var url = UPLOAD_HOST + value;
      return size ? url + '@'+ size +'.jpg' : url;
    }
  }
}
