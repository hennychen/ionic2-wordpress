import { Component,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
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
export class TinyEditorComponent implements AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Output() onEditorContentChange = new EventEmitter();

  editor;

  ngAfterViewInit() {

    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['image'],
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.onEditorContentChange.emit(content);
        });
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
  constructor() {
    console.log('Hello TinyEditor Component');

  }

}
