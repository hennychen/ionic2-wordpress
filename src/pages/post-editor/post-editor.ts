import { Component } from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
// import { TinyEditorComponent } from '../components/tiny-editor/tiny-editor';
import { MediaListPage } from '../media-list/media-list';
import { TinyEditorComponent } from '../components/tiny-editor/tiny-editor';
/*
  Generated class for the PostEditor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post-editor',
  templateUrl: 'post-editor.html'
})
export class PostEditorPage {
  insertImg:any;
  public publishContent:any;//发布内容
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {}

  keyupHandler(event){
    // console.log(event);
    this.publishContent = event;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PostEditorPage');

  }
  //发布文章
  publishPost(){

  }
  //展示素材列表
  showImageList(event){
    console.log(event);

    let modal =  this.modalCtrl.create(MediaListPage,{ "type": "tinyedtor" });
    modal.onDidDismiss(data => {
       console.log(data);
       this.insertImg = data;
    });
    modal.present();

    // console.log(this.insertImg);

  }

}
