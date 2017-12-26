import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { API_HOST } from '../config/config';
import { MyHttp } from '../providers/my-http';
import { BackEnd } from '../providers/backend';

@Injectable()
export class JokeService {

	constructor(
		private myHttp: MyHttp,
		private backEnd: BackEnd
	) {

	}

	// 朋友圈
	getJokes(): Observable<any> {
		return this.myHttp.get(API_HOST + '/joke/getJokes');
	}

	//发表笑话
	publishJoke(formData): Observable<any> {
		return this.myHttp.post(API_HOST + '/joke/publish', formData);
	}

	//点好评
	likeJoke(jokeId, isLike): Observable<any> {
		return this.myHttp.post(API_HOST + '/joke/like/' + jokeId, { jokeId, isLike });
	}

	//点差评
	dislikeJoke(jokeId, isDislike): Observable<any> {
		return this.myHttp.post(API_HOST + '/joke/dislike/' + jokeId, { isDislike });
	}
}
