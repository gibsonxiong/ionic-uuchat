import { Component} from '@angular/core';
import { Platform, AlertController} from 'ionic-angular';
import { StatusBar, Splashscreen, Contacts, Contact, ContactField,  ContactName, ContactFieldType } from 'ionic-native';
import { Storage } from '@ionic/storage';


import { IndexPage } from '../pages/index/index';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';

// import { ReorderPage } from '../pages/reorder/reorder';

import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

import {MyHttp} from '../providers/my-http';
import {SocketIO} from '../providers/socket-io';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  rootPage;

  constructor(
     public platform: Platform,
     public storage : Storage,
     public alertCtrl: AlertController,
  ) {

    //通过token判断是否登录过
    storage.get('token').then(token =>{
      if(token) {
        this.rootPage = IndexPage;
      }else{
        this.rootPage = SigninPage;
      }

    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

    });
  }

  ngOnInit(){

  }

  showAlert(value) {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: value,
      buttons: ['OK']
    });
    alert.present();
  }


}


//test
import Rx from 'rxjs';
import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/flatMap';


// //test1
// class Foo{
//   name

//   constructor(name){
//     this.name = name;
//   }
// }

// Observable.of([
//   new Foo('gibson'),
//   new Foo('ying'),
// ])
// .switchMap(foos=>{
//   return Observable.from(foos);
// })
// .filter(foo=>{
//   return foo.name === 'ying';
// })
// .subscribe(foo=>{
// })

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


//test7
let age$ = Observable.create((observer)=>{
  setTimeout(()=>{
    observer.next(true);
  },15000);
});
let isDev$ = Observable.create((observer)=>{
  setTimeout(()=>{
    observer.next(true);
  },2000);
});

Observable
    .zip(age$,
         isDev$)
    .subscribe(x => console.log(x));





