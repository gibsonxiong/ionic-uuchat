import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HOST } from '../config';
import { MyHttp } from '../providers/my-http';
import { BackEnd } from '../providers/backend';

@Injectable()
export class UserService {

	private ownSubject = new BehaviorSubject<any>({});
	public own$ = this.ownSubject.asObservable();

	private relationListSubject = new BehaviorSubject<any[]>([]);
	public relationList$ = this.relationListSubject.asObservable();

	//source: relationListSubject
	private friendListSubject = new BehaviorSubject<any[]>([]);
	public friendList$ = this.friendListSubject.asObservable();

	constructor(
		private myHttp: MyHttp,
		private backEnd: BackEnd
	) {
		this._init();
	}

	private _init() {
		//推送过来的修改用户信息
		this.backEnd.pushUserModed$.subscribe(user => {

			let relationList = this.relationListSubject.getValue();

			relationList.forEach(relation => {
				if (relation._friend._id === user['_id']) {
					relation._friend = user;
				}
			});

			this.relationListSubject.next(relationList);
		})

		//relationList 改变通知 friendList改变
		this.relationListSubject
			.map(relationList => {
				let friendList = [];

				relationList.forEach(function (relation) {
					//关系确认才是好友关系
					if (relation.confirm) {
						friendList.push(relation._friend);
					}
				});

				return friendList;

			}).subscribe(
			friendList => {
				this.friendListSubject.next(friendList)
			}
			);



	}

	getSource() {
		this.getOwn();
		this.getRelationList();
	}


	clearSource() {
		this.ownSubject.next({});
		this.relationListSubject.next([]);
		this.friendListSubject.next([]);
	}


	getOwn(): void {
		this.myHttp.get(HOST + '/user/getOwn')
			.subscribe(res => {
				this.ownSubject.next(res.data);
			});
	}

	//获取关系列表
	getRelationList(): void {

		this.myHttp.get(HOST + '/user/getRelationList')
			.subscribe(
			res => {
				this.relationListSubject.next(res.data);
			},
			err => {
				console.log(err);
			}
			);
	}


	//通过手机通讯录查找好友
	getUserListByMobiles(mobiles: Number[]): Observable<any> {
		return this.myHttp.post(HOST + '/user/getUserListByMobiles', { mobiles });
	}

	//登录
	signin(postData): Observable<any> {
		return this.myHttp.post(HOST + '/user/signin', postData);
	}

	//登录
	safe(token, userId): Observable<any> {
		return this.myHttp.post(HOST + '/user/safe', { token, userId });
	}

	//获取验证码
	getVerificationCode(mobile): Observable<any> {
		return this.myHttp.get(HOST + '/user/getVerificationCode/' + mobile);
	}


	//验证验证码
	checkVerificationCode(mobile, code): Observable<any> {
		var postData = { mobile, code };
		return this.myHttp.post(HOST + '/user/checkVerificationCode', postData);
	}

	//注册
	signup(formData): Observable<any> {
		return this.myHttp.post(HOST + '/user/signup', formData);
	}

	//搜索用户
	searchUser(search): Observable<any> {
		return this.myHttp.get(HOST + '/user/searchUser/' + search);
	}

	//获取用户资料
	getUser(userId): Observable<any> {
		return this.myHttp.get(HOST + '/user/getUser/' + userId);
	}


	//申请好友
	makeFriend(userId, requestMsg = ''): Observable<any> {
		return this.myHttp.get(HOST + '/user/makeFriend/' + userId + '?requestMsg=' + requestMsg);
	}

	//确认好友
	confirmFriend(userId): Observable<any> {
		return this.myHttp.get(HOST + '/user/confirmFriend/' + userId);
	}

	//获取新好友列表
	getFriendNewList(): Observable<any> {
		return this.myHttp.get(HOST + '/user/getFriendNewList');
	}

	//修改昵称
	modAvatar(ImgUri): Observable<any> {
		return this.myHttp.upload(ImgUri, 'avatar.png', HOST + '/user/modAvatar')
			.do(res => {
				this.ownSubject.next(res.data);
			});
	}


	//修改昵称
	modNickname(nickname): Observable<any> {
		let observable = this.myHttp.get(HOST + '/user/modNickname/' + nickname);

		observable.subscribe(
			res => {
				this.ownSubject.next(res.data);
			},
			err => {
				console.log(err);
			}

		);

		return observable;
	}

	//修改性别
	modGender(gender): Observable<any> {
		let observable = this.myHttp.get(HOST + '/user/modGender/' + gender);

		observable.subscribe(
			res => {
				this.ownSubject.next(res.data);
			},
			err => {
				console.log(err);
			}

		);

		return observable;
	}


	//修改个性签名
	modMotto(motto): Observable<any> {
		let observable = this.myHttp.get(HOST + '/user/modMotto/' + motto);

		observable.subscribe(
			res => {
				this.ownSubject.next(res.data);
			},
			err => {
				console.log(err);
			}

		);

		return observable;
	}

	//通过username查找是否存在帐号
	existsByUsername(username): Observable<any> {
		return this.myHttp.get(HOST + '/user/existsByUsername/' + username);
	}

}
