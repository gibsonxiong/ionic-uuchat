import { Component, OnInit } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { FriendAddPage } from '../friend-add/friend-add';
import { FriendNewPage } from '../friend-new/friend-new';
import { UserDetailPage } from '../user-detail/user-detail';
import { UserService } from '../../services/user';

@Component({
	selector: 'cy-friend-list-page',
	templateUrl: 'friend-list.html'
})
export class FriendListPage implements OnInit {
	list: any[] = [];

	private friendListSubscription;

	constructor(
		private app: App,
		private navCtrl: NavController,
		private userService: UserService
	) { }


	ngOnInit() {
		this.friendListSubscription = this.userService.friendList$.subscribe(
			friendList => {
				this.list = friendList;
			}
		);
	}

	ngOnDestroy(){
		this.friendListSubscription.unsubscribe();
	}

	gotoUserDetailPage(userId) {
		this.app.getRootNav().push(UserDetailPage, { userId: userId });
	}

	gotoFriendAddPage() {
		this.app.getRootNav().push(FriendAddPage);
	}

	gotoFriendNewPage() {
		this.app.getRootNav().push(FriendNewPage);
	}
}
