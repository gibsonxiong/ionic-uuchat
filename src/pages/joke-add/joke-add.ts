import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { NavController, ActionSheetController } from 'ionic-angular';
import { JokeService } from '../../services/joke';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';

@Component({
	selector: 'cy-joke-add-page',
	templateUrl: 'joke-add.html'
})
export class JokeAddPage {

	private form: FormGroup;

	constructor(
		private sanitizer: DomSanitizer,
		private fb: FormBuilder,
		private navCtrl: NavController,
		private actionSheetCtrl: ActionSheetController,
		private jokeService: JokeService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {


	}

	ngOnInit() {
		this.form = this.fb.group({
			content: [
				'',
				[
					Validators.required
				]
			]
		});


	}

	publish(): void {
		var formValue = this.form.value;

		//上传文件
		var formData = new FormData();

		formData.append("content", formValue.content);
		
		let obser = this.jokeService.publishJoke(formData);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.systemService.showToast('发表成功');
				setTimeout(() => {
					this.navCtrl.pop();
				}, 1500);

			},
			err => this.myHttp.handleError(err, '发表失败')
		);

	}

}
