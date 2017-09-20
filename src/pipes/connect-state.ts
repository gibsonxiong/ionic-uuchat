import {  Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'connectState'
})
export class ConnectStatePipe implements PipeTransform{
  
  transform(value) {
    var arr = ['(未连接)','(连接中)',''];
    return arr[value] || '';
  }
}
