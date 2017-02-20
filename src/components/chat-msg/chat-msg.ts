import { Component,Input } from '@angular/core';
import { UserService } from '../../services/user';
import { MsgService } from '../../services/msg';

@Component({
  selector: 'cy-chat-msg',
  templateUrl: 'chat-msg.html'
})
export class ChatMsg {

  msgList : any[] = [];
  userId:string;


  @Input('relationId') relationId;

   constructor(
  		private userService:UserService ,
  		private msgService:MsgService
  ) {

  }

  ngOnInit(){

     this.userService.own$.subscribe(
      own=>{
        this.userId = own._id;
      }
    );

    this.msgService.msgList$.subscribe(
        msgList => {
            this.msgList = msgList.filter(msg =>{

                return msg.relationId === this.relationId;
            });
        }
    );

  }

}


