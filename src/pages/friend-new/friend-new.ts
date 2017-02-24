import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';


@Component({
	selector: 'cy-friend-new-page',
	templateUrl: 'friend-new.html'
})
export class FriendNewPage implements OnInit {

	list: any[] = [];

	constructor(
		private userService: UserService,
		private systemService: SystemService
	) { }

	ngOnInit() {

		this.userService.getFriendNewList().subscribe(
			res => {
				this.list = res.data;
			},
			err => this.systemService.handleError('查找好友申请列表失败')
		);

	}

	confirmFriend(userId) {

		this.userService.confirmFriend(userId).subscribe(
			res => {
				var i = this.list.forEach(item => {
					if (item.fromUserId === userId) {
						item.confirm = true;
						return false;
					}
				});

			},
			err => this.systemService.handleError('添加失败')
		);
	}


}
