import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WpService } from '../../services/index';
import { WppagedetailPage } from '../wppagedetail/wppagedetail';
/*
  Generated class for the Wppage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wppage',
  templateUrl: 'wppage.html'
})
export class WppagePage {

  pages:Array<any>;
  isLoading: boolean = false;
  // 查询参数
  params = {
  };


  constructor(public navCtrl: NavController, public navParams: NavParams,private wp: WpService) {
    this.isLoading = true;
    this.wp.getPages(this.params)
        .subscribe(pages => {
            this.pages = pages;
            this.isLoading = false;

        }, ()=> {
            this.isLoading = false;
        });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WppagePage');
  }

  openPage(page) {
        this.navCtrl.push(WppagedetailPage, {page: page});
    }

}
