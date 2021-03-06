import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Home } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { UtilService } from '../services/index';
import { CategoryPage } from '../pages/category/category';
import { WppagePage } from '../pages/wppage/wppage';
import { MediaListPage } from '../pages/media-list/media-list';
import { PostEditorPage } from '../pages/post-editor/post-editor';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public up: UtilService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '主页', component: Home},
      { title: '个人', component: ProfilePage },
      { title: '发布文章',component: PostEditorPage },
      { title: '分类', component: CategoryPage },
      { title: '页面', component: WppagePage },
      { title: '素材', component: MediaListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      //let toast = this.up.getToast("You are not connected to Internet.");
      //toast.present();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
