import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';


@Component({
	selector: 'cy-timeline-add-page',
	templateUrl: 'timeline-add.html'
})
export class TimelineAddPage {

	private form: FormGroup;

	constructor(
		private fb: FormBuilder,
		private navCtrl: NavController,
		// private userService: UserService,
		// private systemService: SystemService
	) {
		this.form = fb.group({
			content:''
		})

	}

	publish(): void {
		
	}

}
