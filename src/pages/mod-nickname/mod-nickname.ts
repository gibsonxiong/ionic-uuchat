import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector:'cy-mod-nickname-page',
  templateUrl: 'mod-nickname.html'
})
export class ModNicknamePage implements OnInit{

	form : FormGroup;

  constructor(
  	public navCtrl:NavController,
  	public navParams:NavParams,
  	public builder:FormBuilder,
  	public userService:UserService
  	) {

  	let nickname = navParams.data['nickname'];

  	this.form = builder.group({
  		nickname:nickname
  	});


  }

  ngOnInit(){
  	
  	
  }


  //提交
  submit(){
  	console.log('submit',this.form);

  	let nickname = this.form.value.nickname;
  	this.userService.modNickname(nickname).subscribe(
  		res => {
  			if(res.code) return console.log(res.msg);
  			this.navCtrl.pop();
  		},
  		err=>{
  			console.log(err);
  		}

  	);
  }
}
