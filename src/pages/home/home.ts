import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController ,NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { PostDetail } from '../postDetail/post-detail.component';
import { StoresPosts } from '../storesPosts/stores-posts.component';
import { WpService } from '../../services/index';

@Component({
    templateUrl: 'home.html'
})

export class Home {
    hideSearch:Boolean = true;
    posts: any;
    loader: any;
    isLoading: boolean = false;
    noMoreData: boolean = false;

    public hidePostList:Boolean = false;//搜索列表是否显示
    searchPosts:any;//搜索结果
    category:any = {};
    // 查询参数
    params = {
    };

    constructor(
        public navparams:NavParams,
        public navCtrl: NavController,
        private http: Http,
        private nav:NavController,
        private wp: WpService
    ) {
            this.params['page'] = 1;
            this.isLoading = true;

            this.category = this.navparams.get('category');
            console.log(this.category);
            if(this.category){
                this.params['categories'] = this.category.id;
            }

            this.wp.getPosts(this.params)
                .subscribe(
                    data => {
                        this.posts = data;
                        this.isLoading = false;
                    },
                    error => {
                        this.isLoading = false;
                        console.log(error);
                    }
                );

    }
    // 搜索框
    toggleSearch() {
// 显示和隐藏搜索框
        this.hideSearch = !this.hideSearch;
        this.hidePostList = !this.hideSearch;
    }
    // 搜索关键字
    searchItem(ev:any){
        // set val to the value of the searchbar
        let val = ev.target.value;

        console.log(val);
        this.params['search'] = val;
        this.wp.getPosts(this.params)
            .subscribe(
                data => {
                  this.searchPosts = data;
                  this.hidePostList = !this.hideSearch;

                },
                error => {
                    console.log(error);
                }
            );

    }

    // 下拉刷新
    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        this.params['page'] = 1;
        this.wp.getPosts(this.params)
            .subscribe(
                data => {
                  //判断当前是否是搜索列表
                    if(this.hidePostList){
                      this.searchPosts = data;
                    }else{
                      this.posts = data;
                      refresher.complete();
                    }

                },
                error => {
                    console.log(error);
                    refresher.complete();
                }
            );

    }

    ionViewDidEnter() {

    }
    //点击跳转到详情
    postTapped(event, post) {
        this.nav.push(PostDetail, {
            post: post
        });
    }

    storeTapped(event, store) {
        console.log(store);
        this.nav.push(StoresPosts, {
            store: store
        });
    }

    loadMore(infiniteScroll) {
        this.params['page'] = this.params['page'] + 1;
        console.log(this.params['page']);

        this.wp.getPosts(this.params)
            .subscribe(
                data => {
                    for(let i = 0; i< data.length; i++) {
                        this.posts.push(data[i]);
                    }

                    infiniteScroll.complete();
                },
                error => {
                    console.log(error);
                    infiniteScroll.complete();
                }
            );
    }

}
