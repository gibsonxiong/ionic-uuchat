import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { API_HOST } from '../../config/config';

@Component({
	selector: 'cy-qrcode-page',
	templateUrl: 'qrcode.html'
})
export class QRcodePage implements OnInit {

	private qrcodeText = API_HOST +'/qrcode?userId=111&&action=markfriend';

	constructor(
	) {
	}

	ngOnInit() {

	}



}
