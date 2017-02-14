import { Component,OnInit } from '@angular/core';
import { UserService } from '../../services/user';


@Component({
  selector:'cy-friend-new-page',
  templateUrl: 'friend-new.html'
})
export class FriendNewPage implements OnInit{

	list:any[] =[];

  constructor(
  	public userService:UserService
  	) {}

  ngOnInit(){

  	this.userService.getFriendNewList().subscribe(
  		res=>{
	  		if(res.code) return console.log(res.msg);

        console.log('getFriendNewList:',this.list);
	  		this.list = res.data;
  		},
  		err => {
	  		console.log(err);
	  	}
	  );
  	
  }

  confirmFriend(userId){
  	var that = this;

  	this.userService.confirmFriend(userId).subscribe(
  		res=>{
  			if(res.code) return console.log(res.msg);

  			var i = that.list.forEach(item=>{
  				if(item.fromUserId === userId){
  					item.confirm = true;
  					return false;
  				}
  			});

  			
  		}
  	);
  }


}
