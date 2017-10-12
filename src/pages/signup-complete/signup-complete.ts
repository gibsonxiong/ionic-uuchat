// import { Component } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NavParams, NavController, ActionSheetController, Platform } from 'ionic-angular';

// import { ImagePicker } from '@ionic-native/image-picker';
// import { Camera } from '@ionic-native/camera';
// import { Crop } from '@ionic-native/crop';

// import { SystemService } from '../../services/system';

// import { UserService } from '../../services/user';
// import { UserValidator } from '../../validators/user';
// import { patterns } from '../../patterns';

// import { MyHttp } from '../../providers/my-http';

// // declare var cordova: any;

// @Component({
// 	selector: 'cy-signup-complete-page',
// 	templateUrl: 'signup-complete.html'
// })
// export class SignupCompletePage {
	
// 	private form: FormGroup;

// 	private avatarSrc;

// 	constructor(
// 		private sanitizer: DomSanitizer,
// 		private navCtrl: NavController,
// 		private navParams: NavParams,
// 		private imagePicker: ImagePicker,
// 		private platform:Platform,
// 		private camera: Camera,
// 		private crop: Crop,
// 		private actionSheetCtrl: ActionSheetController,
// 		private userservice: UserService,
// 		private fb: FormBuilder,
// 		private userService: UserService,
// 		private userValidator: UserValidator,
// 		private systemService: SystemService,
// 		private myHttp:MyHttp

// 	) {
// 		let mobileToken = navParams.data['mobileToken'];

// 		this.form = fb.group({
// 			avatar: [[]],
// 			mobileToken: mobileToken,
// 			username: ['',
// 				[
// 					Validators.required,
// 					// Validators.pattern(patterns.username)
// 				],
// 				this.userValidator.existsByUsernameAsync()],
// 			password: '',
// 			nickname: '',
// 			gender: 0,
// 			motto: '',
// 		});
// 	}

// 	selectGender(event) {
// 		event.preventDefault();
// 		let actionSheet = this.actionSheetCtrl.create({
// 			buttons: [
// 				{
// 					text: '男',
// 					handler: () => {
// 						this.form.controls['gender'].setValue(0);
// 					}
// 				}, {
// 					text: '女',
// 					handler: () => {
// 						this.form.controls['gender'].setValue(1);
// 					}
// 				}
// 			]
// 		});
// 		actionSheet.present();
// 	}

// 	signup() {
// 		var postData = this.form.value;
// 		//上传文件
// 		var formData = new FormData();

// 		formData.append("avatar", postData.avatar[0], 'avatar.png');
// 		formData.append("nickname", postData.nickname);
// 		formData.append("gender", postData.gender);
// 		formData.append("motto", postData.motto);

// 		var obser = this.userService.signup(formData);
// 		obser = this.systemService.linkLoading(obser);

// 		obser.subscribe(
// 			res => {
// 				this.systemService.createToast('注册成功');

// 				setTimeout(() => {
// 					this.navCtrl.popToRoot();
// 				}, 2000);

// 			},
// 			err => this.myHttp.handleError(err, '注册失败')
// 		);
// 	}

// 	// 设置头像
// 	presentActionSheet() {
// 		let actionSheet = this.actionSheetCtrl.create({
// 			buttons: [
// 				{
// 					text: '拍照',
// 					handler: () => {
// 						this.setByPhotograph();
// 					}
// 				}, {
// 					text: '从手机相册选择',
// 					handler: () => {
// 						this.setByAlbum();

// 					}
// 				}, {
// 					text: '取消',
// 					role: 'cancel',
// 					handler: () => {

// 					}
// 				}
// 			]
// 		});
// 		actionSheet.present();
// 	}

// 	//通过拍照设置头像
// 	setByPhotograph() {

// 		// this.photograph()
// 		// 	.then((imageData) => {
// 		// 		return this.cropImg(imageData);
// 		// 	})
// 		// 	.then(newImagePath => {
// 		// 		return this.file.resolveLocalFilesystemUrl(newImagePath)
// 		// 	})
// 		// 	.then((fileEntry: FileEntry) => {
// 		// 		return new Promise<CordovaFile>((resolve, reject) => {
// 		// 			fileEntry.file(
// 		// 				file => {
// 		// 					resolve(file);
// 		// 				},
// 		// 				err => {
// 		// 					reject(err);
// 		// 				}
// 		// 			);
// 		// 		});
// 		// 	})
// 		// 	.then((file: CordovaFile) => {
// 		// 		var reader = new FileReader();
// 		// 		reader.onloadend = (e) => {
// 		// 			var Html5File = new Blob([e.target['result']], { type: 'image/png' });
// 		// 			Html5File['name'] = 'avatar.png';
// 		// 			this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
// 		// 			this.form.controls['avatar'].setValue([Html5File, Html5File]);
// 		// 		};
// 		// 		reader.readAsArrayBuffer(file as Blob);
// 		// 	})
// 		// 	.catch((err) => this.myHttp.handleError(err, '设置头像失败'));
// 	}

