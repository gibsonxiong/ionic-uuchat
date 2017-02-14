import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user';

@Component({
  selector:'cy-friend-request-page',
  templateUrl: 'friend-request.html'
})
export class FriendRequestPage {
	userId:string;
	requestMsg:string;

  constructor(
  	public navCtrl :NavController,
  	public navParams :NavParams,
    public userService : UserService
   ) {

  	this.userId = navParams.data.userId;


  }

   markFriend():void{
  	this.userService.makeFriend(this.userId,this.requestMsg).subscribe(

  		res => {
  			if(res.code) return alert(res.msg);

  			alert('申请成功！');
      		this.navCtrl.pop();
      	}
    );
  }

}
