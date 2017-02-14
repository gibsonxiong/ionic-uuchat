import { Component,ViewChild } from '@angular/core';
import { App, NavController, NavParams,Content } from 'ionic-angular';
import { MsgService } from '../../services/msg';

import { ReorderPage } from '../reorder/reorder';

@Component({
	selector:'cy-chat-content-page',
  templateUrl: 'chat-content.html',

})
export class ChatContentPage {

	public relationId:string;
  public content:string;

	@ViewChild(Content) contentComponent;

  constructor(
    private appCtrl :App,
    private navCtrl :NavController,
    private params :NavParams,
    private msgService :MsgService
  ) {

  	this.relationId = params.data.relationId;

  }

  ionViewWillEnter() {
     //已读
     this.msgService.readChat(this.relationId);


     this.scrollToBottom();
  }

  ionViewWillLeave(){
      //取消已读
      this.msgService.stopReadChat();
  }

  scrollToBottom(){
  	this.contentComponent.scrollTo(null, this.contentComponent.scrollHeight);
  }

  sendMsg(){
    this.msgService.sendMsg(this.relationId, this.content).subscribe(
       res =>{

       },
       err =>{

       }

    );
  }

  gotoReorderPage(){
      this.navCtrl.push(ReorderPage);
  }



}
