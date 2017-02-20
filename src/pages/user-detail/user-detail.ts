import { Component,OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user';
import { FriendRequestPage } from '../friend-request/friend-request';
import { ChatContentPage } from '../chat-content/chat-content';

@Component({
  selector:'cy-user-detail-page',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage implements OnInit{
  public userId;

  public user :any = {};
  public isFriend :boolean = false;
  public relationId : string;
  
  constructor(
    public navCtrl :NavController,
  	public navParams :NavParams,
    public userService : UserService
  	) {

    this.userId = navParams.data.userId;
  }

  ngOnInit(){

    this.userService.getUser(this.userId).subscribe(
      res => {

        this.user = res.data.user;
        this.isFriend = res.data.isFriend;
        this.relationId = res.data.relationId;
      },
      err =>{
        console.log(err);
      }
    );
  }



  gotoFriendRequestPage(){
    this.navCtrl.push(FriendRequestPage,{userId: this.userId}); 
  }

  gotoChatContentPage(){
    if(!this.relationId)  return alert('你们还不是朋友！');

    //如果是从聊天内容页进来的话，就直接pop
    if(this.navCtrl.getPrevious().component === ChatContentPage){
        this.navCtrl.pop();
    }else{
        this.navCtrl.push(ChatContentPage,{relationId: this.relationId, chatName:this.user.nickname}); 
    }
    
    
  }
}
