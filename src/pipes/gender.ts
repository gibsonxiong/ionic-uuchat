import {  Pipe, PipeTransform } from '@angular/core';

/*
  Generated class for the Cc pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform{
  /*
    Takes a value and makes it lowercase.
   */
  transform(value) {
    var genders = ['男','女'];
    return genders[value] || '';
  }
}
