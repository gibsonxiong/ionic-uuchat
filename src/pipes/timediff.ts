import { Pipe, PipeTransform } from '@angular/core';

/*
  Generated class for the Cc pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
	name: 'timediff'
})
export class TimediffPipe implements PipeTransform {
	/*
	  Takes a value and makes it lowercase.
	 */
	transform(value) {
		var time = new Date(value);
		var timeStamp = time.getTime();
		var currTime = Date.now();
		var diff = (currTime - timeStamp) / 1000;

		if (diff < 60 && diff >= 0) {
			return "刚刚";
		} else if (diff >= 60 && diff < 3600) {
			return Math.floor(diff / 60) + "分钟前";
		} else if (diff >= 3600 && diff < 3600 * 24) {
			return Math.floor(diff / 3600) + "小时前";
		} else if (diff >= 3600 * 24 && diff < 3600 * 24 * 30) {
			return Math.floor(diff / 3600 / 24) + "天前";
		} else if (diff >= 3600 * 24 * 30 && diff < 3600 * 24 * 30 * 12) {
			return Math.floor(diff / 3600 / 24 / 30) + "个月前";
		} else if (diff >= 3600 * 24 * 30 * 12) {
			return Math.floor(diff / 3600 / 24 / 30 / 12) + "年前";
		} else {
			return "刚刚";
		}
	}
}
