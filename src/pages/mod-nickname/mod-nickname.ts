import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

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
		private systemService: SystemService
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

		this.userService.modNickname(nickname).subscribe(
			res => {
				this.navCtrl.pop();
			},
			err => this.systemService.handleError(err, '修改失败')

		);
	}
}
