import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
	selector: 'cy-chat-popover-page',
	templateUrl: 'chat-popover.html'
})
export class ChatPopoverPage {

	constructor(public viewCtrl: ViewController) { }

	close() {
		this.viewCtrl.dismiss();
	}


}
