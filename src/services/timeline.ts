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
export class TimelineService {

	private commentsCache = {};

	private onRefreshSubject = new Subject();
	public onRefresh = this.onRefreshSubject.asObservable();

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
		return this.myHttp.get(API_HOST + '/timeline/getTimelines');
	}

	//发表心情
	publish(formData): Observable<any> {
		return this.myHttp.post(API_HOST + '/timeline/publish', formData);
	}

	// 点赞
	likeTimeline(timelineId, isLike): Observable<any> {
		var search = new URLSearchParams();
		search.append('isLike', isLike);
		return this.myHttp.get(API_HOST + '/timeline/likeTimeline/' + timelineId, { search });
	}

	// 评论
	commentTimeline(timelineId, content, atUserId?): Observable<any> {
		return this.myHttp.post(API_HOST + '/timeline/commentTimeline/' + timelineId, { content, atUserId });
	}

	cacheComment(timelineId, atUserId = '', content) {
		this.commentsCache[timelineId + '/' + atUserId] = content;
	}

	getCacheComment(timelineId, atUserId = '') {
		return this.commentsCache[timelineId + '/' + atUserId];
	}

	removeCacheComment(timelineId, atUserId = '') {
		delete this.commentsCache[timelineId + '/' + atUserId];
	}

	refresh() {
		this.onRefreshSubject.next();
	}


}
