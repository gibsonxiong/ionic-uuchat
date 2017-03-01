import { Component, ViewChild, OnInit, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FriendAddPage } from '../friend-add/friend-add';
import { FriendNewPage } from '../friend-new/friend-new';
import { UserDetailPage } from '../user-detail/user-detail';
import { TimelineAddPage } from '../timeline-add/timeline-add';
import { BackEnd } from '../../providers/backend';
import { TimelineService } from '../../services/timeline';
import { SystemService } from '../../services/system';

@Component({
	selector: 'cy-timeline-list-page',
	templateUrl: 'timeline-list.html'
})
export class TimelineListPage {
	private timelines: any[] = [];
	private commenting = false;

	@ViewChild('input') input;

	constructor(
		private renderer: Renderer,
		private navCtrl: NavController,
		private timelineService: TimelineService,
		private systemService: SystemService,
		private backEnd: BackEnd,
	) { }


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
			.do(()=>{
				refresher.complete();
			},()=>{
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

	commentTimeline(timelineId) {
		// this.commenting = true;
		// // this.input.nativeElement.focus();
		// setTimeout(() => {
		// 	this.renderer.invokeElementMethod(this.input.nativeElement,
		// 		'focus');
		// }, 100);


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
