import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { MyReplaySubject } from '../utils/MyRelaySubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/combineLatest';
import { HOST } from '../config';
import { MyHttp } from '../providers/my-http';
import { BackEnd } from '../providers/backend';
import { UserService } from '../services/user';

@Injectable()
export class MsgService {

	private readingId: string = '';

	private newMsgSubject = new MyReplaySubject<any>();
	public newMsg$ = this.newMsgSubject.asObservable();

	private msgListSubject = new BehaviorSubject<any[]>([]);
	public msgList$ = this.msgListSubject.asObservable();

	private chatListSubject = new BehaviorSubject<any[]>([]);
	public chatList$ = this.chatListSubject.asObservable();

	private storageMsgListSubject = new Subject<any[]>();
	private storageChatListSubject = new Subject<any[]>();


	constructor(
		public storage: Storage,
		public myHttp: MyHttp,
		public backEnd: BackEnd,
		public userService: UserService
	) {
		this._init();
	}

	private _init() {

		this.backEnd.pushMsg$.subscribe(
			msg => this.newMsgSubject.next(msg)
		)

		//msg
		let msgListByNewMsg_Subscription;
		let msgListByNewMsg$ = this.newMsgSubject
			.map(msg => {
				let msgList = this.msgListSubject.getValue();
				msgList.push(msg);
				return msgList;
			})
			.combineLatest(this.userService.friendList$)
			.map((combine) => {
				let msgList = combine[0];
				let friendList = combine[1];
				console.log('msgList$ & friendList$:', msgList, friendList);

				msgList.forEach(msg => {

					friendList.forEach(friend => {
						if (msg.fromUserId === friend._id) {
							msg._fromUser = friend;
						}
					});

				});

				return msgList;
			});

		this.storageMsgListSubject.subscribe(
			msgList => {
				this.msgListSubject.next(msgList);

				msgListByNewMsg_Subscription && msgListByNewMsg_Subscription.unsubscribe();

				//先从本地存储拿数据，在绑定，避免顺序搞错
				msgListByNewMsg_Subscription = msgListByNewMsg$.subscribe(list => {
					this.storageMsgList(list)
					this.msgListSubject.next(list);
				})
			}
		)


		//chat
		let chatListByNewMsg_Subscription;
		let chatListByNewMsg$ = this.newMsgSubject
			.map(msg => {
				let chatList = this.chatListSubject.getValue();

				return this.updateChatList(chatList, msg);
			})
			.combineLatest(this.userService.relationList$)
			.map((combine) => {
				let chatList = combine[0];
				let relationList = combine[1];
				console.log('chatList$ & relationList$:', chatList, relationList);

				chatList.forEach(chat => {

					relationList.forEach(relation => {
						if (chat.relationId === relation._id) {
							chat.name = relation._friend.nickname;
							chat.avatarSrc = relation._friend.avatarSrc;
						}
					});

				});

				return chatList;
			});

		this.storageChatListSubject.subscribe(
			chatList => {
				this.chatListSubject.next(chatList);

				chatListByNewMsg_Subscription && chatListByNewMsg_Subscription.unsubscribe();

				//先从本地存储拿数据，在绑定，避免顺序搞错
				chatListByNewMsg_Subscription = chatListByNewMsg$.subscribe(list => {
					this.storageChatList(list)
					this.chatListSubject.next(list);
				})
			}
		)

		this.msgList$.subscribe(
			msgList => {

			}
		)

	}

	getSource() {
		this.getMsgList();
		this.getChatList();
	}


	clearSource() {
		this.newMsgSubject.clearBuffer();
		this.chatListSubject.next([]);
		this.msgListSubject.next([]);
	}

	//从本地拿
	getMsgList() {
		let ownId = this.backEnd.getOwnId();

		Observable.fromPromise(this.storage.get('msgList/' + ownId)).subscribe(
			msgList => this.storageMsgListSubject.next(msgList || []),
			err => console.log(err)
		)

	}

