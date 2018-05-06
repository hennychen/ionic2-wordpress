import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';

import { AuthHttp, JwtHelper } from 'angular2-jwt';
import {SITE_URL, UtilService} from '../index';
import { RequestOptions, Http, Headers } from '@angular/http';
@Injectable()
export class WpService {

    wpApiURL: string = SITE_URL + '/wp-json/wp/v2';
    wpCustomerApiURL: string = SITE_URL+'/wp-json/customapi/v1'
    comments: any = [];
    medias:any = [];
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        private authHttp: AuthHttp,
        private util:UtilService,
        private http: Http,
        private authservice:AuthService
    ) {
    }
    // 获取用户信息
    getCurrentUserProfile() {
        return this.authHttp.get(this.wpApiURL + '/users/me')
            .map(res => {
                res.json();
                console.log(res.json);
            });
    }
    //注册
    signup(paramsObj) {
        let params = this.util.transformRequest(paramsObj);
        console.log(params);
        return this.http.post(this.wpCustomerApiURL + '/createuserdata?' + params, JSON.stringify(paramsObj))
            .map(
                res => res.json()
            );
    }

    // 发送留言
    userAddComment(paramsObj) {
        let params = this.util.transformRequest(paramsObj);
        console.log('sending request');
        return this.authHttp.post(this.wpApiURL + '/comments?' + params, JSON.stringify({}))
            .map(
                res => {
                    let newComment = res.json();
                    this.comments.push(newComment);
                    console.log(this.comments);
                    return newComment;
                }
            );
    }

    // 获取文章分类
    getCategories() {
      return this.http.get(this.wpApiURL + '/categories').map(data => data.json());
    }
    // 修改留言
    userUpdateComment(id, paramsObj) {
        let params = this.util.transformRequest(paramsObj);
        console.log('sending request');
        return this.authHttp.put(this.wpApiURL + '/comments/'+ id + '?' + params, JSON.stringify({}))
            .map(
                res => {
                    let updatedComment = res.json();
                    //this.comments.push(updatedComment);
                    for(let i=0; i<this.comments.length; i++) {
                        if (this.comments[i].id === id) {
                            this.comments[i] = updatedComment;
                            console.log('old', this.comments[i]);
                            break;
                        }
                    }

                    console.log(this.comments);
                    return updatedComment;
                }
            );
    }
    // 获取所有页面
    getPages(paramsObj) {
      let params = this.util.transformRequest(paramsObj);
      return this.http.get(this.wpApiURL + '/pages?' + params ).map(data => data.json());
    }
    // 获取文章数据
    getPosts(paramsObj) {
        let params = this.util.transformRequest(paramsObj);
        return this.http.get(this.wpApiURL + '/posts?' + params)
            .map(res => res.json());
    }
    // 获取文章数据
    getPostDataByID(postsID) {
      console.log(this.wpApiURL + '/posts/' + postsID);
        return this.http.get(this.wpApiURL + '/posts/' + postsID)
            .map(res => res.json());
    }
    // 获取某一文章的留言评论
    getCommentsByPostId(paramsObj) {
        let params = this.util.transformRequest(paramsObj);
        return this.http.get(this.wpApiURL + '/comments?' + params)
            .map(res => {
                this.comments = res.json();
                return this.comments;
            });
    }
    // 删除留言
    deleteComment(comment) {
        return this.authHttp.delete(this.wpApiURL + '/comments/' + comment.id)
            .map(res => {
                console.log(res.json());
                this.comments.splice(this.comments.indexOf(comment), 1)
                return res.json();
            });
    }
    //根据用户来获取用户评论
    getCommentsByUserName(paramsObj){
      let params = this.util.transformRequest(paramsObj);
      return this.http.get(this.wpCustomerApiURL + '/getusercomments?' + params)
          .map(res => {
              this.comments = res.json();
              return this.comments;
          });
    }
    getMedias(paramsObj){
      let params = this.util.transformRequest(paramsObj);
      return this.http.get(this.wpApiURL + '/media?' + params).map(res => {
          this.medias = res.json();
          return this.medias;
      });
    }

    public getCurrentAuthorId(): number {
        let token:any = localStorage.getItem('id_token');
        if(token) {
            token = this.jwtHelper.decodeToken(token);
            return Number(token.data.user.id);
        } else{
            return null;
        }
    }


    public postData(paramsObj){
        console.log(paramsObj);
        let params = this.util.transformRequest(paramsObj);
        console.log('sending request');
        var header = new Headers();
        let auth = 'Bearer ' + this.authservice.token;
        header.append('Authorization', auth);
        header.append('Content-Type', 'application/json');
        
          let options = new RequestOptions({ headers: header });
        this.http.post(this.wpApiURL + '/posts', JSON.stringify(paramsObj), options).map(res => res.json())
            .subscribe(data => {
                console.log('http post result==', this.wpApiURL + '/posts', data);
                
            }, error => {
                console.log('error--', error);// Error getting the data
                
            });
        // return this.authHttp.post(this.wpApiURL + '/posts?' + params, JSON.stringify({})).map(
        //     res => {
        //         let updatedComment = res.json();
                

        //         console.log(this.comments);
        //         return updatedComment;
        //     }
        // );
    }

}
