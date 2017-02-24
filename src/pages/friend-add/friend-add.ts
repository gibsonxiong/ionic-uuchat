import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserDetailPage } from '../user-detail/user-detail';
import { FriendByContactPage } from '../friend-by-contact/friend-by-contact';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

@Component({
	selector: 'cy-friend-add-page',
	templateUrl: 'friend-add.html'
})
export class FriendAddPage {

	search: string;

	constructor(
		private navCtrl: NavController,
		private userService: UserService,
		private systemService: SystemService,
	) { }

	submitForm() {


		this.userService.searchUser(this.search).subscribe(
			res => {
				if (res.data.length == 0) {
					return this.systemService.showToast('没有找到该用户！');
				}

				let userId = res.data[0]._id;
				this.gotoUserDetailPage(userId);
			},
			err => this.systemService.handleError(err, '查找用户失败')
		);
	}

	gotoFriendByContactPage() {
		this.navCtrl.push(FriendByContactPage);
	}

	gotoUserDetailPage(userId): void {
		this.navCtrl.push(UserDetailPage, { userId });
	}

}
