import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { SignupCompletePage } from '../signup-complete/signup-complete';

@Component({
	selector: 'cy-signup-page',
	templateUrl: 'signup.html'
})
export class SignupPage {
	private form: FormGroup;

	private timer;
	private disableButton = false;
	private buttonName = '获取验证码';
	private countdown = 60;

	constructor(
		private navCtrl: NavController,
		private userservice: UserService,
		private fb: FormBuilder,
		private systemService: SystemService,
	) {
		this.form = fb.group({
			mobile: ['',
				[
					Validators.required,
					Validators.pattern(/^1[3|4|5|8]\d{9}$/)
				]
			],
			code: ['',
				[
					Validators.required,
					Validators.pattern(/^\d{6}$/)
				]
			]
		})
	}

	_countdown() {
		if (this.countdown === 0) {
			this.disableButton = false;
			this.buttonName = '获取验证码';
			this.countdown = 60;

			clearInterval(this.timer);
		} else {
			this.disableButton = true;
			this.countdown--;
			this.buttonName = `获取验证码(${this.countdown})`;

			this.timer = setTimeout(() => {
				this._countdown();
			}, 1000);
		}
	}

	//获取短信验证码
	getVerificationCode(e) {
		e.preventDefault();

		this._countdown();

		//获取验证码
		let mobile = this.form.value.mobile;
		this.userservice.getVerificationCode(mobile).subscribe(
			res => {
				this.systemService.showToast(res.msg);
			},
			err => this.systemService.handleError(err, '发送短信失败')
		);
	}

	//验证短信验证码
	checkVerificationCode() {
		let mobile = this.form.value.mobile;
		let code = this.form.value.code;

		var obser = this.userservice.checkVerificationCode(mobile, code);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				let mobileToken = res.data.mobileToken;
				this.gotoSignupCompletePage(mobileToken);
			},
			err => this.systemService.handleError(err, '手机验证失败')
		);
	}

	gotoSignupCompletePage(mobileToken) {
		this.navCtrl.push(SignupCompletePage, { mobileToken });
	}

}
