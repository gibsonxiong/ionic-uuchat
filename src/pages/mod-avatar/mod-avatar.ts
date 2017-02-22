import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImagePicker } from 'ionic-native';
import { FileChooser } from 'ionic-native';
import { Camera } from 'ionic-native';
import { Crop } from 'ionic-native';
import { Transfer } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { HOST } from '../../config';
import { UserService } from '../../services/user';


@Component({
	selector: 'cy-mod-avatar-page',
	templateUrl: 'mod-avatar.html'
})
export class ModAvatarPage {

	avatarSrc: string;

	@ViewChild('file') file;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: Storage,
		public actionSheetCtrl: ActionSheetController,
		private userService: UserService
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
		this.photograph()
			.then((imageData) => {
				return this.cropImg(imageData);
			})
			.then(newImagePath => {
				return this.userService.modAvatar(newImagePath);
			})
			.then(res => {
				if (res.code) throw new Error('上传头像失败！');

				this.avatarSrc = res.data.avatarSrc;
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
				return this.userService.modAvatar(newImagePath);
			})
			.then(res => {
				if (res.code) throw new Error('上传头像失败！');

				this.avatarSrc = res.data.avatarSrc;
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


	// openAlbum(): Promise<string> {
	// 	//打开手机相册
	// 	return FileChooser.open();
	// }

	openAlbum(): Promise<string> {
		//打开手机相册
		var options ={
			maximumImagesCount:1
		};
		return ImagePicker.getPictures(options).then(res=>{
			// console.log(JSON.stringify(res));
			return res[0];
		})
	}




}
