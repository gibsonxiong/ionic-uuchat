import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/combineLatest';
import { HOST } from '../config';
import { MyHttp } from '../providers/my-http';
import { SocketIO } from '../providers/socket-io';
import { UserService } from '../services/user';

@Injectable()
export class MsgService {

    private ownId: string;
    private readingId: string = '';

    private newMsgSubject = new ReplaySubject<any>();
    public newMsg$ = this.newMsgSubject.asObservable();

    private msgListSubject = new BehaviorSubject<any[]>([]);
    public msgList$ = this.msgListSubject.asObservable();

    private chatListSubject = new BehaviorSubject<any[]>([]);
    public chatList$ = this.chatListSubject.asObservable();

    // private newMsgSubject;
    // public newMsg$;

    // private msgListSubject;
    // public msgList$;

    // private chatListSubject;
    // public chatList$;

    private ownSubscription;
    private pushMsgSubscription;
    private msgListSubscription;
    private chatListSubscription;

    constructor(
        public storage: Storage,
        public myHttp: MyHttp,
        public socketIO: SocketIO,
        public userService: UserService
    ) {

    }

    initData(): void {

        this.ownSubscription = this.userService.own$.subscribe(
            own => {
                this.ownId = own._id;

                //todo 因为initMsgList依赖userId，所以要在userId存在时执行，待优化
                if (own._id) {
                    this.initMsgList();
                    this.initChatList();
                }
            }
        );

        this.pushMsgSubscription = this.socketIO.pushMsg$.subscribe(
            msg => this.newMsgSubject.next(msg)
        );

        // // //test
        // this.newMsg$.subscribe(
        //     newMsg => {
        //         console.log('newMsg$', newMsg);
        //     }
        // )

        // this.msgList$.subscribe(
        //     msgList => {
        //         console.log('msgList$', msgList);
        //     }
        // )

        // this.chatList$.subscribe(
        //     chatList => {
        //         console.log('chatList$', chatList);
        //     }
        // )
    }

    destroy() {
        this.ownSubscription.unsubscribe();
        this.pushMsgSubscription.unsubscribe();
    }

    //从一个Observable (this.newMsgSubject) 
    initMsgList() {
        if (this.msgListSubscription) this.msgListSubscription.unsubscribe();
        //从本地获取聊天信息
        this.getMsgListFromStorage().then(msgList => {
            msgList = msgList || [];
            this.msgListSubject.next(msgList);

        });

        this.msgListSubscription = this.newMsgSubject.subscribe(msg => {
            let msgList = this.msgListSubject.getValue();
            msgList.push(msg);
            this.storageMsgList(msgList)
            this.msgListSubject.next(msgList);
        });
    }

    //从两个Observable (this.newMsgSubject, this.userService.relationList$) 
    initChatList() {
        if (this.chatListSubscription) this.chatListSubscription.unsubscribe();

        //从本地获取聊天列表
        this.getChatListFromStorage().then(chatList => {

            chatList = chatList || [];

            this.chatListSubject.next(chatList);

            this.chatListSubscription = this.newMsgSubject.scan((chatList, msg) => {

                let index = chatList.findIndex(chat => {
                    return chat.relationId === msg.relationId;
                });

                //该信息存在聊天列表中
                if (index !== -1) {
                    let chat = chatList[index];
                    chat.lastContent = msg.content;
                    chat.lastSendTime = msg.sendTime;
                    chat.unread++;                    //未读加一

                    //如果正在读信息
                    if (chat.relationId === this.readingId) {
                        chat.unread = 0;
                    }

                } else {
                    let chat = {
                        lastContent: msg.content,
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
            .map((res: any) => {
                return res.json().data;
            }).subscribe(msg => { this.newMsgSubject.next(msg) });
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

    // getChatList():Observable<any>{
    // 	return this.myHttp.get( HOST + '/msg/getChatList')
    //                   .map((res:any)=> {
    //                       return res.json();
    //                   });
    // }

    // getMsgList(relationId):Observable<any>{
    // 	return this.myHttp.get( HOST + '/msg/getMsgList/'+relationId)
    //                   .map((res:any)=> {
    //                       return res.json();
    //                   });
    // }

}