	getChatList() {
		let ownId = this.backEnd.getOwnId();

		return Observable.fromPromise(this.storage.get('chatList/' + ownId)).subscribe(
			chatList => this.storageChatListSubject.next(chatList || []),
			err => console.log(err)
		)
	}

	deleteChat(relationId) {

		var chatList = this.chatListSubject.getValue();

		chatList.forEach((chat, i) => {
			if (chat.relationId === relationId) {
				chatList.splice(i, 1);
				return false;
			}
		});
		this.storageChatList(chatList);
		this.storageChatListSubject.next(chatList);

	}

	//每收到newMsg,更新chatList并返回
	private updateChatList(chatList, msg) {
		let index = chatList.findIndex(chat => {
			return chat.relationId === msg.relationId;
		});

		let content = msg.type === 0 ? msg.content : '[语音]';

		//该信息存在聊天列表中
		if (index !== -1) {
			let chat = chatList[index];
			chat.lastContent = content;
			chat.lastSendTime = msg.sendTime;
			chat.unread++;                    //未读加一

			//如果正在读信息
			if (chat.relationId === this.readingId) {
				chat.unread = 0;
			}

		} else {
			let chat = {
				lastContent: content,
				lastSendTime: msg.sendTime,
				relationId: msg.relationId,
				name: '',
				avatarSrc: '',
				unread: 1
			};

			//如果正在读信息
			if (chat.relationId === this.readingId) {
				chat.unread = 0;
			}

			chatList.unshift(chat);
		}

		//以时间倒序排序
		chatList.sort((a, b) => {
			return new Date(b.lastSendTime).getTime() - new Date(a.lastSendTime).getTime()
		});


		return chatList;
	}



	sendMsg(relationId, content): void {
		// let msgList = this.msgListSubject.getValue();
		// msgList.push({
		// 	relationId: relationId,
		// 	fromUserId: this.backEnd.getOwnId(),
		// 	content: content,
		// 	pending: true,
		// 	type: 0
		// })
		// this.msgListSubject.next(msgList);

		this.myHttp.post(HOST + '/msg/sendMsg', { relationId, content })
			.subscribe(
			res => { this.newMsgSubject.next(res.data) },
			err => { console.log(err) }
			);
	}

	//发送语音
	sendAudioMsg(relationId, audioUri, audioDuration): void {
		console.log(audioDuration)
		this.myHttp.upload('/sdcard/' + audioUri, 'record.mp3', HOST + '/msg/sendAudioMsg', { relationId, audioDuration })
			.subscribe(res => {
				this.newMsgSubject.next(res.data);
			},
			err => {
				console.log(err)
			});
	}


	readChat(relationId) {
		this.readingId = relationId;
		var chatList = this.chatListSubject.getValue();

		chatList.forEach(chat => {
			if (chat.relationId === relationId) {
				chat.unread = 0;
			}
		});

		this.storageChatList(chatList);
		this.chatListSubject.next(chatList);
	}

	stopReadChat() {
		this.readingId = '';
	}


	//msg
	storageMsgList(msgList): Promise<any> {
		return this.setInPrivateStorage('msgList', msgList);
	}

	getMsgListFromStorage(): Promise<any> {
		return this.getInPrivateStorage('msgList');
	}

	//chat
	storageChatList(chatList): Promise<any> {
		return this.setInPrivateStorage('chatList', chatList);
	}

	getChatListFromStorage(): Promise<any> {
		return this.getInPrivateStorage('chatList');
	}




	getInPrivateStorage(name): Promise<any> {
		let ownId = this.backEnd.getOwnId();
		return this.storage.get(name + '/' + ownId);
	}

	setInPrivateStorage(name, value): Promise<any> {
		let ownId = this.backEnd.getOwnId();
		return this.storage.set(name + '/' + ownId, value);
	}

}
