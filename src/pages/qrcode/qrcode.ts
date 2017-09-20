import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { API_HOST } from '../../config';

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
<<<<<<< HEAD
			text: API_HOST +'/qrcode?userId=111&&action=markfriend',
=======
			text: HOST +'/qrcode?userId=111&&action=markfriend',
>>>>>>> 874cd1e5c181be6f0d2d67cbdb44d0d23a751782
			width: 256,
			height: 256,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});

	}



}
