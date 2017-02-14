import { Component } from '@angular/core';

@Component({
  selector:'cy-daily-page',
  templateUrl: 'daily.html',
})
export class DailyPage {
	items = [];

  constructor() {
    for (let i = 0; i < 20; i++) {
      this.items.push( this.items.length );
    }
  }

  doRefresh(refresher) {

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
