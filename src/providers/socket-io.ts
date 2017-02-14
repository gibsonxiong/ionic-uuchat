import {Injectable,EventEmitter} from '@angular/core';
import { Subject} from 'rxjs/Subject';
import { ReplaySubject} from 'rxjs/ReplaySubject';
import { HOST } from '../config';

declare var io: any;

@Injectable()
export class SocketIO{
	socket:any;

	private pushMsgSubject = new ReplaySubject();
	public pushMsg$ = this.pushMsgSubject.asObservable();

	public forceQuit$ = new EventEmitter();

	constructor(){
	}

	signin(token){
		this.socket = io.connect(HOST);

		
		this.socket.on('disconnect', msg => {
	      console.log('disconnect');
	    });

		//推送消息
	    this.socket.on('pushMsg', msg => {
	      this.pushMsgSubject.next(msg);
	    });

	    //强迫下线
	    this.socket.on('forceQuit', msg => {
	      this.forceQuit$.emit(null);
	    });

	    //登录
		this.socket.emit('signin', token);
	}

	signout(){
		this.socket.close();
	}



}