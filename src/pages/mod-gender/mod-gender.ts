import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

@Component({
	selector: 'cy-mod-gender-page',
	templateUrl: 'mod-gender.html'
})
export class ModGenderPage implements OnInit {

	private form: FormGroup;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private builder: FormBuilder,
		private userService: UserService,
		private systemService: SystemService
	) {

		let gender = navParams.data['gender'];

		this.form = builder.group({
			gender: [gender],
		});

	}

	ngOnInit() {

	}


	//提交
	submit() {
		let gender = this.form.value.gender;
		let obser = this.userService.modGender(gender);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.navCtrl.pop();
			},
			err => this.systemService.handleError(err, '修改失败')
		);
	}
}
