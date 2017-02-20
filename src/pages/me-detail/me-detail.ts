import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModAvatarPage } from '../mod-avatar/mod-avatar';
import { ModNicknamePage } from '../mod-nickname/mod-nickname';
import { ModGenderPage } from '../mod-gender/mod-gender';
import { ModMottoPage } from '../mod-motto/mod-motto';
import { UserService } from '../../services/user';

@Component({
  selector:'cy-me-detail-page',
  templateUrl: 'me-detail.html',
})
export class MeDetailPage implements OnInit{

	own:any = {};

  constructor(
  		public navCtrl : NavController,
  	    public userService :UserService
  	) {}

  ngOnInit(){

    this.userService.own$.subscribe( own=> this.own = own );

  }

  gotoModAvatarPage(){
  	this.navCtrl.push(ModAvatarPage,{avatarSrc:this.own.avatarSrc});
  }

  gotoModNicknamePage(){
    this.navCtrl.push(ModNicknamePage,{nickname:this.own.nickname});
  }

  gotoModGenderPage(){
    this.navCtrl.push(ModGenderPage,{gender:this.own.gender});
  }

  gotoModMottoPage(){
    this.navCtrl.push(ModMottoPage,{motto:this.own.motto});
  }
  
}
