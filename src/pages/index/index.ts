import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Vibration } from 'ionic-native';
import { LocalNotifications } from 'ionic-native';

import { Storage } from '@ionic/storage';

import { ChatPage } from '../chat/chat';
import { FriendListPage } from '../friend-list/friend-list';
import { DiscoverPage } from '../discover/discover';
import { MePage } from '../me/me';
import { SigninPage } from '../signin/signin';

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
        this.storage.get('token').then(token => {
            if (token) {
                this.backEnd.connect(token);
                shouldInitData && this.initData();

            } else {
                this.systemService.showToast('请先登录');
                this.gotoSigninPage();
            }
        });
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
        var content = msg.type === 0 ? msg.content : '[语音]';
        LocalNotifications.schedule({
            id: msg._id,
            title: msg._fromUser.nickname,
            text: content,
            // icon: 'http://www.classscript.com/static/img/avatar2.png',
            // smallIcon: 'http://www.classscript.com/static/img/avatar2.png',
        });

        Vibration.vibrate(100);
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
                        this.gotoSigninPage();
                    }
                },

            ]
        });
        alert.present();
    }

    gotoSigninPage() {
        this.navCtrl.setRoot(SigninPage);
    }


    //   //比 ngOnInit 快
    //   ionViewWillLoad(){
    //       console.log('ionViewWillLoad');
    //   }

    //   ngOnInit(){
    //       console.log('ngOnInit');
    //   }

    //   ngAfterContentInit(){
    //       console.log('ngAfterContentInit');
    //   }


    //   ngAfterViewInit(){
    //       console.log('ngAfterViewInit');
    //   }

    // ngOnDestroy() {
    //     console.log('ngOnDestroy');
    // }

    //   ionViewDidLoad(){
    //       console.log('ionViewDidLoad');
    //   }

    //   ionViewWillEnter(){
    //       console.log('ionViewWillEnter');
    //   }

    //   ionViewDidEnter(){
    //       console.log('ionViewDidEnter');
    //   }

    //   ionViewWillLeave(){
    //       console.log('ionViewWillLeave');
    //   }

    //   ionViewDidLeave(){
    //       console.log('ionViewDidLeave');
    //   }

    //    ionViewWillUnload(){
    //       console.log('ionViewWillUnload');
    //   }

    //   ionViewDidUnload(){
    //       console.log('ionViewDidUnload');
    //   }
}
