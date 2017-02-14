import { Component } from '@angular/core';
import { NavController,App } from 'ionic-angular';

import { QuestionPage } from '../question/question';
import { JokePage } from '../joke/joke';
import { ShopPage } from '../shop/shop';  

@Component({
  selector:'cy-discover-page',
  templateUrl: 'discover.html',
})
export class DiscoverPage {
	
	private QuestionPage = QuestionPage;
	private JokePage  = JokePage;
	private ShopPage = ShopPage;

  constructor(
    public navCtrl : NavController,
    public appCtrl  : App
  ) {
    
  }

  gotoPage(pageName){
  	var page = this[pageName];
  	if(!page) return;
    this.appCtrl.getRootNav().push(page);
    // this.navCtrl.push(page); 
  }

}
