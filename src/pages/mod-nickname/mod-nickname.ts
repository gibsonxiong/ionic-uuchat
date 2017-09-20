import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';

@Component({
	selector: 'cy-mod-nickname-page',
	templateUrl: 'mod-nickname.html'
})
export class ModNicknamePage implements OnInit {

	form: FormGroup;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private builder: FormBuilder,
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {

		let nickname = navParams.data['nickname'];

		this.form = builder.group({
			nickname: nickname
		});


	}

	ngOnInit() {


	}


	//提交
	submit() {
		let nickname = this.form.value.nickname;
		let obser = this.userService.modNickname(nickname);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.navCtrl.pop();
			},
			err => this.myHttp.handleError(err, '修改失败')

		);
	}
}
