import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {EmployeeRequestModel, EmployeesService, LoginResponseModel, UsersService} from "../../services";
import {AuthGuard} from "../../services/auth.guard";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';


export interface LoginForm {
    email: string;
    password: any;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

    isLoading = new Subject<boolean>();
    public login: LoginForm = <LoginForm>{};
    public user: LoginResponseModel;
    public userInformation : EmployeeRequestModel;


    constructor(config: NgbDropdownConfig,
                public usersService: UsersService,
                public authGuard: AuthGuard,
                public router: Router,
                public toastr: ToastrService) {
        config.placement = 'bottom-right';
    }

    ngOnInit() {

    }

    public signIn(loginForm: NgForm) {
        this.isLoading.next(true);
        this.usersService.apiUsersLoginGet(loginForm.value.email, loginForm.value.password).subscribe(
            (data: LoginResponseModel) => {
                this.user = data;
                if (this.user != null) {
                    this.user.loggedIn = true;
                    sessionStorage.setItem('loginInfo', JSON.stringify(data));
                }
            },
            error => {
                console.log(error);
                this.showError();
                this.isLoading.next(false);
            },
            () => {
                this.isLoading.next(false);
                this.authGuard.userValidation(this.user,loginForm.value.password, loginForm.value.email);

                if(this.user.accessLevel == 3 || this.user.accessLevel == 2) {
                    this.showSuccess();
                    sessionStorage.setItem('username', JSON.stringify(loginForm.value.email));
                    this.router.navigateByUrl('/dashboard');
                }else{
                    this.showCustomToast();
                }

            }
        );
    }

    showSuccess() {
        this.toastr.success('Process successfully completed', 'Success', {
            timeOut: 5000,
        });
    }

    showError() {
        this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
            timeOut: 5000,
        });
    }

    showCustomToast() {
        this.toastr.info(
            'If this problem persists please contact \n the administrator to have your account activated.', 'Login Failed', {
                timeOut: 5000,
            });
    }

}