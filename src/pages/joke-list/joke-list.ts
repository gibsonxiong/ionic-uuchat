import { Component, ViewChild, OnInit, Renderer, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, Content } from 'ionic-angular';
import { FriendAddPage } from '../friend-add/friend-add';
import { FriendNewPage } from '../friend-new/friend-new';
import { UserDetailPage } from '../user-detail/user-detail';
import { JokeAddPage } from '../joke-add/joke-add';
import { BackEnd } from '../../providers/backend';
import { JokeService } from '../../services/joke';
import { SystemService } from '../../services/system';
import { Keyboard } from '@ionic-native/keyboard';
import { MyHttp } from '../../providers/my-http';

import 'rxjs/add/operator/do';


function isStringLike(s) {
	return s !== undefined && s !== null && s !== '';
}

@Component({
	selector: 'cy-joke-list-page',
	templateUrl: 'joke-list.html'
})
export class JokeListPage {

	private form: FormGroup;
	private jokes: any[] = [];

	constructor(
		private fb: FormBuilder,
		private jokeService: JokeService,
		private myHttp: MyHttp,
		private navCtrl: NavController

	) {
		this.form = fb.group({
			content: ''
		});

	}

	ngOnInit() {
		this.jokeService.getJokes()
			.subscribe(
			res => {
				this.jokes = res.data;
			},
			err => this.myHttp.handleError(err, '获取数据出错啦')
			)
	}


	doRefresh(refresher?) {
		this.jokeService.getJokes()
			.do(() => {
				refresher && refresher.complete();
			}, () => {
				refresher && refresher.complete();
			})
			.subscribe(
			res => {
				this.jokes = res.data;
			},
			err => this.myHttp.handleError(err, '获取数据出错啦')
			)
	}

	likeJoke(joke, isLike) {
		this.jokeService.likeJoke(joke._id, isLike)
			.subscribe(
			res => {
				Object.assign(joke, res.data);
			},
			err => this.myHttp.handleError(err, '出错啦')
			)

	}

	dislikeJoke(joke, isDislike) {
		this.jokeService.dislikeJoke(joke._id, isDislike)
			.subscribe(
			res => {
				Object.assign(joke, res.data);
			},
			err => this.myHttp.handleError(err, '出错啦')
			)
	}

	gotoJokeAddPage() {
		this.navCtrl.push(JokeAddPage);
	}

}
