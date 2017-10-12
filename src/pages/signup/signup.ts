import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, NavController, ActionSheetController } from 'ionic-angular';

import { SystemService } from '../../services/system';

import { UserService } from '../../services/user';
import { UserValidator } from '../../validators/user';
import { patterns } from '../../patterns';

import { MyHttp } from '../../providers/my-http';

// declare var cordova: any;

@Component({
	selector: 'cy-signup-page',
	templateUrl: 'signup.html'
})
export class SignupPage {
	private form: FormGroup;

	private avatarSrc;

	constructor(
		private sanitizer: DomSanitizer,
		private navCtrl: NavController,
		private navParams: NavParams,
		private actionSheetCtrl: ActionSheetController,
		private userservice: UserService,
		private fb: FormBuilder,
		private userService: UserService,
		private userValidator: UserValidator,
		private systemService: SystemService,
		private myHttp:MyHttp

	) {
		let mobileToken = navParams.data['mobileToken'];

		this.form = fb.group({
			mobileToken: mobileToken,
			username: ['',
				[
					Validators.required,
				],
				this.userValidator.existsByUsernameAsync()
			],
			password: '',
		});
	}

	signup() {
		var formData = this.form.value;

		var obser = this.userService.signup1(formData.mobileToken, formData.username, formData.password);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.systemService.showToast('注册成功');

				setTimeout(() => {
					this.navCtrl.popToRoot();
				}, 2000);

			},
			err => this.myHttp.handleError(err, '注册失败')
		);
	}

}
