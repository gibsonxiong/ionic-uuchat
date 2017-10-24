import { Component, ViewChild, Renderer, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Platform, App, NavController, NavParams, Content, ActionSheetController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { MsgService } from '../../services/msg';
import { UserService } from '../../services/user';
import { SystemService } from '../../services/system';
import { BackEnd } from '../../providers/backend';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/filter';

import { UPLOAD_HOST } from '../../config/config';

import { UserDetailPage } from '../user-detail/user-detail';
import { ReorderPage } from '../reorder/reorder';
import { clone, getDiff } from '../../utils/utils';
import { fileUtils } from '../../utils/file-utils';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Keyboard } from '@ionic-native/keyboard';
import { File as CordovaFile } from '@ionic-native/file';


@Component({
    selector: 'cy-chat-content-page',
    templateUrl: 'chat-content.html',

})
export class ChatContentPage {
    private timer;
    private isAudio = false;
    private isLoading = false;
    private isShowFace = false;

    private relationId: string;
    private msgList: any[] = [];
    private faceItems = [];
    private ownId: string;
    private form: FormGroup;

    // private userSubscription;
    private msgListSubscription;
    private newMsgSubscription;

    private pageIndexSubject = new BehaviorSubject<number>(1);

    private pageTitle = '';

    //语音
    private recordFileSrc = 'record.mp3';
    private recordFile: MediaObject;
    private recording = false;
    private volumeImgSrc;
    private recordDuration = 0;
    private media_timer;
    private recordDuration_timer;

    @ViewChild(Content) contentComponent;
    @ViewChild('header') header;
    @ViewChild('input') input;
    @ViewChild('audio') audio;

    constructor(
        private _ngZone: NgZone,
        private _ref: ChangeDetectorRef,
        private navCtrl: NavController,
        private actionSheetCtrl: ActionSheetController,
        private params: NavParams,
        private fb: FormBuilder,
        private renderer: Renderer,
        private platform: Platform,
        private storage: Storage,
        private media: Media,
        private keyboard: Keyboard,
        private cordovaFile: CordovaFile,
        private userService: UserService,
        private msgService: MsgService,
        private systemService: SystemService,
        private backEnd: BackEnd,
    ) {

        this.relationId = params.data.relationId;
        this.pageTitle = params.data.chatName;
        this.ownId = backEnd.getOwnId();

        // 

        this.form = fb.group({
            content: ['', Validators.required]
        });
        //
    }

    ngOnInit() {
        for (var i = 100; i <= 219; i++) {
            var suffix = i < 200 ? '.gif' : '.png';
            this.faceItems.push({
                src: './assets/img/face/wechat/' + i + suffix,
                name: '表情' + i
            });
        }


        this.msgListSubscription =
            Observable.combineLatest(
                this.msgService.msgList$,
                this.pageIndexSubject
            )
                .subscribe(
                combine => {
                    let msgList = combine[0];
                    let pageIndex = combine[1];

                    msgList = msgList.filter(msg => {
                        return msg.relationId === this.relationId;
                    });
                    msgList = msgList.filter((msg, i) => {
                        return i > (msgList.length - 1) - pageIndex * 10;
                    });

                    this.msgList = msgList;
                    // let scrollHeight = this.contentComponent.scrollHeight;
                    // this._ref.detectChanges();

                    // if(first){
                    //     this.scrollToBottom();
                    //     first = false;
                    // }

                    this.updateDiff();

                    // setTimeout(()=> {
                    //     this.contentComponent.resize();
                    //     this.contentComponent.scrollTo(null, this.contentComponent.scrollHeight- scrollHeight );
                    //     this.isLoading = false;
                    // }, 3000);

                }
                );

        this.newMsgSubscription = this.msgService.newMsg$
            .filter(msg => msg.relationId === this.relationId)
            .subscribe((msg) => {
                if (msg.length === 0) return;
                this.scrollToBottom();
            });


        this.contentComponent.ionScrollStart.subscribe(
            e => {
                this.hideFace();
            },
            err => {
                console.log(err);
            }
        );

        this.contentComponent.ionScrollEnd.subscribe(
            e => {
                var scrollTop = this.contentComponent.scrollTop;

                if (scrollTop < 10 && !this.isLoading) {
                    this.isLoading = true;
                    this.pageIndexSubject.next(this.pageIndexSubject.getValue() + 1);
                }
            },
            err => {
                console.log(err);
            }
        );


        this.timer = setInterval(() => {
            this.updateDiff();
        }, 60000);




    }

