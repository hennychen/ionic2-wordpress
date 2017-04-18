import { Component } from '@angular/core';
import { NavController,ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { WpService } from '../../services/index';
/*
  Generated class for the MediaList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var cordova: any;

@Component({
  selector: 'page-media-list',
  templateUrl: 'media-list.html',
  providers:[Camera,Transfer,FilePath,File]
})

export class MediaListPage {

  lastImage: string = null;
  loading: Loading;
  errormsg: string ;
  progressValue: any;
  progressEvent: ProgressEvent ;

  constructor(private filePath: FilePath,
    private transfer: Transfer,
    private file: File,
    private camera: Camera,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,private wp: WpService) {}

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
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
public uploadImage() {
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
      'fileName': filename
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
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
    this.errormsg = err;
  });
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaListPage');
  }


}
