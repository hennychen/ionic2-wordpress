import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { WpService } from '../../services/index';

@Component({
    templateUrl:  'post-detail.html'
})

export class PostDetail {
    selectedPost : any = {
      title: {rendered: ''},
      id: null,
      content: {rendered: ''}
    }
    isEditMode: boolean = false;


    comment: any = {
        content: {rendered: ''},
        author: null,
        post: null
    }
    params: any ={};

    constructor(private nav: NavController,public navParams: NavParams,public wp:WpService) {

      let postidParams = this.navParams.get('postID');
      if(postidParams){
        // this.postId = postidParams;
        console.log('-----'+this.navParams.get('postID'));
        this.getPostByID(postidParams);
      }else{
        this.selectedPost = this.navParams.get('post');
      }

    }
    getPostByID(postidParams){

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

    editCommentChanged(selecteComment) {
        selecteComment.content.rendered = selecteComment.content.rendered.replace(/<br \/>/g, '');
        this.comment = selecteComment;
        this.isEditMode = true;
    }

}
