import { Component } from '@angular/core';
import { NavController,App } from 'ionic-angular';

import { TimelineListPage } from '../timeline-list/timeline-list';
// import { ShopPage } from '../shop/shop';  

@Component({
  selector:'cy-discover-page',
  templateUrl: 'discover.html',
})
export class DiscoverPage {
	
  constructor(
    public navCtrl : NavController,
    public appCtrl  : App
  ) {
    
  }

  gotoTimelineListPage(){
    this.appCtrl.getRootNav().push(TimelineListPage);
  }

}
