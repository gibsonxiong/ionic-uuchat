import { Component, OnInit } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { ChatContentPage } from '../chat-content/chat-content';
import { ChatPopoverPage } from '../chat-popover/chat-popover';
import { FriendAddPage } from '../friend-add/friend-add';
import { FriendListPage } from '../friend-list/friend-list';
import { MsgService } from '../../services/msg';

import { Observable } from 'rxjs';

@Component({
	selector: 'cy-chat-page',
	templateUrl: 'chat.html',
})
export class ChatPage implements OnInit {
	private timer;
	chatList: any[] = [];

	constructor(
		private appCtrl: App,
		private popoverCtrl: PopoverController,
		public msgService: MsgService
	) {

	}

	ngOnInit() {

		this.timer = setInterval(() => {
			this.chatList = this.chatList;
		}, 60000);

		this.msgService.chatList$.subscribe(
			chatList => {
				this.chatList = chatList;
			}
		);

	}

	presentPopover(event) {
		let popover = this.popoverCtrl.create(ChatPopoverPage);

		popover.present({
			ev: event
		});
	}

	ngOnDestroy() {
		clearInterval(this.timer);
	}

	gotoChatContentPage(relationId, chatName): void {
		this.appCtrl.getRootNav().push(
			ChatContentPage,
			{ relationId, chatName }
		);
	}

	gotoFriendAddPage(): void {
		this.appCtrl.getRootNav().push(FriendAddPage);
	}

	// gotoFriendListPage():void{
	//    this.appCtrl.getRootNav().push(FriendListPage);
	// }


}



