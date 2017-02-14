import { NgModule, ErrorHandler } from '@angular/core';
import { XHRBackend ,RequestOptions} from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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
import { JokePage } from '../pages/joke/joke';
import { ShopPage } from '../pages/shop/shop';
import { FriendAddPage } from '../pages/friend-add/friend-add';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { FriendListPage } from '../pages/friend-list/friend-list';
import { FriendNewPage } from '../pages/friend-new/friend-new';
import { FriendRequestPage } from '../pages/friend-request/friend-request';
import { ImgCutterPage } from '../pages/img-cutter/img-cutter';
import { ReorderPage } from '../pages/reorder/reorder';


/*components*/
import { ChatMsg } from '../components/chat-msg/chat-msg';

/*services*/
import { UserService } from '../services/user';
import { MsgService } from '../services/msg';

import {MyHttp} from '../providers/my-http';
import {SocketIO} from '../providers/socket-io';

/*pipes*/
import { GenderPipe } from '../pipes/gender';

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
    JokePage,
    ShopPage,
    FriendAddPage,
    FriendRequestPage,
    UserDetailPage,
    SignupPage,
    SigninPage,
    FriendListPage,
    FriendNewPage,
    ImgCutterPage,
    ReorderPage,

    /*components*/
    ChatMsg,
    Highlight,

    /*pipes*/
    GenderPipe,
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
      // activator:"highlight",     //activator:"ripple",
      // tabsHideOnSubPages : true,
      // tabsHighlight:true,
      mode:'ios'

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
    JokePage,
    ShopPage,
    FriendAddPage,
    FriendRequestPage,
    UserDetailPage,
    SignupPage,
    SigninPage,
    FriendListPage,
    FriendNewPage,
    ImgCutterPage,
    ReorderPage,

    /*components*/
    // ChatMsg,
    // Highlight,
  ],
  providers: [
     Storage,
     {provide: ErrorHandler, useClass: IonicErrorHandler},

     MsgService,
     UserService,
     SocketIO,
     {
          provide: MyHttp,
          useFactory: (backend: XHRBackend, defaultOptions: RequestOptions) =>{
            return new MyHttp(backend, defaultOptions);
          },
          deps: [XHRBackend, RequestOptions]
      },
    
  ]
})
export class AppModule {}
