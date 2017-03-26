import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WpService } from '../../services/index';
import { Home } from '../home/home';
/*
  Generated class for the Category page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {
  private list:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private wp: WpService) {
    this.wp.getCategories().subscribe(data => {
      this.list = data;
      console.log(this.list);
    }, ()=> {

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');


  }

  openCategory(category) {
    this.navCtrl.push(Home, {"category": category});
  }

}
