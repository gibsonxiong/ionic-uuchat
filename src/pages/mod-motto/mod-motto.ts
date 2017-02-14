import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder,FormGroup} from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector:'cy-mod-motto-page',
  templateUrl: 'mod-motto.html'
})
export class ModMottoPage implements OnInit{

	form : FormGroup;

  constructor(
  	public navCtrl:NavController,
  	public navParams:NavParams,
  	public builder:FormBuilder,
  	public userService:UserService
  	) {

  	let motto = navParams.data['motto'];

  	this.form = builder.group({
  		motto:motto
  	});


  }

  ngOnInit(){
  	
  	
  }


  //提交
  submit(){
  	console.log('submit',this.form);

  	let motto = this.form.value.motto;
  	this.userService.modMotto(motto).subscribe(
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
