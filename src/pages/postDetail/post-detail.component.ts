import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { WpService } from '../../services/index';
// import { SocialSharing } from '@ionic-native/social-sharing';
@Component({
    templateUrl: 'post-detail.html',
   
})

export class PostDetail {
    selectedPost: any = {
        title: { rendered: '' },
        id: null,
        content: { rendered: '' }
    }
    isEditMode: boolean = false;


    comment: any = {
        content: { rendered: '' },
        author: null,
        post: null
    }
    params: any = {};

    constructor(public toastCtrl: ToastController, private nav: NavController, public navParams: NavParams, public wp: WpService) {

        let postidParams = this.navParams.get('postID');
        if (postidParams) {
            // this.postId = postidParams;
            console.log('-----' + this.navParams.get('postID'));
            this.getPostByID(postidParams);
        } else {
            this.selectedPost = this.navParams.get('post');

        }

    }
    // shareQQ() {
    //     let qq = (<any>window).QQSDK;
    //     var args = {};
    //     console.log(this.selectedPost.title.rendered + this.selectedPost.link);
    //     var title = this.selectedPost.title.rendered;
    //     var url = this.selectedPost.link;
    //     var imagurl = this.selectedPost.better_featured_image.source_url ? this.selectedPost.better_featured_image.source_url : "http://vipho.cn/wp-content/uploads/2017/04/cropped-logo2-1.jpg";

    //     qq.checkClientInstalled(function () {
    //         var args: any = {};

    //         args.scene = qq.Scene.QQ;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
    //         args.url = url;
    //         args.title = title;
    //         args.description = title;
    //         args.image = imagurl;

    //         qq.shareNews(function () {
    //             this.presentToast('failReason');
    //         }, function (failReason) {
    //             // alert(failReason);
    //             this.presentToast(failReason);
    //         }, args);
    //     }, function () {
    //         // if installed QQ Client version is not supported sso,also will get this error
    //         this.presentToast('您没有安装QQ！');
    //     });

    // }
    getPostByID(postidParams) {

        this.wp.getPostDataByID(postidParams)
            .subscribe(
                data => {
                    this.selectedPost = data;
                    console.log(data);

                },
                error => {

                    console.log(error);
                }
            );
    }
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'middle'
        });
        toast.present();
    }

    editCommentChanged(selecteComment) {
        selecteComment.content.rendered = selecteComment.content.rendered.replace(/<br \/>/g, '');
        this.comment = selecteComment;
        this.isEditMode = true;
    }
    // // 判断邮件是否能分享
    // shareByEmail() {
    //     // Check if sharing via email is supported
    //     this.socialSharing.canShareViaEmail().then(() => {
    //         // Sharing via email is possible
    //         this.presentToast("ispossible");
    //         this.shareEmailContent();

    //     }).catch(() => {
    //         // Sharing via email is not possible
    //         this.presentToast(" is not possible ispossible");
    //     });
    // }
    // // 邮件分享
    // shareEmailContent() {
    //     // Share via email
    //     this.socialSharing.shareViaEmail(this.selectedPost.link + this.selectedPost.content.rendered, this.selectedPost.title.rendered, ['511308538@qq.com']).then(() => {
    //         // Success!
    //         this.presentToast("Success");
    //     }).catch(() => {
    //         // Error!
    //         this.presentToast("error");
    //     });
    // }

    // shareWxSession() {
    //     let wechat = (<any>window).Wechat;
    //     wechat.isInstalled(function (installed) {
    //         if (!installed) {
    //             this.presentToast('您没有安装微信！');
    //             return;
    //         }
    //     }, function (reason) {
    //         this.presentToast("Failed: " + reason);
    //     });
    //     var title = this.selectedPost.title.rendered;
    //     var url = this.selectedPost.link;
    //     var imagurl = this.selectedPost.better_featured_image.source_url ? this.selectedPost.better_featured_image.source_url : "http://vipho.cn/wp-content/uploads/2017/04/cropped-logo2-1.jpg";

    //     wechat.share({
    //         message: {
    //             title: title,
    //             description: title,
    //             thumb: imagurl,
    //             media: {
    //                 type: wechat.Type.LINK,
    //                 webpageUrl: url
    //             }
    //         },
    //         scene: wechat.Scene.SESSION   // share to SESSION
    //     }, function () {
    //         this.presentToast('分享成功');
    //     }, function (reason) {
    //         console.log("Failed: " + reason);
    //         this.presentToast(reason);
    //     });
    // }


    // shareWxTimeLine() {
    //     let wechat = (<any>window).Wechat;
    //     wechat.isInstalled(function (installed) {
    //         if (!installed) {
    //             this.presentToast('您没有安装微信！');
    //             return;
    //         }
    //     }, function (reason) {
    //         this.presentToast("Failed: " + reason);
    //     });
    //     var title = this.selectedPost.title.rendered;
    //     var url = this.selectedPost.link;
    //     var imagurl = this.selectedPost.better_featured_image.source_url ? this.selectedPost.better_featured_image.source_url : "http://vipho.cn/wp-content/uploads/2017/04/cropped-logo2-1.jpg";

    //     wechat.share({
    //         message: {
    //             title: title,
    //             description: title,
    //             thumb: imagurl,
    //             media: {
    //                 type: wechat.Type.LINK,
    //                 webpageUrl: url
    //             }
    //         },
    //         scene: wechat.Scene.TIMELINE   // share to Timeline
    //     }, function () {
    //         this.presentToast('分享成功', 'bottom', 4000);
    //     }, function (reason) {
    //         console.log("Failed: " + reason);
    //     });

    // }

}
