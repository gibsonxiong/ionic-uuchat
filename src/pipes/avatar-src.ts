import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarSrc'
})
export class AvatarSrcPipe implements PipeTransform {

  transform(value = 'assets/img/default-avatar.jpg') {
    return value;
  }
}
