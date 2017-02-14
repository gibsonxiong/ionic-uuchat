import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImgCutterPage } from '../img-cutter/img-cutter';

@Component({
  selector:'cy-mod-avatar-page',
  templateUrl: 'mod-avatar.html'
})
export class ModAvatarPage {

  avatarSrc:string;

  constructor(
    public navCtrl:NavController,
    public navParams:NavParams,
  	public actionSheetCtrl: ActionSheetController
  ) {
    this.avatarSrc = navParams.data['avatarSrc'];

  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.photograph();
          }
        },{
          text: '从手机相册选择',
          handler: () => {
            
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }

  //拍照
  photograph(){
 //  	var that = this;

 //  	console.log(that.img);
 //  	Camera.getPicture().then(
 //  		(imageData) => {
	// 	 	that.img.nativeElement.src=imageData;
	// 	}, (err) => {

	//  	// Handle error
	// 	}
	// );

      let imgSrc = this.avatarSrc;

      this.navCtrl.push(ImgCutterPage, { imgSrc });
  }

}
