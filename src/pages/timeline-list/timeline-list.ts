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
import 'rxjs/add/operator/do'

import { Keyboard } from 'ionic-native'; //键盘

@Component({
	selector: 'cy-timeline-list-page',
	templateUrl: 'timeline-list.html'
})
export class TimelineListPage {
	private form: FormGroup;
	private timelines: any[] = [];
	private commentTimelineId;
	private atUserId;
	private commenting = false;

	@ViewChild('input') input;
	@ViewChild(Content) contentComponent;

	constructor(
		private ref: ChangeDetectorRef,
		private renderer: Renderer,
		private fb: FormBuilder,
		private navCtrl: NavController,
		private timelineService: TimelineService,
		private systemService: SystemService,
		private backEnd: BackEnd,

	) {
		this.form = fb.group({
			content: ''
		})

	}

	ngOnInit() {
		this.contentComponent.ionScrollStart.subscribe(
			e => {
				// console.log(e);
				this.hideCommentInput();
				this.ref.detectChanges();
			},
			err => {
				console.log(err);
			}
		)

		Keyboard.onKeyboardHide().subscribe(
			v => {
				console.log(v);
				this.hideCommentInput();
				this.ref.detectChanges();
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

	ionViewDidEnter() {
		let obser = this.timelineService.getTimelines();
		obser = this.systemService.linkLoading(obser);

		obser.subscribe(
			res => {
				this.timelines = res.data;
			},
			err => this.systemService.handleError(err, '查看朋友圈出错啦')
		)
	}

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
			err => this.systemService.handleError(err, '查看朋友圈出错啦')
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
			err => this.systemService.handleError(err, '点赞失败')
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
			err => this.systemService.handleError(err, '评论失败')
		)


	}

	onContentClick() {
		console.log('onContentClick');

		if (!this.commenting) return;

		this.hideCommentInput();
	}


	showCommentInput(e, timelineId) {
		e.stopPropagation();
		this.commentTimelineId = timelineId;
		this.commenting = true;
		this.contentComponent.resize();
		setTimeout(() => {
			this.renderer.invokeElementMethod(this.input.nativeElement,
				'focus');
			Keyboard.show();
		}, 0);
	}

	hideCommentInput() {
		this.commentTimelineId = null;
		this.commenting = false;
		this.contentComponent.resize();
	}

	gotoTimelineAddPage() {
		this.navCtrl.push(TimelineAddPage);
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
