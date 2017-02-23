import { Injectable } from '@angular/core';
import { UserService } from '../services/user';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

/*UserValidator*/
@Injectable()
export class UserValidator {

	constructor(
		private userService: UserService
	) {

	}

	static aa(): ValidatorFn {
		return function (control) {
			let value = control.value;
			return {
				full: true
			}
		}
	}

	static existsAsync(): AsyncValidatorFn {

		return function (contorl): Promise<{ [key: string]: any }> {
			return new Promise((resole, reject) => {
				setTimeout(() => {
					if (contorl.value === 'false') {
						resole({ existsAsync: true });
					} else {
						resole(null);
					}

				}, 500);
			});
		}

	}

	existsByUsernameAsync() {
		var timer;
		return (contorl): Promise<{ [key: string]: any }> => {
			return new Promise((resolve, reject) => {
				clearTimeout(timer);

				setTimeout(() => {
					this.userService.existsByUsername(contorl.value).subscribe(
						res => {
							if (res.code) return resolve({ existsByUsername: res.data })
							
							//存在，则无效
							if(res.data){
								resolve({ existsByUsername: true })
							}else{
								resolve(null)
							}
						},
					)

				}, 300);

			});



		}

	}
}