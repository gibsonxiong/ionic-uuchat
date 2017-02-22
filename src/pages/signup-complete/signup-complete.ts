import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ActionSheetController } from 'ionic-angular';
import { Camera, Crop, ImagePicker } from 'ionic-native';

import { UserService } from '../../services/user';


@Component({
	selector: 'cy-signup-complete-page',
	templateUrl: 'signup-complete.html'
})
export class SignupCompletePage {
	private form: FormGroup;

	private avatarSrc = 'assets/img/default-avatar.jpg';

	constructor(
		private navParams: NavParams,
		private actionSheetCtrl: ActionSheetController,
		private userservice: UserService,
		private fb: FormBuilder,
		private userService: UserService
	) {
		let mobileToken = navParams.data['mobileToken'];

		this.form = fb.group({
			mobileToken: mobileToken,
			username: '',
			password: '',
			nickname: '',
			gender: 0,
			motto: '',
		});
	}

	selectGender(event) {
		event.preventDefault();
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: '男',
					handler: () => {
						this.form.controls['gender'].setValue(0);
					}
				}, {
					text: '女',
					handler: () => {
						this.form.controls['gender'].setValue(1);
					}
				}
			]
		});
		actionSheet.present();
	}

	signup() {

	}

	//设置头像
	presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: '拍照',
					handler: () => {
						this.setByPhotograph();
					}
				}, {
					text: '从手机相册选择',
					handler: () => {
						this.setByAlbum();

					}
				}, {
					text: '取消',
					role: 'cancel',
					handler: () => {

					}
				}
			]
		});
		actionSheet.present();
	}

	//通过拍照设置头像
	setByPhotograph() {
		this.photograph()
			.then((imageData) => {
				return this.cropImg(imageData);
			})
			.then(newImagePath => {
				this.avatarSrc = newImagePath;
			})
			.catch((err) => {
				console.log('拍照失败！', err);
			});
	}

	//通过手机相册设置头像
	setByAlbum() {
		this.openAlbum()
			.then((uri) => {
				return this.cropImg(uri);
			})
			.then(newImagePath => {
				console.log(newImagePath)
				this.avatarSrc = newImagePath;
			})
			.catch((err) => {
				console.log('访问手机相册失败！', err);
			});
	}

	//拍照
	photograph() {
		var options = {
			allowEdit: false,
			targetWidth: 400,
			targetHeight: 400,
		};

		return Camera.getPicture(options);
	}

	cropImg(uri) {
		return Crop.crop(uri, { quality: 75 });
	}


	openAlbum(): Promise<string> {
		//打开手机相册
		var options = {
			maximumImagesCount: 1
		};
		return ImagePicker.getPictures(options).then(res => {
			return res[0];
		})
	}


}
