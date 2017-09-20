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