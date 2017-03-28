import { Component } from '@angular/core';

import { AuthService, WpService } from '../../services/index';

import { NavController } from 'ionic-angular';



@Component({
    templateUrl: './profile.html',
})
export class ProfilePage {
    userInfo: any = {};
    hideSignUpView:Boolean = true;
    registerString: string = 'register';
    iconname:string = 'person-add';
    personInfo: string = "comments";

    commentsUser : any;

    constructor(
        private auth: AuthService,
        private wp: WpService,
        public navCtrl:NavController) {
            console.log(this.auth.user);
            if(this.auth.authenticated()){
              this.loadCommentsByUser(this.auth.user.user_email);
            }
    }

    getInfo() {
        console.log(this.auth.token);
        this.wp.getCurrentUserProfile().subscribe(data => {
            console.log(data);
        }, (error) => {
        });
    }

    userAddComment() {
        let obj = {
            author: 1,
            content: 'YourCommentHere1',
            post: 55
        };

        this.wp.userAddComment(obj)
            .subscribe(data => {
                console.log(data);
            });
    }
    loadCommentsByUser(useremail) {
        this.wp.getCommentsByUserName({"author_email": useremail}).subscribe(
            data => {
                console.log(data);
                this.commentsUser = data;
            },
            error => {}
        );
    }

    logout() {
        this.auth.logout();
    }
    register(){
      console.log('register()');
      this.hideSignUpView = !this.hideSignUpView;
      if(this.hideSignUpView){
        this.registerString = 'register';
        this.iconname = 'person-add';
      }else{
        this.registerString = 'login';
        this.iconname = 'log-in';
      }
      // this.navCtrl.push(SignupPagePage);
    }

}
