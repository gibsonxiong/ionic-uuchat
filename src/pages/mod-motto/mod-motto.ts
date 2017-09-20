import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';

@Component({
	selector: 'cy-mod-motto-page',
	templateUrl: 'mod-motto.html'
})
export class ModMottoPage implements OnInit {

	private form: FormGroup;

	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private builder: FormBuilder,
		private userService: UserService,
		private systemService: SystemService,
		private myHttp: MyHttp
	) {

		let motto = navParams.data['motto'];

		this.form = builder.group({
			motto: motto
		});


	}

	ngOnInit() {


	}

	//提交
	submit() {
		let motto = this.form.value.motto;
		let obser = this.userService.modMotto(motto);
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.navCtrl.pop();
			},
			err => this.myHttp.handleError(err, '修改失败')

		);
	}
}
