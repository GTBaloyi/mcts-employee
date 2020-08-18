import { Component, OnInit } from '@angular/core';
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {LoginResponseModel, UsersService} from "../../services";
import {AuthGuard} from "../../services/auth.guard";
import {Router} from "@angular/router";
import {ClientRegistrationRequestModel} from "../../services/model/models";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

    isLoading = new Subject<boolean>();
    private username: string;
    private password: string;
    private errorPassword: boolean= false;
    private user: LoginResponseModel;
    private titles: Array<string> = ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr'];
    private gender: Array<string> = ['Male', 'Female', 'Other'];
    private companyProfile: Array<string> = ['Small', 'Large', 'HEIs/Science Council', 'Techno/Star-Entrepreneur'];
    private result: ClientRegistrationRequestModel;
    private Newuser: ClientRegistrationRequestModel = <ClientRegistrationRequestModel>{} ;

    constructor(config: NgbDropdownConfig, private usersService: UsersService, private authGuard: AuthGuard, private router: Router) {
        config.placement = 'bottom-right';
    }

    ngOnInit() {

    }


    public signIn(username: string, password: string) {

        if(username == '' && password == ''){
            //this.showCustomToast('Please enter a username and password');
        }else if(username == ''){
            //this.showCustomToast('Please enter a username');

        }else if( password == ''){
            //this.showCustomToast('Please enter a password');

        }

        if (username != '' && password != ''){
            this.isLoading.next(true);

            this.usersService.apiUsersLoginGet(username, password).subscribe(

                (data: LoginResponseModel) => {
                    this.user = data;
                    if (this.user != null) {
                        this.user.loggedIn = true;
                        sessionStorage.setItem('loginInfo', JSON.stringify(data));
                    }

                },
                error => {
                    console.log(error);
                    this.errorPassword = true;
                    //this.showError();
                    this.isLoading.next(false);

                },
                () => {
                    this.authGuard.userValidation(this.user, password, username);
                    if(this.user.userStatus == 1){
                        //this.showSuccess();
                    }else if(this.user.userStatus == 3){
                        //this.openDialog();
                    }
                    this.isLoading.next(false);
                    this.router.navigateByUrl('/dashboard');

                }
            )
        }

    }

    singUp() {

        this.Newuser.isCompanyPresent = true;
        this.Newuser.avatar = '';

        this.isLoading.next(true);
        this.usersService.apiUsersClientRegistrationPost(this.Newuser).subscribe(
            (data: any) => {
                this.result = data;
            },
            error => {
                console.log(error);
                //this.showError();
                this.isLoading.next(false);
            },
            () => {
                //this.showSuccess();
                this.isLoading.next(false);
                this.router.navigateByUrl('/landing-page');

            }
        )
    }

    /*showSuccess() {
        this.toastService.show('Process successfully completed', {
            classname: 'bg-success text-light',
            delay: 2000 ,
            autohide: true,
            headertext: 'Toast Header'
        });
    }

    showError() {
        this.toastService.show('Opps, an error occurred. Please try again.', {
            classname: 'bg-danger text-light',
            delay: 2000 ,
            autohide: true,
            headertext: 'Error!!!'
        });
    }

    showCustomToast(customTpl) {
        this.toastService.show(customTpl, {
            classname: 'bg-info text-light',
            delay: 3000,
            autohide: true
        });
    }*/
}
