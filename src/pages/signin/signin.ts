import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/core';      //动画
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { Storage } from '@ionic/storage';

import { IndexPage } from '../index/index';
import { SignupPage } from '../signup/signup';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { UserValidator } from '../../validators/user';

import { MyHttp } from '../../providers/my-http';

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
	private signining = false;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private toastCtrl: ToastController,
		private builder: FormBuilder,
		private storage: Storage,
		private userservice: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {


	}

	ngOnInit() {


		this.form = this.builder.group({
			username: ['',
				[
					Validators.required,
				],
			],
			password: ['',
				[
					Validators.required,
				]
			]
		});

		//注册页传来的username
		var username = this.navParams.data['username'];
		if( username){
			this.form.controls['username'].setValue(username);
		}else{
			//获取上次登录的用户名
			this.storage.get('latestUsername').then(value => {
				if (value) {
					this.form.controls['username'].setValue(value);
				}
			});
		}
	}

	//登录
	signin(): void {

		if(this.form.invalid){
			return ;
		}

		this.signining = true;
		var obser = this.userservice.signin(this.form.value);

		obser
			.mergeMap((res) => {
				//本地保存token
				let token = res.data.token;
				let ownId = res.data.ownId;

				return this.saveToken(token, ownId);
			})
			.do(
				() => {
					this.signining = false;
				},
				() => {
					this.signining = false;
				}
			)
			.subscribe(
			() => {
				//保存登录名，下次登录返显处来
				this.storage.set('latestUsername',this.form.value.username);
				this.navCtrl.setRoot(IndexPage);
			},
			err => this.myHttp.handleError(err, '登录失败'),
			);
	}



	gotoSignupPage(): void {
		this.navCtrl.push(SignupPage);
	}

	_$testSignin(n) {
		this.form.setValue({
			username: 'test' + n,
			password: 123456
		});

		this.signin();
	}

	private saveToken(token: any, ownId: any) {
		let p1 = this.storage.set('token', token);
		let p2 = this.storage.set('ownId', ownId);
		let pAll = Promise.all([p1, p2]);
		return Observable.fromPromise(pAll);
	}
}


