import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


import { IndexPage } from '../pages/index/index';
import { LoginPage } from '../pages/login/login';
/*test*/
// import { SignupPage } from '../pages/signup/signup';
// import { TimelineAddPage } from '../pages/timeline-add/timeline-add';


@Component({
	templateUrl: 'app.html',
})
export class MyApp {

	rootPage;

	constructor(
		private platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private storage: Storage,
		private alertCtrl: AlertController,
	) {


		//通过token判断是否登录过
		storage.get('token').then(token => {

			if (token) {
				this.rootPage = IndexPage;
			} else {
				this.rootPage = LoginPage;
			}
			// this.rootPage = SignupPage;
			// this.rootPage = TimelineAddPage;

			

		});

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();

		});
	}

	ngOnInit() {

	}

	// 前往应用市场进行打分鼓励  
	// goToMarket() {
	// 	AppVersion.getPackageName().then((data) => {

	// 		if (this.platform.is('ios')) {
	// 			window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://  
	// 		} else if (this.platform.is('android')) {
	// 			//window.open('market://details?id=' + data);  

	// 			WebIntent.startActivity({
	// 				action: 'android.intent.action.VIEW',
	// 				url: 'market://details?id=' + data
	// 			}).then(() => { }, (err) => {
	// 				this.noticeSer.showToast('提示：当前手机暂不支持打分鼓励功能哦，请确保安装了应用市场APP~');
	// 			});

	// 		} else {
	// 			this.noticeSer.showToast('提示：当前手机暂不支持打分鼓励功能哦，请确保安装了应用市场APP~');
	// 		}

	// 	}, (err) => {

	// 		alert('PackageName - Error: ' + err);
	// 	});
	// }

}

// window.onerror = function (msg, url, line) {
// 	var idx = url.lastIndexOf("/");
// 	if (idx > -1) {
// 		url = url.substring(idx + 1);
// 	}
// 	alert("ERROR in " + url + " (line #" + line + "): " + msg);
// 	return false;
// };

document.addEventListener("resume", function () {
	console.log("应用回到前台运行！");
}, false);

document.addEventListener("resize", function () {
	console.log("resize");
}, false);
document.addEventListener("pause", function () {
	console.log("应用进入到后台！");
}, false);
