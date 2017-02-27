import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { FriendAddPage } from '../friend-add/friend-add';

@Component({
	selector: 'cy-chat-popover-page',
	templateUrl: 'chat-popover.html'
})
export class ChatPopoverPage {

	constructor(
		private viewCtrl: ViewController,
		private navCtrl: NavController,
	) { }

	close() {
		this.viewCtrl.dismiss();
	}

	gotoFriendAddPage(){
		this.navCtrl.push(FriendAddPage);
		this.viewCtrl.dismiss();
	}

	// gotoFriendAddPage(){
	// 	this.navCtrl.push(FriendAddPage);
	// 	this.viewCtrl.dismiss();
	// }

}
