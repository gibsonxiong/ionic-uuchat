import { Component, ViewChild } from '@angular/core';
import { Headers } from '@angular/http';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagePicker } from 'ionic-native';
import { FileChooser } from 'ionic-native';
import { Camera } from 'ionic-native';
import { Crop } from 'ionic-native';
import { Transfer } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';
import 'rxjs/add/operator/toPromise';

import {API_HOST} from '../../config';

@Component({
	selector: 'cy-mod-avatar-page',
	templateUrl: 'mod-avatar.html'
})
export class ModAvatarPage {

	avatarSrc;

	@ViewChild('file') file;

	constructor(
		private sanitizer: DomSanitizer,
		private platform:Platform,
		private navCtrl: NavController,
		private navParams: NavParams,
		private storage: Storage,
		private actionSheetCtrl: ActionSheetController,
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
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
		let support = this.platform.is('cordova');

		if (!support) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

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
			.catch(err => this.myHttp.handleError(err, '设置头像失败'));
	}

	//通过手机相册设置头像
	setByAlbum() {
		// let support = this.platform.is('cordova');
		
		// if (!support) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

		// let loading;
		// this.openAlbum()
		// 	.then((uri) => {
		// 		return this.cropImg(uri);
		// 	})
		// 	.then(newImagePath => {
		// 		loading = this.systemService.showLoading();
		// 		return this.userService.modAvatar(newImagePath).toPromise();
		// 	})
		// 	.then(res => {
		// 		this.systemService.closeLoading(loading);
		// 		this.avatarSrc = res['data'].avatarSrc;
		// 	})
		// 	.catch(err => this.myHttp.handleError(err, '设置头像失败'));

		var that = this;

		var fileDOM = document.createElement('input');
		fileDOM.setAttribute('type','file');
		document.body.appendChild(fileDOM);

		fileDOM.addEventListener('change',function(){
			var file = this.files[0];
			var fr = new FileReader();

			fr.readAsDataURL(file);

			fr.onload = function(res){

				var dataURL = res.target['result'];

				var imgDOM = new Image();
				var canvasDOM = document.createElement('canvas');
				var ctx = canvasDOM.getContext('2d');

				imgDOM.onload = function(){

					ctx.drawImage(imgDOM,0,0,100,100);
	
					canvasDOM.toBlob(function(blob){
						var newFile = new File([blob],file.name);
	
						var formData = new FormData();
	
						formData.append('file',newFile);
				
						that.myHttp.post(API_HOST + '/user/modAvatar',formData)
							.subscribe(
								res=>{
									// that.avatarSrc = that.sanitizer.bypassSecurityTrustUrl(res['data'].avatarSrc);
									that.avatarSrc = res['data'].avatarSrc;
								}
							);
					});

				};
				imgDOM.src = dataURL;
			};

			
		},false);

		fileDOM.click();

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
