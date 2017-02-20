import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder,FormControl, FormArray, FormGroup,Validators} from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector:'cy-mod-gender-page',
  templateUrl: 'mod-gender.html'
})
export class ModGenderPage implements OnInit{

	form : FormGroup;

  constructor(
  	public navCtrl:NavController,
  	public navParams:NavParams,
  	public builder:FormBuilder,
  	public userService:UserService
  	) {

  	let gender = navParams.data['gender'];

  	this.form = builder.group({
  		gender:[gender],
  	});


  }

  ngOnInit(){
  	
  	
  }


  //提交
  submit(){
  	console.log('submit',this.form);

  	let gender = this.form.value.gender;
	  
  	this.userService.modGender(gender).subscribe(
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
