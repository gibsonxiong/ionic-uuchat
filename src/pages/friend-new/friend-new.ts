import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';


@Component({
	selector: 'cy-friend-new-page',
	templateUrl: 'friend-new.html'
})
export class FriendNewPage implements OnInit {

	list: any[];

	constructor(
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) { }

	ngOnInit() {

		this.userService.getFriendNewList().subscribe(
			res => {
				this.list = res.data;
			},
			err => this.myHttp.handleError('查找好友申请列表失败')
		);

	}

	confirmFriend(userId) {

		this.userService.confirmFriend(userId).subscribe(
			res => {
				this.list.forEach(item => {
					if (item.fromUserId === userId) {
						item.confirm = true;
						return false;
					}
				});

				//刷新朋友列表
				this.userService.getRelationList();

			},
			err => this.myHttp.handleError('添加失败')
		);
	}


}
