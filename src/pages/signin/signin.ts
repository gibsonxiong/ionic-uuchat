import { Component } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/core';      //动画
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup';
import { IndexPage } from '../index/index';
import { UserService } from '../../services/user';

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
	) {

		this.form = builder.group({
			username: ['test1', null, UserValidators.existsAsync()],
			password: ['123456', [Validators.required, Validators.minLength(2)]]
		});

	}

	//登录
	signin(data): void {

		this.userservice.signin(this.form.value).subscribe(
			res => {
				if (res.code) {
					this.presentToast(res.msg);
					return;
				}
				let token = res.data.token;
				console.log('signin', token);

				this.storage.set('token', token)
					.then(token => {
						this.navCtrl.setRoot(IndexPage);
					})
					.catch(err => {
						alert('登录失败！');
					});

			},
			err => {
				this.presentToast(err);
			}
		);
	}

	presentToast(msg): void {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}


	gotoSignupPage(): void {
		this.navCtrl.push(SignupPage);
	}

}

/*UserValidator*/
class UserValidators {

	static existsAsync() {

		return function (contorl): Promise<{ [key: string]: any }> {
			return new Promise((resole, reject) => {
				setTimeout(() => {
					if (contorl.value === 'false') {
						resole({ existsAsync: true });
					} else {
						resole(null);
					}

				}, 500);
			});
		}

	}
}
