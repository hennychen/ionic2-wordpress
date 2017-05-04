import { Component } from '@angular/core';
import { NavController,ActionSheetController,ViewController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AuthService, WpService } from '../../services/index';
import { ImagePicker } from '@ionic-native/image-picker';

/*
  Generated class for the MediaList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var cordova: any;

@Component({
  selector: 'page-media-list',
  templateUrl: 'media-list.html',
  providers:[Camera,Transfer,FilePath,File,ImagePicker]
})

export class MediaListPage {
  isLoading:Boolean = true;
  lastImage: string = null;
  loading: Loading;
  errormsg: string ;
  progressValue: any;
  progressEvent: ProgressEvent ;
  medias:any;
  media:any = {
    guid:{rendered:''},
    title:{rendered:''},
    media_details:{
      sizes:{
        thumbnail:{
          source_url:''
        },
        medium:{
          source_url:''
        }
      }
    }
  };
  isShow:Boolean = false;
  localImgsArray:any[] = [];
  imgpickUrl:string;
  isShowMutilUploadView:Boolean = false;//是否显示多图片上传
  isShowSingleUploadView:Boolean = false;//是否显示单图上传
  enableUpload:Boolean = false;

  constructor(private auth: AuthService,private filePath: FilePath,
    private transfer: Transfer,
    private file: File,
    private camera: Camera,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private wp: WpService,
    private imagePicker: ImagePicker,
    public viewCtrl: ViewController
  ) {

    }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: '从相册选单张图片',
          handler: () => {
            this.isShowSingleUploadView=false;
            this.isShowMutilUploadView = !this.isShowSingleUploadView;
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: '相机',
          handler: () => {
            this.isShowSingleUploadView=false;
            this.isShowMutilUploadView = !this.isShowSingleUploadView;
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: '选择多图片上传',
          handler: () => {
            // this.takePicture(this.camera.PictureSourceType.CAMERA);
            this.isShowMutilUploadView=false;
            this.isShowSingleUploadView = !this.isShowMutilUploadView;
            this.getImagePicker();
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  //获取多张图片上传
  public getImagePicker(){
    let options = {
    // max images to be selected, defaults to 15. If this is set to 1, upon
  	// selection of a single image, the plugin will return it.
  	maximumImagesCount: 5,

  	// max width and height to allow the images to be.  Will keep aspect
  	// ratio no matter what.  So if both are 800, the returned image
  	// will be at most 800 pixels wide and 800 pixels tall.  If the width is
  	// 800 and height 0 the image will be 800 pixels wide if the source
  	// is at least that wide.
  	width: 320,
  	height: 0,

  	// quality of resized image, defaults to 100
  	quality: 100
  };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          // this.imgpickUrl = results[i];
          this.localImgsArray.push(results[i]);
      }
      if(this.localImgsArray.length>0){
        this.enableUpload = true;//设置上传按钮可用
      }
    }, (err) => { });
  }
  // 相册或相机获取图片
  public takePicture(sourceType) {
      // Create options for the Camera Dialog
      var options = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };

      // Get the data of an image
      this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      }, (err) => {
        this.presentToast('Error while selecting image.');
      });
}
// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    if(this.lastImage!=null){
      this.enableUpload = true;
    }
  }, error => {
    this.presentToast('Error while storing file.');
  });
}

private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

public uploadImage(){
  if(!this.isShowSingleUploadView){
    console.log("SingleUploadView");
    this.uploadSingleImage();
  }else{
    console.log("multiimg");
    this.uploadMutileImage();
  }
}
public uploadMutileImage(){
  for(var imgname of this.localImgsArray){
    console.log(imgname);
     this.uploadMutileWithImage(imgname);
  }
}
public uploadMutileWithImage(imgName){
  // Destination URL
  var url = "http://vipho.cn/wp-json/wp/v2/media";
  // File for Upload
  var targetPath = imgName;

  // File name only
  var filename = imgName;

  var options = {
    fileKey: "file",
    fileName: filename,
    httpMethod: "POST",
    chunkedMode: false,
    mimeType: "multipart/form-data",
    headers: {
      "Content-Disposition" : "attachment;filename="+filename,
      "Authorization": "Bearer  "+localStorage.getItem('id_token'),
    },
    params : {
      'fileName': filename,
      'title':'titles',
      'alt_text':'alt_text'
      }
  };

  const fileTransfer: TransferObject = this.transfer.create();

  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });

  this.loading.present();
  fileTransfer.onProgress = function(progressEvent) {
    this.progressEvent = progressEvent;

      if (this.progressEvent.lengthComputable) {
          // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
          this.progressValue = this.progressEvent.loaded / this.progressEvent.loaded;
          console.log(this.progressValue);
      } else {
          // loadingStatus.increment();
      }
  };

  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll()
    this.presentToast('Image succesful uploaded.');
    console.log(data);
    this.loadData();
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
    this.errormsg = err;
    console.log(err);
  });
}
//上传
public uploadSingleImage() {
  // Destination URL
  var url = "http://vipho.cn/wp-json/wp/v2/media";
  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);

  // File name only
  var filename = this.lastImage;

  var options = {
    fileKey: "file",
    fileName: filename,
    httpMethod: "POST",
    chunkedMode: false,
    mimeType: "multipart/form-data",
    headers: {
      "Content-Disposition" : "attachment;filename="+filename,
      "Authorization": "Bearer  "+localStorage.getItem('id_token'),
    },
    params : {
      'fileName': filename,
      'title':'uploadtest',
      }
  };

  const fileTransfer: TransferObject = this.transfer.create();

  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });

  this.loading.present();
  fileTransfer.onProgress = function(progressEvent) {
    this.progressEvent = progressEvent;

      if (this.progressEvent.lengthComputable) {
          // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
          this.progressValue = this.progressEvent.loaded / this.progressEvent.loaded;
          console.log(this.progressValue);
      } else {
          // loadingStatus.increment();
      }
  };

  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll()
    this.presentToast('Image succesful uploaded.');
    console.log(data);
    this.loadData();
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
    this.errormsg = err;
  });
}
  // 页面加载
  ionViewDidLoad() {
    // console.log('ionViewDidLoad MediaListPage');
    this.loadData();
  }
  //加载已上传的图片
  loadData(){
    if(this.auth.authenticated()){
     this.wp.getMedias({"author":this.wp.getCurrentAuthorId()}).subscribe(
      (data) => {
        // console.log(data);
        this.medias = data;
        if(this.medias.length>0)
        {
          this.isShow = false;
        }else{
          this.isShow = true;
        }
      },(err) => {
        console.log(err);
      },() => {
        console.log("completed");
        console.log(this.medias);
        // this.media = this.medias[0];
        // console.log(this.media);
        this.isLoading = false;
      });
    }else{
      alert('请登录');
      this.isLoading = false;
    }
  }

  selectImgInsertEditor(media){
    console.log(media);
    this.viewCtrl.dismiss(media.source_url);
  }

}
