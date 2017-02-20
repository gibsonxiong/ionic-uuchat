import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FriendRequestPage } from '../friend-request/friend-request';
import { UserService } from '../../services/user';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType, IContactFindOptions } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

@Component({
	selector: 'cy-friend-by-contact-page',
	templateUrl: 'friend-by-contact.html',
})
export class FriendByContactPage implements OnInit {
	userList: any[] = [];

	constructor(
		private navCtrl: NavController,
		public userService: UserService
	) {

	}

	ngOnInit() {

		this.findContacts().subscribe(
			contacts => {
				function getDisplayName(mobile){
					var displayName;
					contacts.forEach(contact=>{
						if(contact.phoneNumber === mobile){
							displayName = contact.displayName;
							return false;
						}
						
					});
					return displayName;

				}

				let mobiles = contacts.map(contact => contact.phoneNumber);

				this.userService.getUserListByMobiles(mobiles).subscribe(
					res => {
						let users = res.data;

						users.forEach((user,i)=>{
							user.displayName = getDisplayName(user.mobile);
						})
						this.userList = users;
					},
					err => {
						console.log(err);
					}
				);
			},

			err=>{
				console.log(err);
			}
		)



	}

	findContacts(): Observable<any> {
		let fields: ContactFieldType[] = ['displayName'];
		let options: IContactFindOptions = { hasPhoneNumber: true };

		let p = Contacts.find(fields, options)
			.then(contacts => {
				var newContacts = [];
				contacts.forEach(contact => {
					//一个联系人，手机号码可能有多个
					contact.phoneNumbers.forEach(phoneNumber => {
						newContacts.push({
							displayName: contact.displayName,
							phoneNumber: phoneNumber.value
						});
					});

				});
				return newContacts;
			});

		return Observable.fromPromise(p);

	}

	gotoFriendRequestPage(userId) {
		this.navCtrl.push(FriendRequestPage, { userId });
	}

}



