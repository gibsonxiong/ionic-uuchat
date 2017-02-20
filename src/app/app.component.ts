import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType, IContactFindOptions } from 'ionic-native';
// import { Push } from 'ionic-native';
// import { Badge } from 'ionic-native';
// import { Keyboard } from 'ionic-native';
import { Geolocation } from 'ionic-native';
import { Vibration } from 'ionic-native';
import { LocalNotifications } from 'ionic-native';
import { Storage } from '@ionic/storage';


import { IndexPage } from '../pages/index/index';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';

import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

import { SocketIO } from '../providers/socket-io';

@Component({
	templateUrl: 'app.html',
})
export class MyApp {

	rootPage;

	constructor(
		private platform: Platform,
		private storage: Storage,
		private alertCtrl: AlertController,
	) {


		//通过token判断是否登录过
		storage.get('token').then(token => {
			if (token) {
				this.rootPage = IndexPage;
			} else {
				this.rootPage = SigninPage;
			}

		});

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			// StatusBar.styleDefault();
			// Splashscreen.hide();

			// try {
			// 	this.initPush();
			// } catch (e) {
			// 	alert('[Native Error]Push init error')
			// }

			// Badge.registerPermission
			// Badge.hasPermission().then(value => {
			// 	console.log('hasPermission', value);
			// })
			// 	.catch(err => {
			// 		console.log(err);
			// 	})
			// Badge.set(1).then((arg) => {
			// 	console.log(arg);
			// }).catch(err => {
			// 	console.log(err);
			// });


			// console.log('Vibration.vibrate(1000)');
			// Vibration.vibrate(300);


			// console.log('LocalNotifications.schedule()');
			// LocalNotifications.schedule({
			// 	id: 1,
			// 	title: 'Local ILocalNotification Example',
			// 	text: 'Single ILocalNotification',
			// 	// sound: 'file://sound.mp3',
			// 	data: { secret: 'key' },
			// 	icon: 'http://www.classscript.com/static/img/avatar2.png',
			// 	smallIcon: 'http://www.classscript.com/static/img/avatar2.png',
			// 	badge: 2,
			// });


			// console.log('Contact');
			//创建联系人
			// let contact: Contact = Contacts.create();

			// contact.name = new ContactName(null, 'Smith', 'John');
			// contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
			// contact.save().then(
			// 	() => console.log('Contact saved!', contact),
			// 	(error: any) => console.error('Error saving contact.', error)
			// );


			//查找所有联系人电话
			// let fields: ContactFieldType[] = [
			// 	'displayName'
			// ];
			// let options: IContactFindOptions = {
			// 	// filter?: string;
			// 	// /** Determines if the find operation returns multiple navigator.contacts. */
			// 	// multiple?: boolean;
			// 	// desiredFields?: string[];
			// 	// /**
			// 	//  * (Android only): Filters the search to only return contacts with a phone number informed.
			// 	//  */
			// 	// hasPhoneNumber?: boolean;
			// 	// desiredFields:['displayName','phoneNumbers'],
			// 	hasPhoneNumber: true
			// };
			// Contacts.find(fields, options)
			// 	.then(contacts => {
			// 		var data = [];
			// 		contacts.forEach(contact => {
			// 			//一个联系人，手机号码可能有多个
			// 			contact.phoneNumbers.forEach(phoneNumber => {
			// 				data.push({
			// 					displayName: contact.displayName,
			// 					phoneNumber: phoneNumber.value
			// 				});
			// 			});

			// 		});
			// 		console.log('**',data);
			// 	})
			// 	.catch(err => console.log('****', err));


			Geolocation.getCurrentPosition().then((resp) => {
				// resp.coords.latitude
				// resp.coords.longitude

				console.log('latitude:', resp.coords.latitude);
				console.log('longitude:', resp.coords.longitude);
			}).catch((error) => {
				console.log('Error getting location', error);
			});

		});
	}

	ngOnInit() {

	}

	initPush() {
		// let push = Push.init({
		// 	android: {
		// 		senderID: '85075801930'
		// 	},
		// });


	}

	showAlert(value) {
		let alert = this.alertCtrl.create({
			title: 'New Friend!',
			subTitle: value,
			buttons: ['OK']
		});
		alert.present();
	}

	// 前往应用市场进行打分鼓励  
	// goToMarket() {
	// 	AppVersion.getPackageName().then((data) => {

	// 		if (this.platform.is('ios')) {
	// 			window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://  
	// 		} else if (this.platform.is('android')) {
	// 			//window.open('market://details?id=' + data);  

	// 			WebIntent.startActivity({
	// 				action: 'android.intent.action.VIEW',
	// 				url: 'market://details?id=' + data
	// 			}).then(() => { }, (err) => {
	// 				this.noticeSer.showToast('提示：当前手机暂不支持打分鼓励功能哦，请确保安装了应用市场APP~');
	// 			});

	// 		} else {
	// 			this.noticeSer.showToast('提示：当前手机暂不支持打分鼓励功能哦，请确保安装了应用市场APP~');
	// 		}

	// 	}, (err) => {

	// 		alert('PackageName - Error: ' + err);
	// 	});
	// }


}

