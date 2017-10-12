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

	existsByUsernameAsync(): AsyncValidatorFn  {
		var timer;
		return (contorl): Promise<{ [key: string]: any }> => {
			return new Promise((resolve, reject) => {
				clearTimeout(timer);

				setTimeout(() => {
					let username = contorl.value;
					this.userService.existsByUsername(username).subscribe(
						res => {
							let isExists = res.data;
							if (isExists) {
								resolve({ existsByUsername: true })
							} else {
								resolve(null)
							}
						},
						err => {
							console.log(err);
							resolve({ existsByUsername: true })
						}
					)

				}, 300);

			});



		}

	}
}