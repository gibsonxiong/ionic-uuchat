import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyReplaySubject } from '../utils/MyRelaySubject';
import { HOST } from '../config';
import { MyHttp } from '../providers/my-http';

declare var io: any;

@Injectable()
export class BackEnd {
    private socket: any;


    //连接完触发
    // private onStatusChangedSubject = new ReplaySubject(1);
    // public onStatusChanged = this.onStatusChangedSubject.asObservable();

    private onForceQuitSubject = new Subject();
    public onForceQuit = this.onForceQuitSubject.asObservable();

    private pushMsgSubject = new MyReplaySubject();
    public pushMsg$ = this.pushMsgSubject.asObservable();

    private pushUserModedSubject = new MyReplaySubject();
    public pushUserModed$ = this.pushMsgSubject.asObservable();


    constructor(
        public myhttp: MyHttp,
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
                    console.log('断开连接'); //todo 重连
                });

                //强迫下线
                this.socket.on('forceQuit', msg => {
                    this.onForceQuitSubject.next();
                });
            }
            init();


            //登录
            this.socket.emit('signin', token, (isOK) => {
                resolve();
            });
        });

    }

    private disconnectSocket() {
        this.socket && this.socket.close();
    }

}