import { Component, OnInit, Input, ElementRef } from "@angular/core";

declare var require;
var QRCode = require('../../assets/js/qrcode');

@Component({
	selector: 'cy-qrcode',
	templateUrl: 'qrcode.html',
})
export class QrcodeComponent implements OnInit{

	@Input('text') text:string;

	constructor(
		private _elementRef:ElementRef
	) {
		
	}

	ngOnInit() {
		var qrcode = new QRCode(this._elementRef.nativeElement, {
			text: this.text,
			width: 256,
			height: 256,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: QRCode.CorrectLevel.H
		});

	}


}
