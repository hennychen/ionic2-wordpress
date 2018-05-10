import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


/*
  Generated class for the WpRestApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WpRestApiServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello WpRestApiServiceProvider Provider');
  }

  public executeHttpPost(url, postData?: any): Observable<any> {
    let bodyString = JSON.stringify(postData); // Stringify payload
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = { headers: headers }; // Create a request option
    // headers.append('Authorization', auth);
    return this.http.post(url, bodyString, options) // ...using post request
      .map((res: Response) => { 
       return res.json(); 

      }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any

  }

}
