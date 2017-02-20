import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { HOST } from '../config';
import { MyHttp } from '../providers/my-http';
import { SocketIO } from '../providers/socket-io';

@Injectable()
export class UserService {

	private ownSubject = new BehaviorSubject<any>({});
	public own$ = this.ownSubject.asObservable();

	private relationListSubject = new BehaviorSubject<any[]>([]);
	public relationList$ = this.relationListSubject.asObservable();

	private friendListSubject = new BehaviorSubject<any[]>([]);
	public friendList$ = this.friendListSubject.asObservable();


	private pushUserModedSubscription;
	private relationListSubscription;

	constructor(
		private myHttp: MyHttp,
		private socketIO: SocketIO
	) {

	}

	initData(): void {

		this.pushUserModedSubscription = this.socketIO.pushUserModed$.subscribe(user => {

			let relationList = this.relationListSubject.getValue();

			relationList.forEach(relation => {
				if (relation._friend._id === user['_id']) {
					relation._friend = user;
				}
			});

			this.relationListSubject.next(relationList);
		});

		//relationList 改变通知 friendList改变
		this.relationListSubscription = this.relationListSubject.map(relationList => {
			let friendList = [];

			relationList.forEach(function (relation) {
				//关系确认才是好友关系
				if (relation.confirm) {
					friendList.push(relation._friend);
				}
			});

			return friendList;

		}).subscribe(friendList => this.friendListSubject.next(friendList));

		//test
		// this.own$.subscribe(
		//     own =>{
		//         console.log('own$',own);
		//     }
		// )

		// this.relationList$.subscribe(
		//     relationList =>{
		//         console.log('relationList$',relationList);
		//     }
		// )

		// this.friendList$.subscribe(
		//     friendList =>{
		//         console.log('friendList$',friendList);
		//     }
		// )


		this.getOwn();
		this.getRelationList();
	}

	destroy() {
		this.pushUserModedSubscription.unsubscribe();
		this.relationListSubscription.unsubscribe();
	}

	getOwn(): void {
		this.myHttp.get(HOST + '/user/getOwn')
			.map((res: any) => {
				return res.json().data;
			})
			.subscribe(self => this.ownSubject.next(self));
	}

	//获取关系列表
	getRelationList(): void {

		this.myHttp.get(HOST + '/user/getRelationList')
			.map((res: any) => {
				return res.json().data;
			})
			.subscribe(relationList => this.relationListSubject.next(relationList));
	}


	//通过手机通讯录查找好友
	getUserListByMobiles(mobiles:Number[]): Observable<any> {
		return this.myHttp.post(HOST + '/user/getUserListByMobiles',{mobiles})
			.map((res: any) => {
				return res.json();
			});
	}

	signin(postData): Observable<any> {
		this.myHttp.get('http://www.baidu.com').map((res: any) => {
			debugger;
			return res.json();
		}).subscribe();

		return this.myHttp.post(HOST + '/user/signin', postData).map((res: any) => {
			return res.json();
		});
	}

	getVerificationCode(mobile): Observable<any> {
		return this.myHttp.get(HOST + '/user/getVerificationCode/' + mobile).map((res: any) => {
			return res.json();
		});
	}

	checkVerificationCode(mobile, code): Observable<any> {
		var postData = { mobile, code };
		return this.myHttp.post(HOST + '/user/checkVerificationCode', postData).map((res: any) => {
			return res.json();
		});
	}

	//搜索用户
	searchUser(search): Observable<any> {
		return this.myHttp.get(HOST + '/user/searchUser/' + search).map((res: any) => {
			return res.json();
		});
	}

	//获取用户资料
	getUser(userId): Observable<any> {
		return this.myHttp.get(HOST + '/user/getUser/' + userId).map((res: any) => {
			return res.json();
		});
	}


	//申请好友
	makeFriend(userId, requestMsg): Observable<any> {
		requestMsg = requestMsg == null ? '' : requestMsg;
		return this.myHttp.get(HOST + '/user/makeFriend/' + userId + '?requestMsg=' + requestMsg).map((res: any) => {
			return res.json();
		});
	}

	//确认好友
	confirmFriend(userId): Observable<any> {
		return this.myHttp.get(HOST + '/user/confirmFriend/' + userId).map((res: any) => {
			return res.json();
		});
	}

	// //获取好友列表
	// getFriendList():void{
	//   this.myHttp.get( HOST +'/user/getFriendList').map((res:any)=> {
	//       return res.json();
	//   }).subscribe(res => this.friendListSubject.next(res.data));
	// }

	//获取新好友列表
	getFriendNewList(): Observable<any> {
		return this.myHttp.get(HOST + '/user/getFriendNewList').map((res: any) => {
			return res.json();
		});
	}



	//修改昵称
	modNickname(nickname): Observable<any> {
		let observable = this.myHttp.get(HOST + '/user/modNickname/' + nickname).map((res: any) => {
			return res.json();
		});

		observable.subscribe(
			res => {
				this.ownSubject.next(res.data);
			}

		);

		return observable;
	}

	//修改性别
	modGender(gender): Observable<any> {
		let observable = this.myHttp.get(HOST + '/user/modGender/' + gender).map((res: any) => {
			return res.json();
		});

		observable.subscribe(
			res => {
				this.ownSubject.next(res.data);
			}

		);

		return observable;
	}


	//修改个性签名
	modMotto(motto): Observable<any> {
		let observable = this.myHttp.get(HOST + '/user/modMotto/' + motto).map((res: any) => {
			return res.json();
		});

		observable.subscribe(
			res => {
				this.ownSubject.next(res.data);
			}

		);

		return observable;
	}


}
