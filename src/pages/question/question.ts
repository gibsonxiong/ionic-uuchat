import { Component } from '@angular/core';
import { AlertController,NavController,App} from 'ionic-angular';
import { ChatPage } from '../chat/chat';


@Component({
  selector:'cy-question-page',
  templateUrl: 'question.html'
})
export class QuestionPage {

  constructor(public alertCtrl:AlertController,public navCtrl:NavController) {
    
  }

  alert(){
  	let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['OK']
    });
    alert.present();
  }


}
