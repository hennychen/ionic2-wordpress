import { Component,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  OnChanges,SimpleChange,OnInit,
  Input,
  Output } from '@angular/core';
  import 'tinymce';
  import 'tinymce/themes/modern';

  import 'tinymce/plugins/table';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/preview';
  declare var tinymce: any;

/*
  Generated class for the TinyEditor component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/


@Component({
  selector: 'tiny-editor',
  templateUrl: 'tiny-editor.html'
})
export class TinyEditorComponent implements AfterViewInit,OnInit, OnDestroy,OnChanges {
  @Input() elementId: String;
  @Input() hinsertContentString:String;
  @Output() onEditorContentChange = new EventEmitter();

  @Output() onInserImage = new EventEmitter();

  editorcontrol;

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['image','preview'],
      menubar: false,
      toolbar: 'resourcesext preview undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      skin_url: 'assets/skins/lightgray',
      height:screen.height-280,

      setup: editor => {
        let onInserImage = this.onInserImage;
        this.editorcontrol = editor;
        let elementid = this.elementId;
        let insertContentString = this.hinsertContentString;

      editor.addButton('resourcesext', {
         text: '图片',
         icon: false,
        //  image: '../js/tinymce/plugins/example/img/example.gif',
         onclick: function() {
            onInserImage.emit('img');
            console.log(elementid+"---=--"+this.hinsertContentString);
         }

      });
        editor.on('click', function(e) {
          console.log('Editor was clicked'+this.elementId);
        });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.onEditorContentChange.emit({'elementId':this.elementId,'content':content});

        });
      }
    });
  }
  ngOnInit(){
    console.log("ngOnInit---"+this.hinsertContentString);
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName == "hinsertContentString" && changedProp.currentValue != null){

        this.editorcontrol.insertContent('<p><img width=100% src="'+changedProp.currentValue+'" /></p>');
      }
    }
  }


  ngOnDestroy() {
    tinymce.remove(this.editorcontrol);
  }
  constructor() {
    console.log('Hello TinyEditor Component');

  }

}
