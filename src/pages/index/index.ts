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
import { MyHttp } from '../../providers/my-http';
import { SocketIO } from '../../providers/socket-io';

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
    private forceQuitSubscription;
    private chatListSubscription;

    constructor(
        private navCtrl: NavController,
        private storage: Storage,
        private alertCtrl: AlertController,
        private userService: UserService,
        private msgService: MsgService,
        private myHttp: MyHttp,
        private socketIO: SocketIO,
    ) {
    }

    ngOnInit() {
        this.connectServer();
    }

    ngOnDestroy() {
        this.destroyData();
    }

    connectServer() {
        this.storage.get('token').then(token => {
            if (token) {
                //连接http
                this.myHttp.setToken(token);
                //连接socket
                this.socketIO.signin(token);
                //初始化数据
                this.initData();

            } else {
                this.gotoSigninPage();
            }
        });
    }

    initData(): void {
        this.userService.initData();
        this.msgService.initData();

        //强迫下线通知
        this.forceQuitSubscription = this.socketIO.forceQuit$.subscribe(() => {
            this.destroyData();
            this.presentAlert();
        });

        //没读消息数
        this.chatListSubscription = this.msgService.chatList$
            .map(chatList => {
                var chatUnread = 0;

                chatList.forEach(chat => {
                    chatUnread += chat.unread;
                })

                return chatUnread;
            })
            .subscribe(chatUnread => {
                this.chatUnread = chatUnread;
            });

            //消息通知
        this.msgService.newMsg$
            .subscribe(msg => {
                this.notify(msg);
            });
    }

    destroyData(): void {
        this.userService.destroy();
        this.msgService.destroy();

        this.forceQuitSubscription.unsubscribe();
        this.chatListSubscription.unsubscribe();
    }

    notify(msg) {
        LocalNotifications.schedule({
            id: msg._id,
            title: msg._fromUser.nickname,
            text: msg.content,
            icon: 'http://www.classscript.com/static/img/avatar2.png',
            smallIcon: 'http://www.classscript.com/static/img/avatar2.png',
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
                        this.connectServer();
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
