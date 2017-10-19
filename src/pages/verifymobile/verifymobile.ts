import { Component, Renderer, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from 'ionic-angular';

import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { MyHttp } from '../../providers/my-http';
import { getErrorMsgByFormControl, getErrorMsgByFormGroup, myValidators } from '../../validators/index';

import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';

@Component({
	selector: 'cy-verifymobile-page',
	templateUrl: 'verifymobile.html'
})
export class VerifyMobilePage {

	private form: FormGroup;

	private timer;
	private disableButton = false;
	private buttonName = '获取验证码';
	private countdown = 60;

	private formLabelMap = {
		mobile: '手机号',
		code: '验证码'
	}

	@ViewChild('codeInput') codeInput;

	constructor(
		private navCtrl: NavController,
		private renderer: Renderer,
		private userservice: UserService,
		private fb: FormBuilder,
		private systemService: SystemService,
		private myHttp: MyHttp,
		private alertCtrl: AlertController
	) {
		this.form = fb.group({
			mobile: ['',
				[
					Validators.required,
					myValidators.mobile
				]
			],
			code: ['',
				[
					Validators.required,
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

		if (this.form.controls['mobile'].invalid) {
			var msg = getErrorMsgByFormControl(this.form.controls['mobile'], this.formLabelMap['mobile']);
			this.systemService.showToast(msg);
			return;
		}


		//获取验证码
		let mobile = this.form.value.mobile;
		this.userservice.getVerificationCode(mobile).subscribe(
			res => {
				this._countdown();

				this.codeInput.setFocus();
				
				this.systemService.showToast(res.msg);
			},
			err => this.myHttp.handleError(err, '发送短信失败')
		);
	}

	//验证短信验证码
	checkVerificationCode() {
		if (this.form.invalid) {
			var msg = getErrorMsgByFormGroup(this.form, this.formLabelMap);
			this.systemService.showToast(msg);
			return;
		}

		let mobile = this.form.value.mobile;
		let code = this.form.value.code;

		var obser = this.userservice.checkVerificationCode(mobile, code);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				//手机号已经注册
				if (res.code === 1) {
					let confirm = this.alertCtrl.create({
						title: '该手机号码已经注册过',
						message: '该手机号码已经注册过，如果是你的号码，你可以直接登录。',
						buttons: [
							{
								text: '重新输入',
								handler: () => {
									this.form.reset();
									this.countdown = 0;
								}
							},
							{
								text: '去登录',
								handler: () => {
									this.navCtrl.setRoot(LoginPage, { username: mobile });
								}
							}
						]
					});
					confirm.present();
					return;
				}
				let mobileToken = res.data.mobileToken;
				this.gotoSignupPage(mobileToken);
			},
			err => this.myHttp.handleError(err, '手机验证失败')
		);
	}

	gotoSignupPage(mobileToken) {
		this.navCtrl.push(SignupPage, { mobileToken });
	}

}
