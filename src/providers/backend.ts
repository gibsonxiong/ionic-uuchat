import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MyReplaySubject } from '../utils/MyRelaySubject';
import { HOST } from '../config/config';
import { MyHttp } from './my-http';
import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

declare var require;
var io = require('../assets/js/socket.io-1.4.5');

@Injectable()
export class BackEnd {
    private socket: any;

    private token;
    private ownId;

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
    connect(token, ownId) {
        this.token = token;
        this.ownId = ownId;
        this.myhttp.setToken(token);
        this.connectSocket(token);
    }

    //断开连接
    disconnect() {
        this.token = null;
        this.ownId = null;
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

    getToken() {
        return this.token;
    }

    getOwnId() {
        return this.ownId;
    }

    private connectSocket(token): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket = io.connect(HOST,{
                query:{
                    token:this.token
                }
            });

            let init = () => {

                this.socket.on('connect', msg => {
                    this.stateSubject.next(2);
                    console.log('connect:连接成功'); 
                });

                this.socket.on('connect_error', msg => {
                    this.stateSubject.next(0);
                    console.log('connect_error:连接失败'); 
                });

                this.socket.on('connect_timeout', msg => {
                    this.stateSubject.next(0);
                    console.log('connect_timeout:连接超时'); 
                });

                this.socket.on('disconnect', msg => {
                    this.stateSubject.next(0);
                    console.log('disconnect:断开连接'); 
                });

                this.socket.on('reconnect_attempt', msg => {
                    this.stateSubject.next(1);
                    console.log('reconnect_attempt:尝试重连');
                });
                
                this.socket.on('reconnecting', msg => {
                    this.stateSubject.next(1);
                    console.log('reconnecting:重连中');
                });
                
                this.socket.on('reconnect', msg => {
                    this.stateSubject.next(2);
                    console.log('reconnect:重连成功');
                });

                this.socket.on('reconnect_error', msg => {
                    this.stateSubject.next(0);
                    console.log('reconnect_error:重连失败');
                });

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


                //强迫下线
                this.socket.on('forceQuit', msg => {
                    this.onForceQuitSubject.next();
                    this.socket.close();
                });

            }
            init();
            // this.socket.open();


            //登录
            this.socket.emit('login', token, (isOK) => {
                this.stateSubject.next(2);
                resolve();
            });

        });

    }

    private disconnectSocket() {
        if(this.socket){
            this.socket.close();
            this.socket.off();
        }
    }

}