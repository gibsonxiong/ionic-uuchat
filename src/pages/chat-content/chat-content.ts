import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { App, NavController, NavParams, Content } from 'ionic-angular';
import { MediaPlugin } from 'ionic-native';
import { MsgService } from '../../services/msg';
import { UserService } from '../../services/user';
import { Storage } from '@ionic/storage';
import { Transfer } from 'ionic-native';
import 'rxjs/add/operator/filter';

import { HOST } from '../../config';

import { UserDetailPage } from '../user-detail/user-detail';
import { ReorderPage } from '../reorder/reorder';

@Component({
    selector: 'cy-chat-content-page',
    templateUrl: 'chat-content.html',

})
export class ChatContentPage {
    private isAudio = false;

    private relationId: string;
    private msgList: any[] = [];
    private ownId: string;
    private form: FormGroup;

    private userSubscription;
    private msgListSubscription;
    private newMsgSubscription;

    private pageTitle = '';

    //语音
    private recordFileSrc = 'record.mp3';
    private recordFile;
    private recording = false;

    @ViewChild(Content) contentComponent;
    @ViewChild('audio') audio;

    constructor(
        private navCtrl: NavController,
        private params: NavParams,
        private fb: FormBuilder,
        private storage: Storage,
        private userService: UserService,
        private msgService: MsgService
    ) {

        this.relationId = params.data.relationId;
        this.pageTitle = params.data.chatName;

        this.form = fb.group({
            content: ['', Validators.required]
        });


    }

    ngOnInit() {

        this.userSubscription = this.userService.own$.subscribe(
            own => {
                this.ownId = own._id;
            }
        );

        this.msgListSubscription = this.msgService.msgList$.subscribe(
            msgList => {
                this.msgList = msgList.filter(msg => {
                    return msg.relationId === this.relationId;
                });


            }
        );

        this.newMsgSubscription = this.msgService.newMsg$
            .filter(msg => msg.relationId === this.relationId)
            .subscribe(() => {
                this.scrollToBottom();
            });


    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
        this.msgListSubscription.unsubscribe();
        this.newMsgSubscription.unsubscribe();
    }

    //语音
    recordToggle() {
        //语音
        if (this.recordFile) {
            this.recordFile.release();
        }

        this.recordFile = new MediaPlugin(this.recordFileSrc);

        if (!this.recording) {
            this.recording = true;
            this.recordFile.startRecord();
        } else {
            this.recording = false;
            this.recordFile.stopRecord();
            this.msgService.sendAudioMsg(this.relationId, this.recordFileSrc);
            
        }
    }

    //取消录音
    cancelRecord(){
        if(this.recordFile && this.recording ){
            this.recording = false;
            this.recordFile.stopRecord();
            this.recordFile.release();
        }
    }

    playRecord(audioSrc) {
        this.audio.nativeElement.src = audioSrc;
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
        this.contentComponent.scrollTo(null, this.contentComponent.scrollHeight);
    }

    sendMsg() {
        let content = this.form.value.content;

        this.msgService.sendMsg(this.relationId, content);

        this.form.controls['content'].setValue('');
    }

    gotoReorderPage() {
        this.navCtrl.push(ReorderPage);
    }

    gotoUserDetailPage(userId) {
        this.navCtrl.push(UserDetailPage, { userId });
    }


}
