import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, NavController, ActionSheetController } from 'ionic-angular';
import { Camera, Crop, ImagePicker } from 'ionic-native';
import { SystemService } from '../../services/system';

import { SigninPage } from '../signin/signin';
import { UserService } from '../../services/user';
import { UserValidator } from '../../validators/user';

import { File as CordovaFile, FileEntry } from 'ionic-native';

declare var cordova: any;

@Component({
	selector: 'cy-signup-complete-page',
	templateUrl: 'signup-complete.html'
})
export class SignupCompletePage {
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

	) {
		let mobileToken = navParams.data['mobileToken'];

		this.form = fb.group({
			avatar: [[]],
			mobileToken: mobileToken,
			username: ['test5', Validators.required, this.userValidator.existsByUsernameAsync()],
			password: '123456',
			nickname: 'gigi',
			gender: 0,
			motto: 'Hi',
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
		var postData = this.form.value;
		//上传文件
		var formData = new FormData();

		formData.append("avatar", postData.avatar[0], 'avatar.png');
		formData.append("mobileToken", postData.mobileToken);
		formData.append("username", postData.username);
		formData.append("password", postData.password);
		formData.append("nickname", postData.nickname);
		formData.append("gender", postData.gender);
		formData.append("motto", postData.motto);

		var obser = this.userService.signup(formData);
		obser = this.systemService.linkLoading(obser);



		obser.subscribe(
			res => {
				this.systemService.createToast('注册成功');

				setTimeout(() => {
					this.navCtrl.popToRoot();
				}, 2000);

			},
			err => this.systemService.handleError(err, '注册失败')
		);
	}

	fileInputChange(e) {
		var that = this;
		let file = e.target.files[0];

		this.form.controls['avatar'].setValue(file);

		//显示头像
		var reader = new FileReader();
		reader.onload = function () {
			that.avatarSrc = this.result;
		}
		reader.readAsDataURL(file);
	}

	// //设置头像
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
				return CordovaFile.resolveLocalFilesystemUrl(newImagePath)
			})
			.then((fileEntry: FileEntry) => {
				return new Promise<CordovaFile>((resolve, reject) => {
					fileEntry.file(
						file => {
							resolve(file);
						},
						err => {
							reject(err);
						}
					);
				});
			})
			.then((file: CordovaFile) => {
				var reader = new FileReader();
				reader.onloadend = (e) => {
					var Html5File = new Blob([e.target['result']], { type: 'image/png' });
					Html5File['name'] = 'avatar.png';
					this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
					this.form.controls['avatar'].setValue([Html5File, Html5File]);
				};
				reader.readAsArrayBuffer(file as Blob);
			})
			.catch((err) => this.systemService.handleError(err, '设置头像失败'));
	}

	//通过手机相册设置头像
	setByAlbum() {
		this.openAlbum()
			.then((uri) => {
				return this.cropImg(uri);
			})
			.then(newImagePath => {
				return CordovaFile.resolveLocalFilesystemUrl(newImagePath)
			})
			.then((fileEntry: FileEntry) => {
				return new Promise<CordovaFile>((resolve, reject) => {
					fileEntry.file(
						file => {
							resolve(file);
						},
						err => {
							reject(err);
						}
					);
				});
			})
			.then((file: CordovaFile) => {
				var reader = new FileReader();
				reader.onloadend = (e) => {
					var Html5File = new Blob([e.target['result']], { type: 'image/png' });
					Html5File['name'] = 'avatar.png';
					this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
					this.form.controls['avatar'].setValue([Html5File, Html5File]);
				};
				reader.readAsArrayBuffer(file as Blob);
			})
			.catch((err) => this.systemService.handleError(err, '设置头像失败'));
	}

	//拍照
	photograph() {
		var options = {
			allowEdit: false,
			targetWidth: 350,
			targetHeight: 350,
		};

		return Camera.getPicture(options);
	}

	cropImg(uri) {
		return Crop.crop(uri, { quality: 100 });
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
