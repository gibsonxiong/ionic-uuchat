import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModAvatarPage } from '../mod-avatar/mod-avatar';
import { ModNicknamePage } from '../mod-nickname/mod-nickname';
import { ModGenderPage } from '../mod-gender/mod-gender';
import { ModMottoPage } from '../mod-motto/mod-motto';
import { UserService } from '../../services/user';
import { MyHttp } from '../../providers/my-http';

@Component({
  selector:'cy-me-detail-page',
  templateUrl: 'me-detail.html',
})
export class MeDetailPage implements OnInit{

	user:any = {};

  constructor(
  		public navCtrl : NavController,
  	    public userService :UserService
  	) {}

  ngOnInit(){

    this.userService.user$.subscribe(
      user=> this.user = user
    );

  }

  gotoModAvatarPage(){
  	this.navCtrl.push(ModAvatarPage,{avatarSrc:this.user.avatarSrc});
  }

  gotoModNicknamePage(){
    this.navCtrl.push(ModNicknamePage,{nickname:this.user.nickname});
  }

  gotoModGenderPage(){
    this.navCtrl.push(ModGenderPage,{gender:this.user.gender});
  }

  gotoModMottoPage(){
    this.navCtrl.push(ModMottoPage,{motto:this.user.motto});
  }
  
}
