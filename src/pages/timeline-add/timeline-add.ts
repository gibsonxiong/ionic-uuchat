import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Camera, Crop, ImagePicker } from 'ionic-native';
import { File as CordovaFile, FileEntry } from 'ionic-native';
import { UserService } from '../../services/user';
import { TimelineService } from '../../services/timeline';
import { SystemService } from '../../services/system';


@Component({
	selector: 'cy-timeline-add-page',
	templateUrl: 'timeline-add.html'
})
export class TimelineAddPage {

	private form: FormGroup;
	private medias = [];

	constructor(
		private sanitizer: DomSanitizer,
		private fb: FormBuilder,
		private navCtrl: NavController,
		private actionSheetCtrl: ActionSheetController,
		private timelineService: TimelineService,
		private systemService: SystemService
	) {
		this.form = fb.group({
			content: '',
		});


		this.medias.push(new MediaFile());


	}

	publish(): void {
		var formValue = this.form.value;

		//上传文件
		var formData = new FormData();

		formData.append("content", formValue.content);
		this.medias.forEach(media => {
			if (media.isFill()) {
				formData.append("medias", media.file, 'media.png');  //暂只支持图片
			}
		});

		let obser = this.timelineService.publish(formData);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.systemService.createToast('发表成功');
				this.navCtrl.pop();
			},
			err => this.systemService.handleError(err, '发表失败')
		);

	}

	fillMedia(media) {
		this.presentActionSheet(media);
	}

	removeMedia(media) {
		this.medias.forEach((_media, i) => {
			if (_media == media) {
				this.medias.splice(i, 1);
				return false;
			}
		})
	}


	//上传图片
	presentActionSheet(media) {
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: '拍照',
					handler: () => {
						this.setByPhotograph(media);
					}
				}, {
					text: '从手机相册选择',
					handler: () => {
						// this.setByAlbum(media);

					}
				}, {
					text: '取消',
					role: 'cancel',
					handler: () => { }
				}
			]
		});
		actionSheet.present();
	}

	//通过拍照设置头像
	setByPhotograph(media: MediaFile) {

		this.photograph()
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
					let src = this.sanitizer.bypassSecurityTrustUrl(file['localURL']);
					let isFill = media.isFill();
					media.set(src, Html5File);
					//重新编辑不需要增加addbtn
					if (!isFill) this.medias.push(new MediaFile());
				};
				reader.readAsArrayBuffer(file as Blob);
			})
			.catch((err) => {
				console.log('拍照失败！', err);
			});
	}

	//通过手机相册设置头像
	// setByAlbum() {
	// 	this.openAlbum()
	// 		.then((uri) => {
	// 			return this.cropImg(uri);
	// 		})
	// 		.then(newImagePath => {

	// 			CordovaFile.resolveLocalFilesystemUrl(newImagePath)
	// 				.then(fileEntry => {

	// 					this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(fileEntry.toInternalURL());

	// 				})
	// 				.catch(err => {
	// 					console.log('boooh', err)
	// 				});
	// 		})
	// 		.catch((err) => {
	// 			console.log('访问手机相册失败！', err);
	// 		});
	// }

	//拍照
	photograph() {
		var options = {
			allowEdit: false,
			// targetWidth: 400,
			// targetHeight: 400,
		};

		return Camera.getPicture(options);
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

class MediaFile {
	public src = null;
	public file = null;

	constructor() { }

	set(src, file) {
		this.src = src;
		this.file = file;
	}

	isFill() {
		return !!(this.src && this.file);
	}
}