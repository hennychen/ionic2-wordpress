import { Component } from '@angular/core';

/*
  Generated class for the Mediaupload component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'mediaupload',
  templateUrl: 'mediaupload.html'
})
export class MediauploadComponent {

  text: string;

  constructor() {
    console.log('Hello Mediaupload Component');
    this.text = 'Hello World';
  }

}
