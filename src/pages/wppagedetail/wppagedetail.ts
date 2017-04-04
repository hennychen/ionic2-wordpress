import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/*
  Generated class for the Wppagedetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wppagedetail',
  templateUrl: 'wppagedetail.html',
})
export class WppagedetailPage {
  page:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = this.navParams.get('page');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WppagedetailPage');
  }

}
