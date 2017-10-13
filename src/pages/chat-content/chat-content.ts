import { Component, ViewChild, Renderer, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Platform, App, NavController, NavParams, Content } from 'ionic-angular';
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
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'cy-chat-content-page',
    templateUrl: 'chat-content.html',

})
export class ChatContentPage {
    private timer;
    private isAudio = false;
    private isLoading = false;

    private relationId: string;
    private msgList: any[] = [];
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
    private media_Timer;
    private recordDuration_Timer;

    @ViewChild(Content) contentComponent;
    @ViewChild('input') input;
    @ViewChild('audio') audio;

    constructor(
        private _ngZone: NgZone,
        private _ref:ChangeDetectorRef,
        private navCtrl: NavController,
        private params: NavParams,
        private fb: FormBuilder,
        private renderer: Renderer,
        private platform: Platform,
        private storage: Storage,
        private media: Media,
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
                    msgList = msgList.filter((msg,i)=>{
                        return i > (msgList.length - 1) - pageIndex * 10;
                    });

                    this.msgList = msgList;
                    let scrollHeight = this.contentComponent.scrollHeight;
                    this._ref.detectChanges();

                    this._ngZone.onStable.subscribe(()=>{
                        console.log('onStable');
                    });
                    this._ngZone.onMicrotaskEmpty.subscribe(()=>{
                        console.log('onMicrotaskEmpty');
                    });
                    this._ngZone.onUnstable.subscribe(()=>{
                        console.log('onUnstable');
                    });


                    // setTimeout(()=> {
                    //     this.contentComponent.resize();
                    //     this.contentComponent.scrollTo(null, this.contentComponent.scrollHeight- scrollHeight );
                    //     this.isLoading = false;
                    // }, 3000);
                    
                }
            );

        this.newMsgSubscription = this.msgService.newMsg$
            .filter(msg => msg.relationId === this.relationId)
            .subscribe(() => {
                this.scrollToBottom();
            });

        this.contentComponent.ionScrollEnd.subscribe(
            ()=>{
                var scrollTop = this.contentComponent.scrollTop;
                
                if(scrollTop < 10 && !this.isLoading){
                    this.isLoading = true;
                    this.pageIndexSubject.next(this.pageIndexSubject.getValue()+1);
                }
            }
        );


        // this.updateDiff();
        // this.timer = setInterval(() => {
        //     this.updateDiff();
        // }, 60000);


    }

    updateDiff() {
        this.msgList.forEach(function (item) {
            item['timediff'] = getDiff(item.sendTime);
            return item;
        });
    }


    ngOnDestroy() {
        // this.userSubscription.unsubscribe();
        this.msgListSubscription.unsubscribe();
        this.newMsgSubscription.unsubscribe();

        clearInterval(this.timer);
    }

    //语音
    recordToggle() {
        let nonsupport = this.platform.is('mobileweb');

        if (nonsupport) return this.systemService.showToast('发送语音暂不支持浏览器，请下载APP体验');

        //语音
        if (this.recordFile) {
            this.recordFile.release();
        }

        this.recordFile = this.media.create(this.recordFileSrc);

        if (!this.recording) {
            this.recording = true;
            this.recordFile.startRecord();

            this.startTime();
            this.setVolumeImgSrc(0);
            this.media_Timer = setInterval(() => {
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

        } else {
            clearInterval(this.media_Timer);
            this.recording = false;
            this.recordFile.stopRecord();
            this.stopTime();
            this.msgService.sendAudioMsg(this.relationId, this.recordFileSrc, this.recordDuration);


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
        this.recordDuration_Timer = setInterval(() => {
            this.recordDuration++;
        }, 1000);
    }

    stopTime() {
        clearInterval(this.recordDuration_Timer);
    }


    //切换语音或文本
    switchInput() {
        this.isAudio = !this.isAudio;
        this.cancelRecord();
    }

    ionViewWillEnter() {
        //读取消息
        this.msgService.readChat(this.relationId);

        this.scrollToBottom();
    }

    ionViewWillLeave() {
        //取消已读
        this.msgService.stopReadChat();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.contentComponent.scrollTo(null, this.contentComponent.scrollHeight);
        }, 0);
    }


    sendMsg() {
        if (this.form.invalid) return;

        let content = this.form.value.content;

        if (/^\s+$/g.test(content)) return this.systemService.showToast('不能发送空白消息');

        this.msgService.sendMsg(this.relationId, content);

        this.form.controls['content'].setValue('');

        this.scrollToBottom();
        //得焦
        setTimeout(() => {
            this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
        }, 0);
    }

    gotoReorderPage() {
        this.navCtrl.push(ReorderPage);
    }

    gotoUserDetailPage(userId) {
        this.navCtrl.push(UserDetailPage, { userId });
    }


}
