import {Component, OnChanges, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {AuthGuard} from "../../services/auth.guard";
import {Router} from "@angular/router";
import {UsersService} from "../../services";
import {ClientRegistrationRequestModel} from "../../services/model/models";


@Component({
    selector: 'client-registration',
    templateUrl: './client-registration.component.html',
    styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent implements OnChanges, OnInit  {

    private titles: Array<string> = ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Sir', 'Dr'];
    private gender: Array<string> = ['Male', 'Female', 'Other'];
    private companyProfile: Array<string> = ['Small', 'Large', 'HEIs/Science Council', 'Techno/Star-Entrepreneur'];
    isLoading = new Subject<boolean>();
    private result: ClientRegistrationRequestModel;
    private user: ClientRegistrationRequestModel = <ClientRegistrationRequestModel>{} ;

    ngOnInit() {

    }


    ngOnChanges() {
    }


    constructor(public usersService: UsersService, public authGuard: AuthGuard, private router: Router) {

    }


    openSnackBar(message: string, action: string) {
        /*this._snackBar.open(message, action, {
            duration: 10000,
        });*/
    }

    singUp() {

        this.user.isCompanyPresent = true;
        this.user.avatar = '';

        this.isLoading.next(true);
        this.usersService.apiUsersClientRegistrationPost(this.user).subscribe(
            (data: any) => {
                this.result = data;
            },
            error => {
                console.log(error);
                this.openSnackBar('Registration failed, please try again later', 'Ok');
                this.isLoading.next(false);
            },
            () => {
                this.openSnackBar('Registration successful', 'Ok');
                this.isLoading.next(false);
                this.router.navigateByUrl('/landing-page');

            }
        )
    }
}

