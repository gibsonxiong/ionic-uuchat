import { Component,ViewChild,OnInit } from '@angular/core';
import { App } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { SigninPage } from '../signin/signin';
import { MeDetailPage } from '../me-detail/me-detail';
import { UserService } from '../../services/user';
import { MyHttp } from '../../providers/my-http';
import { SocketIO } from '../../providers/socket-io';

@Component({
  selector:'cy-me-page',
  templateUrl: 'me.html'
})
export class MePage implements OnInit{

  user = {};

	@ViewChild('img') img

  constructor(
  	public appCtrl: App,
  	public storage : Storage,
    public userService :UserService,
    public myHttp: MyHttp,
    public socketIO: SocketIO,
  ) {
    
  }

  ngOnInit(){
    this.userService.user$.subscribe(user=>this.user=user);

  }

  photograph(){
  	var that = this;

  	console.log(that.img);
  	Camera.getPicture().then((imageData) => {
  		 that.img.nativeElement.src=imageData;
  	}, (err) => {

  	 	// Handle error
  	});
  }

  clearStorage(){
    this.storage.clear();
  }

  //登出
  signout():void{
  	var that = this;

  	this.storage.remove('token').then(()=>{
      that.myHttp.removeToken();
      that.socketIO.signout();
  		that.appCtrl.getRootNav().setRoot(SigninPage);
  	});
  }

  gotoMeDetailPage(){
    this.appCtrl.getRootNav().push(MeDetailPage);
  }



}