window.onerror = function (msg, url, line) {
	var idx = url.lastIndexOf("/");
	if (idx > -1) {
		url = url.substring(idx + 1);
	}
	alert("ERROR in " + url + " (line #" + line + "): " + msg);
	return false;
};

document.addEventListener("resume", function () {
	console.log("应用回到前台运行！");
}, false);
document.addEventListener("pause", function () {
	console.log("应用进入到后台！");
}, false);


//test
import Rx from 'rxjs';
import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/flatMap';


//test1
// class Foo {
// 	name

// 	constructor(name) {
// 		this.name = name;
// 	}
// }

// Observable.create(observer => {

// 	observer.next([
// 		new Foo('gibson'),
// 		new Foo('ying'),
// 	]);

// 	setTimeout(() => {
// 		observer.complete();
// 		observer.next([
// 			new Foo('gibson'),
// 			new Foo('ying'),
// 			new Foo('bbb'),
// 			new Foo('aa'),
// 		]);
// 	},1000);


// })
// 	.switchMap(foos => {
// 		return Observable.from(foos);
// 	})
// 	.filter(foo => {
// 		return foo.name === 'ying';
// 	})
// 	.toArray()
// 	.subscribe(foos => {
// 		console.log(foos);
// 	})

// Observable.from([]).subscribe(null, null, () => {
// 	console.log('complete');
// });

// //test2
// var num$ = Observable.create(observer=>{
//   observer.next(1);
//   // observer.error(new Error('aaa'));
//   observer.next(2);
// })

// num$.subscribe(
//   n=>console.log(n),
//   err=>console.log(err),
//   (a,b)=> console.log('complate',a,b)
//  );


// //test3
// const input$ = Observable.fromEvent<KeyboardEvent>(document, 'keydown').do(e => console.log('calll----------')).publish().refCount();

// input$.subscribe(e => console.log('hi1',e));
// input$.subscribe(e => console.log('hi2',e));

// // test4
// var a = new ReplaySubject(1);

// a.next(1);
// a.next(2);

// a.subscribe(n=> console.log(n));

// // a.next(2);
// // a.next(3);


// //test5
// var a = new Subject();
// var b = new BehaviorSubject(1);

// var a$ = a.asObservable();
// var b$ = b.asObservable();
// var c$ = Observable.create((observer)=>{});


// b$.subscribe(n=> console.log(n));

// Observable.of(1000)
//         .subscribe(b)


// b$.subscribe(n=> console.log(2*n));



// test6
// var source = Rx.Observable.from([1, 2, 3]);
// var subject = new Rx.Subject();
// var multicasted = source.multicast(subject);

// // 通过`subject.subscribe({...})`订阅Subject的Observer：
// multicasted.subscribe({
//   next: (v) => console.log('observerA: ' + v)
// });
// multicasted.subscribe({
//   next: (v) => console.log('observerB: ' + v)
// });

// setTimeout(()=>{
//     // 让Subject从数据源订阅开始生效：
//   multicasted.connect();
// },20000);


// //test7
// let age$ = Observable.create((observer) => {
// 	setTimeout(() => {
// 		observer.next(true);
// 	}, 15000);
// });
// let isDev$ = Observable.create((observer) => {
// 	setTimeout(() => {
// 		observer.next(true);
// 	}, 2000);
// });

// Observable
// 	.zip(age$,
// 	isDev$)
// 	.subscribe(x => console.log(x));


//test8

// let a = new ReplaySubject<any>();

// this.a$ = a.scan((sum,n)=>{
// 	return sum+n;
// },0);



// a.next(2);
// a.next(3);

// this.a$.subscribe(n=>{
// 	console.log('n:',n);
// })

// this.a$ = new BehaviorSubject(2);

// this.a$.next(1);


// //test9

// let a = new ReplaySubject<any>();
// let a$ = a.asObservable();

// a.next(2);
// a.next(3);
// a.next(4);
// a.complete();
// a.next(5);

// a$.subscribe(n => {
// 	console.log('n:', n);
// })

// a.next(4);
// a.next(5);

////test10
// (function(){
// 	var a = new Subject();

// 	var aS = a.do((n)=>{
// 		console.log(n);
// 	}).subscribe(n=>{
// 		console.log(n);
// 	})

// 	a.next(100);

// 	aS.unsubscribe();

// 	a.next(200);
// })();

// //test11
// (function () {
// 	var a = new Subject();
// 	var b = new ReplaySubject();

// 	a.concat(b, (data1, data2) => {
// 		debugger;
// 		return data1 * data2;
// 	}).subscribe((res) => {
// 		console.log(res);
// 	});

// 	// b.next(100);
// 	setTimeout(() => {
// 		a.next(200);
// 	}, 3000);


// 	// a.next(200);
// })();








