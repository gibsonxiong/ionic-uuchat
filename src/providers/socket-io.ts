import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HOST } from '../config';

declare var io: any;

@Injectable()
export class SocketIO {
	socket: any;

	private pushMsgSubject = new ReplaySubject();
	public pushMsg$ = this.pushMsgSubject.asObservable();

	private pushUserModedSubject = new BehaviorSubject({});
	public pushUserModed$ = this.pushUserModedSubject.asObservable();

	public forceQuit$ = new EventEmitter();

	constructor() {
	}

	signin(token) {
		this.socket = io.connect(HOST);

		this.socket.on('disconnect', msg => {
			console.log('disconnect');
		});

		//推送消息
		this.socket.on('pushMsg', (msgs, ask) => {
			//如果是多条消息
			msgs.forEach(msg => {
				this.pushMsgSubject.next(msg);
			});

			var msgIds = msgs.map(msg=>{
				return msg._id;
			})

			//传回服务器，删除存储记录
			ask(msgIds);

		});

		//推送修改过的user
		this.socket.on('pushUserModed', user => {
			this.pushUserModedSubject.next(user);
		});

		//强迫下线
		this.socket.on('forceQuit', msg => {
			this.forceQuit$.emit(null);
		});

		//登录
		this.socket.emit('signin', token, (isOK) => {
			console.log(`signin socket ${isOK}`);

		});
	}

	signout() {
		this.socket.close();
	}



}