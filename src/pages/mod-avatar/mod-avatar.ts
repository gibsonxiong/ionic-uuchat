import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { ImagePicker } from 'ionic-native';
import { FileChooser } from 'ionic-native';
import { Camera } from 'ionic-native';
import { Crop } from 'ionic-native';
import { Transfer } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { HOST } from '../../config';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import 'rxjs/add/operator/toPromise';


@Component({
	selector: 'cy-mod-avatar-page',
	templateUrl: 'mod-avatar.html'
})
export class ModAvatarPage {

	avatarSrc: string;

	@ViewChild('file') file;

	constructor(
		private platform:Platform,
		private navCtrl: NavController,
		private navParams: NavParams,
		private storage: Storage,
		private actionSheetCtrl: ActionSheetController,
		private userService: UserService,
		private systemService: SystemService
	) {
		this.avatarSrc = navParams.data['avatarSrc'];

	}


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
		let nonsupport = this.platform.is('mobileweb');

		if (nonsupport) return this.systemService.showToast('扫一扫暂不支持浏览器，请下载APP体验');

		let loading;
		this.photograph()
			.then((imageData) => {
				return this.cropImg(imageData);
			})
			.then(newImagePath => {
				loading = this.systemService.showLoading();
				return this.userService.modAvatar(newImagePath).toPromise();
			})
			.then(res => {
				this.systemService.closeLoading(loading);
				this.avatarSrc = res.data.avatarSrc;
			})
			.catch(err => this.systemService.handleError(err, '设置头像失败'));
	}

	//通过手机相册设置头像
	setByAlbum() {
		let loading;
		this.openAlbum()
			.then((uri) => {
				return this.cropImg(uri);
			})
			.then(newImagePath => {
				loading = this.systemService.showLoading();
				return this.userService.modAvatar(newImagePath).toPromise();
			})
			.then(res => {
				this.systemService.closeLoading(loading);
				this.avatarSrc = res['data'].avatarSrc;
			})
			.catch(err => this.systemService.handleError(err, '设置头像失败'));
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

	//裁剪图片
	cropImg(uri) {
		return Crop.crop(uri, { quality: 100 });
	}

	//打开手机相册
	openAlbum(): Promise<string> {

		var options = {
			maximumImagesCount: 1
		};
		return ImagePicker.getPictures(options).then(val => {
			return val[0];
		})
	}




}
