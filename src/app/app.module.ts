import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler, LoadingController } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Media } from '@ionic-native/media';
import { Contacts } from '@ionic-native/contacts';
import { Vibration } from '@ionic-native/vibration';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Keyboard } from '@ionic-native/keyboard';
import { FileTransfer } from '@ionic-native/file-transfer';

import { MyApp } from './app.component';

/*pages*/
import { IndexPage } from '../pages/index/index';
import { ChatPopoverPage } from '../pages/chat-popover/chat-popover';
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
import { VerifyMobilePage } from '../pages/verifymobile/verifymobile';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { FriendListPage } from '../pages/friend-list/friend-list';
import { FriendNewPage } from '../pages/friend-new/friend-new';
import { FriendRequestPage } from '../pages/friend-request/friend-request';
import { FriendByContactPage } from '../pages/friend-by-contact/friend-by-contact';
import { ReorderPage } from '../pages/reorder/reorder';
import { DownloadPage } from '../pages/download/download';
import { SettingPage } from '../pages/setting/setting';
import { TimelineListPage } from '../pages/timeline-list/timeline-list';
import { TimelineAddPage } from '../pages/timeline-add/timeline-add';
import { QRcodePage } from '../pages/qrcode/qrcode';

import { myHttpFactory } from '../factorys';

/*components*/
import { ComponentsModule } from '../components/components.module';

/* pipes */
import { PipesModule } from '../pipes/pipes.module';

/*services*/
import { UserService } from '../services/user';
import { MsgService } from '../services/msg';
import { TimelineService } from '../services/timeline';
import { SystemService } from '../services/system';


import { MyHttp } from '../providers/my-http';
import { BackEnd } from '../providers/backend';

/*validators*/
import { UserValidator } from '../validators/user';


@NgModule({
	declarations: [
		MyApp,

		/*pages*/
		IndexPage,
		ChatPage,
		ChatContentPage,
		ChatPopoverPage,
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
		SignupPage,
		VerifyMobilePage,
		LoginPage,
		FriendListPage,
		FriendNewPage,
		ReorderPage,
		DownloadPage,
		SettingPage,
		TimelineListPage,
		TimelineAddPage,
		QRcodePage,
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp, {
			// activator:"highlight",     //activator:"ripple",
			// tabsHideOnSubPages : true,
			// tabsHighlight:true,
			backButtonText: '返回',
			mode: 'ios'

		}),
		IonicStorageModule.forRoot(),
		PipesModule,
		ComponentsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,

		/*pages*/
		IndexPage,
		ChatPopoverPage,
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
		SignupPage,
		VerifyMobilePage,
		LoginPage,
		FriendListPage,
		FriendNewPage,
		ReorderPage,
		DownloadPage,
		SettingPage,
		TimelineListPage,
		TimelineAddPage,
		QRcodePage

	],
	providers: [
		StatusBar,
		SplashScreen,
		Media,
		Contacts,
		Vibration,
		LocalNotifications,
		BarcodeScanner,
		ImagePicker,
		Camera,
		Crop,
		Keyboard,
		FileTransfer,

		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		SystemService,
		MsgService,
		UserService,
		TimelineService,
		BackEnd,

		{
			provide: MyHttp,
			useFactory: myHttpFactory,
			deps: [XHRBackend, RequestOptions, LoadingController, SystemService, FileTransfer]
		},

		UserValidator,

	]
})
export class AppModule { }
