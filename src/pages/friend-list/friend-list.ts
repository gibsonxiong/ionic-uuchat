import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {FriendAddPage} from '../friend-add/friend-add';
import {FriendNewPage} from '../friend-new/friend-new';
import { UserDetailPage } from '../user-detail/user-detail';
import { UserService } from '../../services/user';

@Component({
  selector:'cy-friend-list-page',
  templateUrl: 'friend-list.html'
})
export class FriendListPage implements OnInit{
  list:any[] = [];

  constructor(
  	public navCtrl:NavController,
    public userService:UserService
  	) {}


  ngOnInit(){
    this.userService.friendList$.subscribe(
      friendList => {
        this.list = friendList;
      }
    );
  }

  gotoUserDetailPage(userId){
    this.navCtrl.push(UserDetailPage,{userId: userId });
  }

  gotoFriendAddPage(){
  	this.navCtrl.push(FriendAddPage);
  }

  gotoFriendNewPage(){
  	this.navCtrl.push(FriendNewPage);
  }
}
