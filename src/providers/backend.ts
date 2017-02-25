import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyReplaySubject } from '../utils/MyRelaySubject';
import { HOST } from '../config';
import { MyHttp } from './my-http';
import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

declare var require;
var io = require('../assets/js/socket.io-1.4.5');

@Injectable()
export class BackEnd {
    private socket: any;


    //连接完触发
    // private onStatusChangedSubject = new ReplaySubject(1);
    // public onStatusChanged = this.onStatusChangedSubject.asObservable();

    private onForceQuitSubject = new Subject();
    public onForceQuit = this.onForceQuitSubject.asObservable();

    private stateSubject = new BehaviorSubject<number>(0);          //0-未连接  1-正在连接  //2-已连接
    public state$ = this.stateSubject.asObservable();

    private pushMsgSubject = new MyReplaySubject();
    public pushMsg$ = this.pushMsgSubject.asObservable();

    private pushUserModedSubject = new MyReplaySubject();
    public pushUserModed$ = this.pushUserModedSubject.asObservable();


    constructor(
        private myhttp: MyHttp,
        // private userService: UserService,
        // private msgService: MsgService,
    ) {

    }


    //连接
    connect(token) {
        this.myhttp.setToken(token);
        this.connectSocket(token);
    }

    //断开连接
    disconnect() {
        this.myhttp.removeToken();
        this.disconnectSocket();
    }

    // getSource(){
    //     this.userService.getSource();
    //     this.msgService.getSource();
    // }

    clearSource() {
        //清除上一个用户的数据
        this.pushMsgSubject.clearBuffer();
        this.pushUserModedSubject.clearBuffer();
    }

    private connectSocket(token): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket = io.connect(HOST);

            let init = () => {
                //推送消息
                this.socket.on('pushMsg', (msgs, ask) => {
                    //如果是多条消息
                    msgs.forEach(msg => {
                        this.pushMsgSubject.next(msg);
                    });

                    //传回服务器，删除存储记录
                    var msgIds = msgs.map(msg => {
                        return msg._id;
                    });
                    ask(msgIds);

                });

                //推送修改过的user
                this.socket.on('pushUserModed', user => {
                    this.pushUserModedSubject.next(user);
                });

                this.socket.on('disconnect', msg => {
                    this.stateSubject.next(0);
                    console.log('断开连接'); //todo 重连
                });

                this.socket.on('reconnect', msg => {
                    console.log('重连');
                });

                this.socket.on('reconnect_attempt', msg => {
                    console.log('reconnect_attempt');
                });

                this.socket.on('reconnecting', msg => {
                    console.log('reconnecting');
                });

                //强迫下线
                this.socket.on('forceQuit', msg => {
                    this.onForceQuitSubject.next();
                });
            }
            init();


            //登录
            this.socket.emit('signin', token, (isOK) => {
                this.stateSubject.next(2);
                resolve();
            });
        });

    }

    private disconnectSocket() {
        this.socket && this.socket.close();
    }

}