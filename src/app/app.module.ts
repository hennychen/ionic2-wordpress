import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { MyApp } from './app.component';
import { Home } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { PostDetail } from '../pages/postDetail/post-detail.component';
import { StoresPosts } from '../pages/storesPosts/stores-posts.component';
import { UtilService, AuthService, WpService } from '../services/index';
import { LoginFormComponent } from '../components/loginForm/loginForm.component';
import { CommentsListComponent } from '../components/commentsList/commentsList.component';
import { CommentFormComponent } from '../components/commentForm/commentForm.component';
import { SignupFormComponent } from '../components/signupForm/signupForm.component';
import { CategoryPage } from '../pages/category/category';
import { WppagePage } from '../pages/wppage/wppage';
import { WppagedetailPage } from '../pages/wppagedetail/wppagedetail';
import { HtmlPipe } from '../pipes/htmlPipe';

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => localStorage.getItem('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    Home,
    PostDetail,
    StoresPosts,
    ProfilePage,
    LoginFormComponent,
    CommentsListComponent,
    CommentFormComponent,
    SignupFormComponent,
    CategoryPage,
    WppagePage,
    WppagedetailPage,
    HtmlPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    PostDetail,
    StoresPosts,
    ProfilePage,
    CategoryPage,
    WppagePage,
    WppagedetailPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UtilService,
    AuthService,
    WpService,
    { provide: AuthHttp, useFactory: getAuthHttp, deps: [Http] }
  ]
})
export class AppModule { }
