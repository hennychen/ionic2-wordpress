import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { WpService } from '../../services/index';
import { AuthService } from '../../services/index';

@Component({
    selector: 'signup-form',
    templateUrl: './signupForm.html'
})

export class SignupFormComponent {

    signupStatusMessage: string;
    signupModel: any = {}
    isLoading: boolean = false;

    constructor(private wp: WpService, private http: Http,private auth: AuthService) {
    }

    signup(e) {
        this.isLoading = true;
        this.signupStatusMessage = '';
        this.wp.signup(this.signupModel)
            .subscribe(
              data => {
                  console.log(data);
                  this.loginWithNewUser(data);
              }, (error) => {
              }
                // result => {
                //     if (result === true) {
                //         // login successful
                //         this.signupStatusMessage = 'sign up successful!';
                //     } else {
                //         // login failed - token issue
                //         this.signupStatusMessage = 'Something wrong with token.';
                //     }
                //     this.isLoading = false;
                // },
                // result => {
                //     //rest call error
                //     this.isLoading = false;
                //     this.signupStatusMessage = 'Username or password is incorrect';
                // }
            );
        return false;
    }

    loginWithNewUser(userdata){
      this.auth.login(userdata.username, userdata.pwd)
          .subscribe(
            result => {
                if (result === true) {
                    // login successful
                    this.signupStatusMessage = 'sign up successful!';
                } else {
                    // login failed - token issue
                    this.signupStatusMessage = 'Something wrong with token.';
                }
                this.isLoading = false;
            },
            result => {
                //rest call error
                this.isLoading = false;
                this.signupStatusMessage = 'Username or password is incorrect';
            }
          );
    }

}
