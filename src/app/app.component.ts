import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
// import { Push } from 'ionic-native';
// import { Badge } from 'ionic-native';
// import { Keyboard } from 'ionic-native';
import { Storage } from '@ionic/storage';


import { IndexPage } from '../pages/index/index';
import { SigninPage } from '../pages/signin/signin';
/*test*/
import { SignupCompletePage } from '../pages/signup-complete/signup-complete';


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
			// this.rootPage = SignupCompletePage;

		});

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();

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
import { Observable, Subject, ReplaySubject, BehaviorSubject, AsyncSubject, Subscriber, Subscription, Scheduler } from 'rxjs';




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

// export declare class ReplaySubject<T> extends Subject<T> {
//     private scheduler;
//     private _events;
//     private _bufferSize;
//     private _windowTime;
//     constructor(bufferSize?: number, windowTime?: number, scheduler?: Scheduler);
//     next(value: T): void;
//     protected _subscribe(subscriber: Subscriber<T>): Subscription;
//     _getNow(): number;
//     private _trimBufferThenGetEvents();
// }


// var subscription = new Subscription();

// var a = new Subject();
// var b = new Subject();
// var c = new Subject();

// subscription.add(
// 	a.subscribe(n => {
// 		console.log('fire a:' + n);
// 	})
// );

// subscription.add(
// 	b.subscribe(n => {
// 		console.log('fire b:' + n);
// 	})
// );



// a.next(1);
// b.next(1);

// subscription.unsubscribe();

// subscription.add(
// 	c.subscribe(n => {
// 		console.log('fire c:' + n);
// 	})

// )

// a.next(2);
// b.next(2);
// c.next(2);


// //test12
// var a = new Subject();


// a.subscribe(
// 	(n)=>{
// 		console.log('next',n);
// 	},
// 	err=>{
// 		console.log('err',err);
// 	},
// 	()=>{
// 		console.log('complete');
// 	}
// )


// a.next(1);
// a.next(2);
// a.complete();
// a.error({code:1,msg:'出错啦'});



// //模拟msg
// var newMsg = new ReplaySubject();

// newMsg.next({ content: '3' });
// newMsg.next({ content: '4' });

// var storage = new Subject<any[]>();

// var list = new BehaviorSubject([]);

// var list4newMsg = newMsg.map(msg => {
// 	var _list = list.getValue();
// 	_list.push(msg);
// 	return _list;
// });



// storage
// 	.subscribe(_list => {
// 		list.next(_list);

// 		list4newMsg
// 			.subscribe(_list => {
// 				list.next(_list);
// 			});
// 	});

// //--------------------

// setTimeout(() => {
// 	storage.next([
// 		{ content: '1' },
// 		{ content: '2' },
// 	])
// }, 1000);

// setTimeout(() => {
// 	storage.next([
// 		{ content: '7' },
// 		{ content: '8' },
// 	])
// }, 1000);

// list.subscribe(_list => {
// 	console.log(_list);
// })

// newMsg.next({ content: '5' });



//模拟本地存储
// var id = new Subject();
// var id$ = id.publishReplay(1).share();

// id.next(1);

// id.subscribe(
// 	n => console.log('id$', n),
// 	err => console.log('eer', err)

// )

// id$.subscribe(
// 	n => console.log('id$', n),
// 	err => console.log('eer', err)

// )

// id.next(2);

// // merge
// var source1 = Rx.Observable.interval(100)
// 	.timeInterval()
// 	.pluck('interval');
// var source2 = Rx.Observable.interval(150)
// 	.timeInterval()
// 	.pluck('interval');

// var source = Rx.Observable.merge(
// 	source1,
// 	source2).take(10);


// var subscription = source.subscribe(
// 	function (x) {
// 		console.log('Next: ' + x);
// 	},
// 	function (err) {
// 		console.log('Error: ' + err);
// 	},
// 	function () {
// 		console.log('Completed');
// 	});


//concat
// var timer = Rx.Observable.interval(1000);
// var sequence = Rx.Observable.range(1, 10);
// var result = Rx.Observable.concat(timer, sequence);
// result.subscribe(x => console.log(x));

// //mergeMap
// var interval = Rx.Observable.interval(1000);
// var result = interval.mergeMap(x =>
// 	x % 2 === 1 ? Rx.Observable.of('a' + x, 'b' + x, 'c' + x) : Rx.Observable.empty()
// );
// result.subscribe(x => console.log(x));



// // forkJoin

// /* Using observables and Promises */
// var source = Rx.Observable.forkJoin(
// 	Rx.Observable.range(0, 10),
// 	Rx.Observable.interval(1000).take(3)
// );

// var subscription = source.subscribe(
// 	x => console.log(`onNext: ${x}`),
// 	e => console.log(`onError: ${e}`),
// 	() => console.log('onCompleted'));

// // => Next: [42, 9, 3, 56]
// // => Completed



//
// var clicks = Rx.Observable.fromEvent(document, 'click');
// var powersOfTwo = clicks
// 	.mapTo(1)
// 	.expand(x => Rx.Observable.of(3 * x).delay(1000))
// 	.take(10);
// powersOfTwo.subscribe(x => console.log(x));


// var a = new BehaviorSubject(1);

// var clicks = Rx.Observable.fromEvent(document, 'click')
// 	.mergeMap(v => a.filter(v => v > 5))
// 	.subscribe(v => console.log(v));

// setTimeout(() => {
// 	a.next(8);
// }, 5000);








