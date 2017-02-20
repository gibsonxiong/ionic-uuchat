import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
	selector: 'cy-signup-page',
	templateUrl: 'signup.html'
})
export class SignupPage {
	private form:FormGroup;

	constructor(
		private userservice: UserService,
		private fb:FormBuilder,
	) {
		this.form = fb.group({
			mobile:'',
			code:''
		})
	}

	//获取短信验证码
	getVerificationCode(e) {
		e.preventDefault();
		let mobile = this.form.value.mobile;
		alert('getVerificationCode');
		this.userservice.getVerificationCode(mobile).subscribe(()=>{
			
		});
	}

	//验证短信验证码
	checkVerificationCode() {
		let mobile = this.form.value.mobile;
		let code = this.form.value.code;
		alert('checkVerificationCode');
		this.userservice.checkVerificationCode(mobile,code).subscribe(()=>{

		});
	}

}
