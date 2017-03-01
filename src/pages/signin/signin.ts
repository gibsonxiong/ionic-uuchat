import { Component } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/core';      //动画
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Storage } from '@ionic/storage';

import { IndexPage } from '../index/index';
import { SignupPage } from '../signup/signup';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { UserValidator } from '../../validators/user';

@Component({
	selector: 'cy-signin-page',
	templateUrl: 'signin.html',
	// animations: [
	// 	trigger('flyInOut', [
	// 		state('in', style({ width: '*', transform: 'translateX(0)', opacity: 1 })),
	// 		transition('void => *', [
	// 			style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
	// 			group([
	// 				animate('0.3s 0.1s ease', style({
	// 					transform: 'translateX(0)',
	// 					width: '*'
	// 				})),
	// 				animate('0.3s ease', style({
	// 					opacity: 1
	// 				}))
	// 			])
	// 		]),
	// 		transition('* => void', [
	// 			group([
	// 				animate('0.3s ease', style({
	// 					transform: 'translateX(50px)',
	// 					width: 10
	// 				})),
	// 				animate('0.3s 0.2s ease', style({
	// 					opacity: 0
	// 				}))
	// 			])
	// 		])
	// 	])
	// ]
})
export class SigninPage {
	public form: FormGroup;
	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		public builder: FormBuilder,
		public storage: Storage,
		public userservice: UserService,
		private systemService: SystemService,
	) {
		this.form = builder.group({
			username: ['', null, UserValidator.existsAsync()],
			password: ['', [Validators.required, Validators.minLength(2)]]
		});

	}

	//登录
	signin(data): void {
		var obser = this.userservice.signin(this.form.value);
		obser = this.systemService.linkLoading(obser, '登录中');

		obser
			.mergeMap((res) => {
				//本地保存token
				let token = res.data.token;
				let ownId = res.data.ownId;
				let p1 = this.storage.set('token', token);
				let p2 = this.storage.set('ownId', ownId);
				let pAll = Promise.all([p1, p2]);

				return Observable.fromPromise(pAll);
			})
			.subscribe(
			() => {
				this.navCtrl.setRoot(IndexPage);
			},
			err => this.systemService.handleError(err, '登录失败')
			);
	}



	gotoSignupPage(): void {
		this.navCtrl.push(SignupPage);
	}

}


