import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector:'cy-img-cutter-page',
  templateUrl: 'img-cutter.html'
})
export class ImgCutterPage {

	imgSrc:string;

  constructor(
  	    public navCtrl:NavController,
    	public navParams:NavParams

  	) {

  	this.imgSrc = navParams.data['imgSrc'];
  }


}
