import { Pipe, PipeTransform } from '@angular/core';
import { UPLOAD_HOST } from '../config';

@Pipe({
  name: 'avatarSrc'
})
export class AvatarSrcPipe implements PipeTransform {

  transform(value) {
    if(value === null || value === undefined || value === ''){
      return 'assets/img/default-avatar.jpg';
    }else{
      return UPLOAD_HOST + value;
    }
  }
}
