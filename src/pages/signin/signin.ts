import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { NavController,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup';
import { IndexPage } from '../index/index';
import { UserService } from '../../services/user';
import { MyHttp } from '../../providers/my-http';
import { SocketIO } from '../../providers/socket-io';

/*UserValidator*/
class UserValidators{

  static existsAsync()  {

    return function(contorl):Promise< {[key:string]:any} > {
      return new Promise((resole,reject) => {
        setTimeout(()=>{
            if(contorl.value ==='false'){
              resole({ existsAsync:true });  
            }else{
              resole(null);  
            }
            
        },500);
      });
    }

  }
}


@Component({
  selector:'cy-signin-page',
  templateUrl: 'signin.html'
})
export class SigninPage {

   public form:FormGroup;

  constructor(
  	public navCtrl:NavController,
    public toastCtrl:ToastController,
    public builder:FormBuilder,
    public storage :Storage,
    public userservice :UserService,
    public myHttp:MyHttp,
    public socketIO: SocketIO
  	) {

    this.form =builder.group({
      username:['test1',null, UserValidators.existsAsync()],
      password:['123456',[Validators.required, Validators.minLength(2)]]
    });

  }

  //登录
  signin(data):void{
      let that = this;

  	 this.userservice.signin(this.form.value).subscribe(
           res => {
              if(res.code){
                  this.presentToast(res.msg);
                  return;
              }
              let token =  res.data.token;
              console.log('signin',token);
              that.storage.set('token',token)
                          .then(token=>{
                              that.navCtrl.setRoot(IndexPage);
                          })
                          .catch(err=>{
                             alert('登录失败！');
                          });
              
          },
          err => {
            this.presentToast(err);
          }
      );
  }

  presentToast(msg):void{
    let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top'
    });
    toast.present();
  }


  gotoSignupPage():void{
  	this.navCtrl.push(SignupPage);
  }

    //比 ngOnInit 快
  ionViewWillLoad(){
      console.log('ionViewWillLoad');
  }

  ngOnInit(){
      console.log('ngOnInit');
  }


  ionViewDidLoad(){
      console.log('ionViewDidLoad');
  }

  ionViewWillEnter(){
      console.log('ionViewWillEnter');
  }

  ionViewDidEnter(){
      console.log('ionViewDidEnter');
  }

  ionViewWillLeave(){
      console.log('ionViewWillLeave');
  }

  ionViewDidLeave(){
      console.log('ionViewDidLeave');
  }

   ionViewWillUnload(){
      console.log('ionViewWillUnload');
  }

  ionViewDidUnload(){
      console.log('ionViewDidUnload');
  }


}
