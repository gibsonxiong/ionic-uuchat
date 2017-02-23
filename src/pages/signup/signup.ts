import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { UserService } from '../../services/user';
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
	) {
		this.form = fb.group({
			mobile: ['13686004518',
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
		this.userservice.getVerificationCode(mobile).subscribe(() => {

		});
	}

	//验证短信验证码
	checkVerificationCode() {
		let mobile = this.form.value.mobile;
		let code = this.form.value.code;

		this.userservice.checkVerificationCode(mobile, code).subscribe(
			(res) => {
				// if(res.code) return alert(res.msg);

				// let mobileToken = res.data.mobileToken;
				var mobileToken='1111';
				this.gotoSignupCompletePage(mobileToken);
			},
			err =>{
				alert('手机验证失败');
			}
		);
	}

	gotoSignupCompletePage(mobileToken) {
		this.navCtrl.push(SignupCompletePage, { mobileToken });
	}

}
