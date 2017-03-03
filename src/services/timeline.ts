import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HOST } from '../config';
import { MyHttp } from '../providers/my-http';
import { BackEnd } from '../providers/backend';

@Injectable()
export class TimelineService {


	constructor(
		private myHttp: MyHttp,
		private backEnd: BackEnd
	) {
		this._init();
	}

	private _init() {


	}

	getSource() {

	}


	clearSource() {

	}

	// 朋友圈
	getTimelines(): Observable<any> {
		return this.myHttp.get(HOST + '/timeline/getTimelines');
	}

	//发表心情
	publish(formData): Observable<any> {
		return this.myHttp.post(HOST + '/timeline/publish', formData);
	}

	// 点赞
	likeTimeline(timelineId, isLike): Observable<any> {
		var search = new URLSearchParams();
		search.append('isLike', isLike);
		return this.myHttp.get(HOST + '/timeline/likeTimeline/' + timelineId, { search });
	}

	// 评论
	commentTimeline(timelineId, content, atUserId?): Observable<any> {
		return this.myHttp.post(HOST + '/timeline/commentTimeline/' + timelineId, { content, atUserId });
	}


}