// 	//通过手机相册设置头像
// 	setByAlbum() {
// 		// this.openAlbum()
// 		// 	.then((uri) => {
// 		// 		return this.cropImg(uri);
// 		// 	})
// 		// 	.then(newImagePath => {
// 		// 		return CordovaFile.resolveLocalFilesystemUrl(newImagePath)
// 		// 	})
// 		// 	.then((fileEntry: FileEntry) => {
// 		// 		return new Promise<CordovaFile>((resolve, reject) => {
// 		// 			fileEntry.file(
// 		// 				file => {
// 		// 					resolve(file);
// 		// 				},
// 		// 				err => {
// 		// 					reject(err);
// 		// 				}
// 		// 			);
// 		// 		});
// 		// 	})
// 		// 	.then((file: CordovaFile) => {
// 		// 		var reader = new FileReader();
// 		// 		reader.onloadend = (e) => {
// 		// 			var Html5File = new Blob([e.target['result']], { type: 'image/png' });
// 		// 			Html5File['name'] = 'avatar.png';
// 		// 			this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
// 		// 			this.form.controls['avatar'].setValue([Html5File, Html5File]);
// 		// 		};
// 		// 		reader.readAsArrayBuffer(<Blob>file);
// 		// 	})
// 		// 	.catch((err) => this.myHttp.handleError(err, '设置头像失败'));
// 	}

// 	// presentActionSheet() {
// 	// 	let supportCordova = this.platform.is('cordova');

// 	// 	var buttons;

// 	// 	if (supportCordova) {
// 	// 		buttons = [
// 	// 			{
// 	// 				text: '拍照',
// 	// 				handler: () => {
// 	// 					this.setByPhotograph();
// 	// 				}
// 	// 			}, {
// 	// 				text: '从手机相册选择',
// 	// 				handler: () => {
// 	// 					this.setByAlbum();

// 	// 				}
// 	// 			}, {
// 	// 				text: '取消',
// 	// 				role: 'cancel',
// 	// 				handler: () => {

// 	// 				}
// 	// 			}
// 	// 		];
// 	// 	} else {
// 	// 		buttons = [
// 	// 			{
// 	// 				text: '从手机相册选择',
// 	// 				handler: () => {
// 	// 					this.setByAlbum_html5();

// 	// 				}
// 	// 			},
// 	// 			{
// 	// 				text: '取消',
// 	// 				role: 'cancel',
// 	// 				handler: () => {

// 	// 				}
// 	// 			}
// 	// 		];
// 	// 	}


// 	// 	let actionSheet = this.actionSheetCtrl.create({
// 	// 		buttons: buttons
// 	// 	});
// 	// 	actionSheet.present();
// 	// }

// 	// //通过拍照设置头像
// 	// setByPhotograph() {
// 	// 	let supportCordova = this.platform.is('cordova');

// 	// 	if (!supportCordova) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

// 	// 	let loading;
// 	// 	this.photograph()
// 	// 		.then((fileURI) => {
// 	// 			return this.cropImg(fileURI);
// 	// 		})
// 	// 		.then(newImagePath => {
// 	// 			loading = this.systemService.showLoading();
// 	// 			return this.userService.modAvatar(newImagePath).toPromise();
// 	// 		})
// 	// 		.then(res => {
// 	// 			this.systemService.closeLoading(loading);
// 	// 			this.avatarSrc = res.data.avatarSrc;
// 	// 		})
// 	// 		.catch(err => {
// 	// 			this.systemService.closeLoading(loading);
// 	// 			this.myHttp.handleError(err, '设置头像失败')
// 	// 		});
// 	// }

// 	// //通过手机相册设置头像
// 	// setByAlbum() {
// 	// 	let supportCordova = this.platform.is('cordova');

// 	// 	if (!supportCordova) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

// 	// 	let loading;
// 	// 	this.openAlbum()
// 	// 		.then((fileURI) => {
// 	// 			return this.cropImg(fileURI);
// 	// 		})
// 	// 		.then(newImagePath => {
// 	// 			loading = this.systemService.showLoading();
// 	// 			return this.userService.modAvatar(newImagePath).toPromise();
// 	// 		})
// 	// 		.then(res => {
// 	// 			this.systemService.closeLoading(loading);
// 	// 			this.avatarSrc = res['data'].avatarSrc;
// 	// 		})
// 	// 		.catch(err => this.myHttp.handleError(err, '设置头像失败'));

// 	// }

// 	// setByAlbum_html5() {
// 	// 	var that = this;

// 	// 	utils.openAlbum()
// 	// 	.then((file)=>{
// 	// 		return Promise.all([utils.File2DataURL(file),file]);
// 	// 	})
// 	// 	.then((values)=>{
// 	// 		let dataURL = values[0];
// 	// 		let file = values[1];
// 	// 		return utils.imgDataURL2File(dataURL, file.name, { destWidth: 100, destHeight: 100 })
// 	// 	})
// 	// 	.then(function (_file) {
// 	// 		that.userService.modAvatar2(_file)
// 	// 			.subscribe(
// 	// 			res => {}
// 	// 			);
// 	// 	});
// 	// }

// 	// //拍照
// 	// photograph(): Promise<string> {
// 	// 	var options = {
// 	// 		allowEdit: true,
// 	// 		targetWidth: 400,
// 	// 		targetHeight: 400,
// 	// 	};

// 	// 	return this.camera.getPicture(options);
// 	// }

// 	// //打开手机相册
// 	// openAlbum(): Promise<string> {

// 	// 	var options = {
// 	// 		maximumImagesCount: 1
// 	// 	};
// 	// 	return this.imagePicker.getPictures(options).then(val => {
// 	// 		return val[0];
// 	// 	})
// 	// }

// 	// //裁剪图片
// 	// cropImg(fileURI): Promise<string> {
// 	// 	return this.crop.crop(fileURI, { quality: 100 });
// 	// }


// }
