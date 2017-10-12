import { Component, ViewChild } from '@angular/core';
import { Headers } from '@angular/http';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Storage } from '@ionic/storage';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';
import 'rxjs/add/operator/toPromise';

import { API_HOST } from '../../config/config';

var fileFactory = {

};

var utils = {
	openAlbum(): Promise<File> {
		return new Promise((resolve, reject) => {
			var fileDOM = document.createElement('input');
			fileDOM.setAttribute('type', 'file');
			document.body.appendChild(fileDOM);

			fileDOM.addEventListener('change', function () {
				resolve(this.files[0]);

				document.body.removeChild(fileDOM);

			}, false);

			fileDOM.click();
		});
	},

	imgDataURL2File(dataURL, fileName, options = {}): Promise<File> {
		return new Promise((resolve, reject) => {

			var imgDOM = new Image();
			var canvasDOM = document.createElement('canvas');
			var ctx = canvasDOM.getContext('2d');

			imgDOM.onload = function () {
				//裁剪
				canvasDOM.width = options['destWidth'] || imgDOM.width;
				canvasDOM.height = options['destHeight'] || imgDOM.height;

				//ctx.drawImage(imgDOM,0,0,null,null); 会出现全透明的情况
				if (options['imgWidth'] && options['imgHeight']) {
					ctx.drawImage(imgDOM, 0, 0, options['imgWidth'], options['imgHeight']);
				} else {
					ctx.drawImage(imgDOM, 0, 0);
				}

				canvasDOM.toBlob(function (blob) {
					var file = new File([blob], fileName);

					resolve(file);
				});

			};
			imgDOM.src = dataURL;
		});
	},

	File2DataURL(file): Promise<string> {
		return new Promise((resolve, reject) => {
			var fr = new FileReader();
			
			fr.onload = function (res) {
				resolve(res.target['result']);
			};

			fr.readAsDataURL(file);

		});
	}

};

@Component({
	selector: 'cy-mod-avatar-page',
	templateUrl: 'mod-avatar.html'
})
export class ModAvatarPage {

	avatarSrc;

	constructor(
		private sanitizer: DomSanitizer,
		private platform: Platform,
		private navCtrl: NavController,
		private navParams: NavParams,
		private storage: Storage,
		private imagePicker: ImagePicker,
		private camera: Camera,
		private crop: Crop,
		private actionSheetCtrl: ActionSheetController,
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {
		// this.avatarSrc = navParams.data['avatarSrc'];

	}

	ngOnInit() {
		this.userService.own$.subscribe(own => {
			this.avatarSrc = own.avatarSrc;
		});
	}


	presentActionSheet() {
		let supportCordova = this.platform.is('cordova');

		var buttons;

		if (supportCordova) {
			buttons = [
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
			];
		} else {
			buttons = [
				{
					text: '从手机相册选择',
					handler: () => {
						this.setByAlbum_html5();

					}
				},
				{
					text: '取消',
					role: 'cancel',
					handler: () => {

					}
				}
			];
		}


		let actionSheet = this.actionSheetCtrl.create({
			buttons: buttons
		});
		actionSheet.present();
	}

	//通过拍照设置头像
	setByPhotograph() {
		let supportCordova = this.platform.is('cordova');

		if (!supportCordova) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

		let loading;
		this.photograph()
			.then((fileURI) => {
				return this.cropImg(fileURI);
			})
			.then(newImagePath => {
				loading = this.systemService.showLoading();
				return this.userService.modAvatar(newImagePath).toPromise();
			})
			.then(res => {
				this.systemService.closeLoading(loading);
				this.avatarSrc = res.data.avatarSrc;
			})
			.catch(err => {
				this.systemService.closeLoading(loading);
				this.myHttp.handleError(err, '设置头像失败')
			});
	}

	//通过手机相册设置头像
	setByAlbum() {
		let supportCordova = this.platform.is('cordova');

		if (!supportCordova) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

		let loading;
		this.openAlbum()
			.then((fileURI) => {
				return this.cropImg(fileURI);
			})
			.then(newImagePath => {
				loading = this.systemService.showLoading();
				return this.userService.modAvatar(newImagePath).toPromise();
			})
			.then(res => {
				this.systemService.closeLoading(loading);
				this.avatarSrc = res['data'].avatarSrc;
			})
			.catch(err => this.myHttp.handleError(err, '设置头像失败'));

	}

	setByAlbum_html5() {
		var that = this;

		utils.openAlbum()
		.then((file)=>{
			return Promise.all([utils.File2DataURL(file),file]);
		})
		.then((values)=>{
			let dataURL = values[0];
			let file = values[1];
			// return utils.imgDataURL2File(dataURL, file.name, { destWidth: 100, destHeight: 100 })
			return utils.imgDataURL2File(dataURL, file.name)
		})
		.then(function (_file) {
			that.userService.modAvatar2(_file)
				.subscribe(
				res => {}
				);
		});
	}

	//拍照
	photograph(): Promise<string> {
		var options = {
			allowEdit: true,
			targetWidth: 400,
			targetHeight: 400,
		};

		return this.camera.getPicture(options);
	}

	//打开手机相册
	openAlbum(): Promise<string> {

		var options = {
			maximumImagesCount: 1
		};
		return this.imagePicker.getPictures(options).then(val => {
			return val[0];
		})
	}

	//裁剪图片
	cropImg(fileURI): Promise<string> {
		return this.crop.crop(fileURI, { quality: 100 });
	}


}