    // ngAfterViewInit() {
    //     //input自动得焦
    //     setTimeout(() => {
    //         this.renderer.setElementAttribute(this.input.input.nativeElement, 'autofocus','autofocus');
    //         this.renderer.invokeElementMethod(this.input.input.nativeElement, 'focus');
    //     }, 1000);

    // }

    ngOnDestroy() {
        this.msgListSubscription.unsubscribe();
        this.newMsgSubscription.unsubscribe();

        clearInterval(this.timer);
    }

    ionViewWillEnter() {
        //读取消息
        this.msgService.readChat(this.relationId);
    }

    ionViewWillLeave() {
        //取消已读
        this.msgService.stopReadChat();
    }

    updateDiff() {
        this.msgList.forEach(function (item) {
            item['timediff'] = getDiff(item.sendTime);
            return item;
        });
    }



    //语音
    recordToggle() {
        let supportCordova = this.platform.is('cordova');

        if (!supportCordova) return this.systemService.showToast('该功能暂不支持浏览器，请下载APP体验');

        //语音
        if (!this.recording) {
            this.cordovaFile.createFile(this.cordovaFile.dataDirectory, this.recordFileSrc, true).then(() => {
                this.recording = true;

                this.recordFile = this.media.create(this.cordovaFile.dataDirectory.replace(/^file:\/\//, '') + this.recordFileSrc);

                this.recordFile.startRecord();

                this.startTime();
                this.setVolumeImgSrc(0);

                this.media_timer = setInterval(() => {
                    // get media amplitude
                    this.recordFile.getCurrentAmplitude()
                        .then((amp) => {
                            console.log(amp * 100);
                            this.setVolumeImgSrc(amp * 100);
                        })
                        .catch(err => {
                            console.log("Error getting amp=" + err);
                        });
                }, 200);
            });

        } else {
            clearInterval(this.media_timer);
            this.recording = false;
            this.recordFile.stopRecord();
            this.stopTime();

            this.msgService.sendAudioMsg(this.relationId, this.cordovaFile.dataDirectory.replace(/^file:\/\//, '') + this.recordFileSrc, this.recordDuration);

            //释放内存
            this.recordFile.release();
            this.cordovaFile.removeFile(this.cordovaFile.dataDirectory, this.recordFileSrc);
            this.recordFile = null;
        }


    }


    //取消录音
    cancelRecord() {
        if (this.recordFile && this.recording) {
            this.recording = false;
            this.recordFile.stopRecord();
            this.stopTime();
            this.recordFile.release();
        }
    }

    playRecord(audioSrc) {
        this.audio.nativeElement.src = UPLOAD_HOST + audioSrc;
    }

    setVolumeImgSrc(persents) {
        persents = persents * 4;     //优化点
        persents = Math.max(0, Math.min(persents, 100));
        let i = Math.ceil(persents * 0.6 / 60 * 6);

        this.volumeImgSrc = `assets/img/volume${i}.png`;
    }

    //录音计时
    startTime() {
        this.recordDuration = 0;
        this.recordDuration_timer = setInterval(() => {
            this.recordDuration++;
        }, 1000);
    }

    //录音停止计时
    stopTime() {
        clearInterval(this.recordDuration_timer);
    }


    //切换语音或文本
    switchInput() {
        this.isAudio = !this.isAudio;
        this.cancelRecord();
        this.hideFace();
    }



    scrollToBottom() {
        this.contentComponent.scrollToBottom();
    }

    onInputFocus() {
        // this.scrollToBottom();

        //解决手机键盘弹出后遮挡住输入框
        if (this.platform.is('mobileweb')) {
            setTimeout(() => {
                this.input.input.nativeElement.scrollIntoView(true);
                this.input.input.nativeElement.scrollIntoViewIfNeeded();

            }, 200);
        }

    }


    sendMsg() {
        if (this.form.invalid) return;

        let content = this.form.value.content;

        if (/^\s+$/g.test(content)) return this.systemService.showToast('不能发送空白消息');

        this.msgService.sendMsg(this.relationId, this.encodeMsgContent(content));

        this.form.controls['content'].setValue('');

        // this.scrollToBottom();

        //得焦
        setTimeout(() => {
            this.renderer.invokeElementMethod(this.input.input.nativeElement, 'focus');
        }, 0);
    }

    gotoReorderPage() {
        this.navCtrl.push(ReorderPage);
    }

    gotoUserDetailPage(userId) {
        this.navCtrl.push(UserDetailPage, { userId });
    }

    //上传图片
    presentActionSheet() {
        if (this.platform.is('cordova')) {
        	let actionSheet = this.actionSheetCtrl.create({
        		buttons: [
                    {
                        text: '拍照',
                        handler: () => {
                            this.setByPhotograph();
                        }
                    }, {
                        text: '从手机相册选择',
                        handler: () => {
                            this.setByAlbum();
    
                        }
                    }, {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
    
                        }
                    }
                ]
        	});
            actionSheet.present();
            
        }else{
            this.setByAlbum_html5();
        }
    }

    //通过拍照设置头像
    setByPhotograph() {
    }

    //通过手机相册设置头像
    setByAlbum() {
    }

    setByAlbum_html5() {
        fileUtils.openAlbum()
            .then(file => {
                this.msgService.sendImgMsg(this.relationId, file);
            });
    }

    showFace() {
        this.isShowFace = true;
        this.contentComponent.resize();
    }

    hideFace() {
        this.isShowFace = false;
        this.contentComponent.resize();
    }

    toggleFace() {
        this.isShowFace = !this.isShowFace;
        this.contentComponent.resize();
    }

    insertFace(src) {
        this.input.insertImg(src);
    }

    encodeMsgContent(content = '') {
        content = content.replace(/<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*["']?[\s\t\r\n]*([^\s\t\r\n"'<>]*)[^<>]*?\/?[\s\t\r\n]*>/gi, (match, src) => {
            var faceItem = this.faceItems.filter(item => item.src == src)[0];
            if (faceItem) {
                return '[' + faceItem.name + ']';
            } else {
                return match;
            }
        });
        content = content.replace(/&nbsp;?/gi, function (match) {
            return ' ';
        });
        return content;

    }

    decodeMsgContent(content = '') {
        content = content.replace(/\s/gi, function (match) {
            return '&nbsp;';
        });
        content = content.replace(/\[([^\]]*)\]/gi, (match, name) => {
            var faceItem = this.faceItems.filter(item => item.name == name)[0];
            if (faceItem) {
                return '<img src="' + faceItem.src + '" />';
            } else {
                return match;
            }

        });
        return content;
    }

    // //拍照
    // photograph(): Promise<string> {
    // 	var options = {
    // 		allowEdit: true,
    // 		targetWidth: 400,
    // 		targetHeight: 400,
    // 	};

    // 	return this.camera.getPicture(options);
    // }

    // //打开手机相册
    // openAlbum(): Promise<string> {

    // 	var options = {
    // 		maximumImagesCount: 1
    // 	};
    // 	return this.imagePicker.getPictures(options).then(val => {
    // 		return val[0];
    // 	})
    // }

    // //裁剪图片
    // cropImg(fileURI): Promise<string> {
    // 	return this.crop.crop(fileURI, { quality: 100 });
    // }


}
