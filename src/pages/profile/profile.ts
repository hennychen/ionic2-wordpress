import { Component } from '@angular/core';

import { AuthService, WpService } from '../../services/index';

import { NavController } from 'ionic-angular';

import { PostDetail } from '../../pages/postDetail/post-detail.component';

@Component({
    templateUrl: './profile.html',
})

export class ProfilePage {
    userInfo: any = {};
    hideSignUpView:Boolean = true;
    registerString: string = 'register';
    iconname:string = 'person-add';
    personInfo: string = "comments";

    posts: any;
    commentsUser : any;

    constructor(
        private auth: AuthService,
        private wp: WpService,
        public navCtrl:NavController) {
            console.log(this.auth.user);
            if(this.auth.authenticated()){
              this.loadCommentsByUser(this.auth.user.user_email);
              this.getUserPosts(this.wp.getCurrentAuthorId());
            }
    }

    getInfo() {
        console.log(this.auth.token);
        this.wp.getCurrentUserProfile().subscribe(data => {
            console.log(data);
        }, (error) => {
        });
    }
    getUserPosts(authorid){
      this.wp.getPosts({author:authorid})
          .subscribe(
              data => {
                  this.posts = data;

              },
              error => {
                  console.log(error);
              }
          );
    }
//
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
    // get user comments
    loadCommentsByUser(useremail) {
        this.wp.getCommentsByUserName({"author_email": useremail}).subscribe(
            data => {
                console.log(data);
                this.commentsUser = data;
            },
            error => {}
        );
    }
    // logout
    logout() {
        this.auth.logout();
    }
    // 注册登录
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

    //点击跳转到详情
    openPost(postIDParam) {
      console.log(postIDParam);

        this.navCtrl.push(PostDetail, {
            postID: postIDParam
        });
    }

}
