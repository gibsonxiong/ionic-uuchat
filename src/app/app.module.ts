import { NgModule, ErrorHandler } from '@angular/core';
import { XHRBackend, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { Highlight } from '../components/highlight/highlight';
/*pages*/
import { IndexPage } from '../pages/index/index';
import { ChatPage } from '../pages/chat/chat';
import { ChatContentPage } from '../pages/chat-content/chat-content';
import { DailyPage } from '../pages/daily/daily';
import { DiscoverPage } from '../pages/discover/discover';
import { MePage } from '../pages/me/me';
import { MeDetailPage } from '../pages/me-detail/me-detail';
import { ModAvatarPage } from '../pages/mod-avatar/mod-avatar';
import { ModNicknamePage } from '../pages/mod-nickname/mod-nickname';
import { ModGenderPage } from '../pages/mod-gender/mod-gender';
import { ModMottoPage } from '../pages/mod-motto/mod-motto';
import { QuestionPage } from '../pages/question/question';
import { ShopPage } from '../pages/shop/shop';
import { FriendAddPage } from '../pages/friend-add/friend-add';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { SignupPage } from '../pages/signup/signup';
import { SignupCompletePage } from '../pages/signup-complete/signup-complete';
import { SigninPage } from '../pages/signin/signin';
import { FriendListPage } from '../pages/friend-list/friend-list';
import { FriendNewPage } from '../pages/friend-new/friend-new';
import { FriendRequestPage } from '../pages/friend-request/friend-request';
import { FriendByContactPage } from '../pages/friend-by-contact/friend-by-contact';
import { ReorderPage } from '../pages/reorder/reorder';
import { DownloadPage } from '../pages/download/download';
import { SettingPage } from '../pages/setting/setting';

import { myHttpFactory } from '../factorys';

/*components*/
import { ChatMsg } from '../components/chat-msg/chat-msg';

/*services*/
import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

import { MyHttp } from '../providers/my-http';
import { BackEnd } from '../providers/backend';

/*pipes*/
import { GenderPipe } from '../pipes/gender';
import { TimediffPipe } from '../pipes/timediff';

@NgModule({
	declarations: [
		MyApp,

		/*pages*/
		IndexPage,
		ChatPage,
		ChatContentPage,
		DailyPage,
		DiscoverPage,
		MePage,
		MeDetailPage,
		ModAvatarPage,
		ModNicknamePage,
		ModGenderPage,
		ModMottoPage,
		QuestionPage,
		ShopPage,
		FriendAddPage,
		FriendRequestPage,
		FriendByContactPage,
		UserDetailPage,
		SignupCompletePage,
		SignupPage,
		SigninPage,
		FriendListPage,
		FriendNewPage,
		ReorderPage,
		DownloadPage,
		SettingPage,

		/*components*/
		ChatMsg,
		Highlight,

		/*pipes*/
		GenderPipe,
		TimediffPipe
	],
	imports: [
		IonicModule.forRoot(MyApp, {
			// activator:"highlight",     //activator:"ripple",
			// tabsHideOnSubPages : true,
			// tabsHighlight:true,
			backButtonText: '返回',
			mode: 'ios'

		})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,

		/*pages*/
		IndexPage,
		ChatPage,
		ChatContentPage,
		DailyPage,
		DiscoverPage,
		MePage,
		MeDetailPage,
		ModAvatarPage,
		ModNicknamePage,
		ModMottoPage,
		ModGenderPage,
		QuestionPage,
		ShopPage,
		FriendAddPage,
		FriendRequestPage,
		FriendByContactPage,
		UserDetailPage,
		SignupCompletePage,
		SignupPage,
		SigninPage,
		FriendListPage,
		FriendNewPage,
		ReorderPage,
		DownloadPage,
		SettingPage,

		/*components*/
		// ChatMsg,
		// Highlight,
	],
	providers: [
		Storage,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },

		MsgService,
		UserService,
		BackEnd,

		{
			provide: MyHttp,
			useFactory: myHttpFactory,
			deps: [XHRBackend, RequestOptions, LoadingController]
		},

	]
})
export class AppModule { }
