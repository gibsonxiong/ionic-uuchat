import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { TimelineListPage } from '../timeline-list/timeline-list';
import { JokeListPage } from '../joke-list/joke-list';


@Component({
  selector: 'cy-discover-page',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  constructor(
    public navCtrl: NavController,
    public appCtrl: App
  ) {

  }

  gotoTimelineListPage() {
    this.appCtrl.getRootNav().push(TimelineListPage);
  }

  gotoJokeListPage() {
    this.appCtrl.getRootNav().push(JokeListPage);
  }
}
