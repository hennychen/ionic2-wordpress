import { Component } from '@angular/core';
import { AuthService } from '../../services/index';

@Component({
    selector: 'login-form',
    templateUrl: './login-form.html',
})
export class LoginFormComponent {

    loginStatusMessage: string;
    loginModel: any = {}
    isLoading: boolean = false;

    constructor(private auth: AuthService) {
    }

    login(e) {
        this.isLoading = true;
        this.loginStatusMessage = '';
        this.auth.login(this.loginModel.username, this.loginModel.password)
            .subscribe(
                result => {
                    if (result === true) {
                        // login successful
                        this.loginStatusMessage = '登录成功!';
                    } else {
                        // login failed - token issue
                        this.loginStatusMessage = '唯一标示错误';
                    }
                    this.isLoading = false;
                },
                result => {
                    //rest call error
                    this.isLoading = false;
                    this.loginStatusMessage = '用户名或密码错误请检查！';
                }
            );
        return false;
    }

    logout() {
        this.auth.logout();
    }
}