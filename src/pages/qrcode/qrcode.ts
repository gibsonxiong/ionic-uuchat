import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { API_HOST } from '../../config/config';

declare var require;
var QRCode = require('../../assets/js/qrcode');

@Component({
	selector: 'cy-qrcode-page',
	templateUrl: 'qrcode.html'
})
export class QRcodePage implements OnInit {


	constructor(
		// private navCtrl: NavController,
		// private navParams: NavParams,
		// private builder: FormBuilder,
		// private userService: UserService,
		// private systemService: SystemService
	) {



	}

	ngOnInit() {
		var qrcode = new QRCode('qrcode', {
			text: API_HOST +'/qrcode?userId=111&&action=markfriend',
			width: 256,
			height: 256,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});

	}



}
