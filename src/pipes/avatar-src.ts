import { Pipe, PipeTransform } from '@angular/core';
import { HOST } from '../config';

@Pipe({
  name: 'avatarSrc'
})
export class AvatarSrcPipe implements PipeTransform {

  transform(value = 'assets/img/default-avatar.jpg') {
    return HOST + '/' + value;
  }
}
