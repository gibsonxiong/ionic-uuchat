import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModAvatarPage } from '../mod-avatar/mod-avatar';
import { ModNicknamePage } from '../mod-nickname/mod-nickname';
import { ModGenderPage } from '../mod-gender/mod-gender';
import { ModMottoPage } from '../mod-motto/mod-motto';
import { UserService } from '../../services/user';
// import { SystemService } from '../../services/system';

@Component({
	selector: 'cy-me-detail-page',
	templateUrl: 'me-detail.html',
})
export class MeDetailPage implements OnInit {

	own: any = {};

	private own_Subscription;

	constructor(
		private navCtrl: NavController,
		private userService: UserService,
		// private systemService: SystemService,
	) { }

	ngOnInit() {

		this.own_Subscription = this.userService.own$.subscribe(own => this.own = own);

	}

	ngOnDestroy() {
		this.own_Subscription.unsubscribe();
	}

	gotoModAvatarPage() {
		this.navCtrl.push(ModAvatarPage, { avatarSrc: this.own.avatarSrc });
	}

	gotoModNicknamePage() {
		this.navCtrl.push(ModNicknamePage, { nickname: this.own.nickname });
	}

	gotoModGenderPage() {
		this.navCtrl.push(ModGenderPage, { gender: this.own.gender });
	}

	gotoModMottoPage() {
		this.navCtrl.push(ModMottoPage, { motto: this.own.motto });
	}

}
