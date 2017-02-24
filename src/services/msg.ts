import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { MyReplaySubject } from '../utils/MyRelaySubject';
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

	private ownId: string;
	private readingId: string = '';

	private newMsgSubject = new MyReplaySubject<any>();
	public newMsg$ = this.newMsgSubject.asObservable();

	private msgListSubject = new BehaviorSubject<any[]>([]);
	public msgList$ = this.msgListSubject.asObservable();

	private chatListSubject = new BehaviorSubject<any[]>([]);
	public chatList$ = this.chatListSubject.asObservable();

	private own_Subscription;
	private pushMsg_Subscription;
	private newMsg_Subscription;
	private newMsg_Subscription2;

	constructor(
		public storage: Storage,
		public myHttp: MyHttp,
		public backEnd: BackEnd,
		public userService: UserService
	) {

	}

	init(): void {
		this.unsubscribe();

		//获取ownId后，从本地找出msgList,chatList
		this.own_Subscription = this.userService.own$.subscribe(
			own => {
				this.ownId = own._id;

				//todo 因为initMsgList依赖userId，所以要在userId存在时执行，待优化
				if (own._id) {
					this.initMsgList();
					this.initChatList();
				}
			}
		)


		this.pushMsg_Subscription = this.backEnd.pushMsg$.subscribe(
			msg => this.newMsgSubject.next(msg)
		)

	}

	destroy() {
		this.clearSource();
		this.unsubscribe();
	}

	clearSource() {
		this.newMsgSubject.clearBuffer();
		this.chatListSubject.next([]);
		this.msgListSubject.next([]);
	}

	unsubscribe() {
		this.own_Subscription && this.own_Subscription.unsubscribe();
		this.pushMsg_Subscription && this.pushMsg_Subscription.unsubscribe();
		this.newMsg_Subscription && this.newMsg_Subscription.unsubscribe();
		this.newMsg_Subscription2 && this.newMsg_Subscription2.unsubscribe();
	}



	//从一个Observable (this.newMsgSubject)
	initMsgList() {

		//从本地获取聊天信息
		this.getMsgListFromStorage().then(msgList => {
			msgList = msgList || [];
			this.msgListSubject.next(msgList);

			//从每条newMsg获取msgList
			this.newMsg_Subscription = this.newMsgSubject.subscribe(msg => {
				let msgList = this.msgListSubject.getValue();
				msgList.push(msg);
				this.storageMsgList(msgList)
				this.msgListSubject.next(msgList);
			});

		});


	}

	//从两个Observable (this.newMsgSubject, this.userService.relationList$)
	initChatList() {

		//从本地获取聊天列表
		this.getChatListFromStorage().then(chatList => {

			chatList = chatList || [];

			this.chatListSubject.next(chatList);

			//从每条newMsg获取chatList
			this.newMsg_Subscription2 = this.newMsgSubject.scan((chatList, msg) => {

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

			}, chatList)
				.combineLatest(this.userService.relationList$, (chatListTemp, relationList) => {
					console.log('chatListTemp$ & relationList$:', chatListTemp, relationList);

					chatListTemp.forEach(chat => {

						relationList.forEach(relation => {
							if (chat.relationId === relation._id) {
								chat.name = relation._friend.nickname;
								chat.avatarSrc = relation._friend.avatarSrc;
							}
						});

					});

					return chatListTemp;
				})
				.do((chatList) => { this.storageChatList(chatList) })
				.subscribe(chatList => this.chatListSubject.next(chatList));

		});
	}


	sendMsg(relationId, content): void {
		this.myHttp.post(HOST + '/msg/sendMsg', { relationId, content })
			.subscribe(
			res => { this.newMsgSubject.next(res.data) },
			err => { console.log(err) }
			);
	}

	//发送语音
	sendAudioMsg(relationId, audioUri): void {
		this.myHttp.upload('/sdcard/' + audioUri, 'record.mp3', HOST + '/msg/sendAudioMsg', { relationId })
			.subscribe(res => {
				this.newMsgSubject.next(res.data);
			},
			err=>{
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


	storageMsgList(msgList): Promise<any> {
		return this.setInPrivateStorage('msgList', msgList);
	}

	getMsgListFromStorage(): Promise<any> {
		return this.getInPrivateStorage('msgList');
	}

	storageChatList(chatList): Promise<any> {
		return this.setInPrivateStorage('chatList', chatList);
	}

	getChatListFromStorage(): Promise<any> {
		return this.getInPrivateStorage('chatList');
	}

	getInPrivateStorage(name): Promise<any> {
		return this.storage.get(name + '/' + this.ownId);
	}

	setInPrivateStorage(name, value): Promise<any> {
		return this.storage.set(name + '/' + this.ownId, value);
	}

}
