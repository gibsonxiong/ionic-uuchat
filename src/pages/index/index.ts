import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Storage } from '@ionic/storage';

import { ChatPage } from '../chat/chat';
import { FriendListPage } from '../friend-list/friend-list';
import { DiscoverPage } from '../discover/discover';
import { MePage } from '../me/me';
import { LoginPage } from '../login/login';

import { UserService } from '../../services/user';
import { MsgService } from '../../services/msg';
import { SystemService } from '../../services/system';

import { MyHttp } from '../../providers/my-http';
import { BackEnd } from '../../providers/backend';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'cy-index-page',
    templateUrl: 'index.html'
})
export class IndexPage {

    tab1Root = ChatPage;
    tab2Root = FriendListPage;
    tab3Root = DiscoverPage;
    tab4Root = MePage;

    private chatUnread: number = 0;

    private subscriptions = new Subscription();

    constructor(
        private navCtrl: NavController,
        private vibration: Vibration,
        private localNotifications: LocalNotifications,
        private storage: Storage,
        private alertCtrl: AlertController,
        private userService: UserService,
        private msgService: MsgService,
        private systemService: SystemService,
        private myHttp: MyHttp,
        private backEnd: BackEnd,
    ) {
    }

    ngOnInit() {
        this.connectServer();

        //强迫下线通知
        this.subscriptions.add(

            this.backEnd.onForceQuit.subscribe(() => {
                this.forceQuit();
            })

        )

        //没读消息数
        this.subscriptions.add(

            this.msgService.chatList$
                .map(chatList => {
                    var chatUnread = 0;

                    chatList.forEach(chat => {
                        chatUnread += chat.unread;
                    })

                    return chatUnread;
                })
                .subscribe(chatUnread => {
                    this.chatUnread = chatUnread;
                })
        )

        //消息通知
        this.subscriptions.add(

            this.msgService.newMsg$
                .subscribe(msg => {
                    this.notify(msg);
                })
        )

    }

    ngOnDestroy() {
        this.backEnd.disconnect();
        this.destroyData();
        this.unsubscribe();
    }

    connectServer(shouldInitData = true) {
        this.getToken()
            .then(all => {
                let token = all[0];
                let ownId = all[1];
                if (token && ownId) {
                    this.userService.safe(token, ownId).subscribe(
                        res => {
                            this.backEnd.connect(token, ownId);
                            shouldInitData && this.initData();
                        },
                        err => {
                            if (err && err.$custom) {
                                this.systemService.showToast(err.msg);
                                this.gotoLoginPage();
                                return;
                            }
                            this.myHttp.handleError(err);
                        }
                    )

                } else {
                    this.systemService.showToast('请先登录');
                    this.gotoLoginPage();
                }
            })
            .catch(err => this.myHttp.handleError(err));
    }

    getToken(): Promise<any[]> {
        let p1 = this.storage.get('token');
        let p2 = this.storage.get('ownId');

        return Promise.all([p1, p2])
    }

    initData(): void {
        this.userService.getSource();
        this.msgService.getSource();
    }

    destroyData(): void {
        this.backEnd.clearSource();
        this.userService.clearSource();
        this.msgService.clearSource();

    }

    unsubscribe() {
        this.subscriptions.unsubscribe();
    }

    //强迫下线
    forceQuit() {
        //断开连接
        this.backEnd.disconnect();
        //取消所有订阅
        // this.unsubscribe();

        this.presentAlert();
    }

    notify(msg) {
        let ownId = this.backEnd.getOwnId();

        if (!ownId) return;

        if (ownId === msg.fromUserId) return;

        let content = msg.type === 0 ? msg.content : msg.type === 1 ? '[图片]' : '[语音]';

        //通知
        this.localNotifications.schedule({
            id: msg._id,
            title: msg._fromUser.nickname,
            text: content,
        });

        //震动
        this.vibration.vibrate(100);
    }


    presentAlert() {
        let alert = this.alertCtrl.create({
            title: '强迫下线',
            message: '账号在另一地方登录，如果不是本人操作，请及时修改密码！',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: '重新登录',
                    handler: data => {
                        this.connectServer(false);
                    }
                },
                {
                    text: '切换账号',
                    handler: data => {
                        this.gotoLoginPage();
                    }
                },

            ]
        });
        alert.present();
    }

    gotoLoginPage() {
        this.navCtrl.setRoot(LoginPage);
    }

}
