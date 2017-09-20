import { Component, ViewChild, OnInit, Renderer, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, Content } from 'ionic-angular';
import { FriendAddPage } from '../friend-add/friend-add';
import { FriendNewPage } from '../friend-new/friend-new';
import { UserDetailPage } from '../user-detail/user-detail';
import { TimelineAddPage } from '../timeline-add/timeline-add';
import { BackEnd } from '../../providers/backend';
import { TimelineService } from '../../services/timeline';
import { SystemService } from '../../services/system';
import { Keyboard } from 'ionic-native'; //键盘
import { MyHttp } from '../../providers/my-http';

import 'rxjs/add/operator/do'


function isStringLike(s) {
	return s !== undefined && s !== null && s !== '';
}

@Component({
	selector: 'cy-timeline-list-page',
	templateUrl: 'timeline-list.html'
})
export class TimelineListPage {
	private form: FormGroup;
	private timelines: any[] = [];
	private commentTimelineId;
	private atUserId;
	private atUserName;
	private commenting = false;

	@ViewChild('input') input;
	@ViewChild(Content) contentComponent;

	constructor(
		private cdRef: ChangeDetectorRef,
		private renderer: Renderer,
		private fb: FormBuilder,
		private navCtrl: NavController,
		private timelineService: TimelineService,
		private systemService: SystemService,
		private backEnd: BackEnd,
		private myHttp: MyHttp

	) {
		this.form = fb.group({
			content: ''
		})

	}

	ngOnInit() {

		let obser = this.timelineService.getTimelines();
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.timelines = res.data;
			},
			err => this.myHttp.handleError(err, '查看朋友圈出错啦')
		)

		this.contentComponent.ionScrollStart.subscribe(
			e => {
				// console.log(e);
				this.hideCommentInput();
			},
			err => {
				console.log(err);
			}
		)

		Keyboard.onKeyboardHide().subscribe(
			v => {
				console.log(v);
				this.hideCommentInput();
			},
			err => {

			}
		)

		// document.addEventListener("resize", () => {
		// 	console.log(123123);
		// 	this.contentComponent.resize();
		// }, false);
	}

	ngOnDestroy() {

	}

	// ionViewDidEnter() {
	// 	let obser = this.timelineService.getTimelines();
	// 	obser = this.systemService.linkLoading(obser);

	// 	obser.subscribe(
	// 		res => {
	// 			this.timelines = res.data;
	// 		},
	// 		err => this.myHttp.handleError(err, '查看朋友圈出错啦')
	// 	)
	// }

	doRefresh(refresher) {
		this.timelineService.getTimelines()
			.do(() => {
				refresher.complete();
			}, () => {
				refresher.complete();
			})
			.subscribe(
			res => {
				this.timelines = res.data;
			},
			err => this.myHttp.handleError(err, '查看朋友圈出错啦')
			)
	}


	likeTimeline(timelineId, isLike) {

		this.timelineService.likeTimeline(timelineId, isLike)
			.subscribe(
			res => {
				var timeline = res.data;
				this.timelines.forEach((_timeline, i) => {
					if (_timeline._id === timeline._id) {
						this.timelines[i].likeUserIds = timeline.likeUserIds;
						this.timelines[i]._likeUsers = timeline._likeUsers;
						this.timelines[i]._isLike = timeline._isLike;
						return false;
					}
				})
			},
			err => this.myHttp.handleError(err, '点赞失败')
			);
	}

	commentTimeline() {
		let timelineId = this.commentTimelineId;
		let atUserId = this.atUserId;
		let content = this.form.value.content;
		this.timelineService.commentTimeline(timelineId, content, atUserId).subscribe(
			res => {
				var timeline = res.data;
				this.timelines.forEach((_timeline, i) => {
					if (_timeline._id === timeline._id) {
						this.timelines[i]._comments = timeline._comments;
						return false;
					}
				})
			},
			err => this.myHttp.handleError(err, '评论失败')
		)


	}

	onContentClick() {
		if (!this.commenting) return;

		this.hideCommentInput();
	}

	onCommentBtnClick(e, timelineId, atUserId?, atUserName?) {
		e.stopPropagation();

		if (this.commenting === true) {
			this.hideCommentInput();
			return;
		}

		if (atUserId === this.backEnd.getOwnId()) {

		} else {
			this.showCommentInput(timelineId, atUserId, atUserName);
		}

	}

	showCommentInput(timelineId, atUserId?, atUserName?) {
		this.commentTimelineId = timelineId;
		this.atUserId = atUserId;
		this.atUserName = atUserName;
		this.commenting = true;
		this.contentComponent.resize();
		this.cdRef.detectChanges();

		//反显草稿
		var content = this.timelineService.getCacheComment(timelineId, atUserId);
		if (!isStringLike(content)) {
			content = '';
		}
		this.form.setValue({
			content: content
		});


		//input获得焦点
		setTimeout(() => {
			this.renderer.invokeElementMethod(this.input.nativeElement,
				'focus');
			Keyboard.show();
		}, 0);
	}

	hideCommentInput() {
		//保存草稿
		var content = this.form.value.content;
		this.timelineService.cacheComment(this.commentTimelineId, this.atUserId, content);

		//清除评论框状态
		this.commentTimelineId = null;
		this.atUserId = null;
		this.atUserName = null;
		this.commenting = false;
		this.contentComponent.resize();
		this.cdRef.detectChanges();
	}

	getPlaceholder() {
		return this.atUserId ? `回复${this.atUserName}：` : `评论`;
	}

	gotoTimelineAddPage() {
		this.navCtrl.push(TimelineAddPage);
	}

	gotoUserDetailPage(userId) {
		this.navCtrl.push(UserDetailPage, { userId: userId });
	}

	// ngOnDestroy(){
	// 	this.friendListSubscription.unsubscribe();
	// }

	// gotoUserDetailPage(userId) {
	// 	this.app.getRootNav().push(UserDetailPage, { userId: userId });
	// }

	// gotoFriendAddPage() {
	// 	this.app.getRootNav().push(FriendAddPage);
	// }

	// gotoFriendNewPage() {
	// 	this.app.getRootNav().push(FriendNewPage);
	// }
}
