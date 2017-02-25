import {  Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform{
  
  transform(value) {
    var genders = ['男','女'];
    return genders[value] || '';
  }
}
