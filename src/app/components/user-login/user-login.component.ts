import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthGuard} from "../../services/auth.guard";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {LoginResponseModel, UsersService} from "../../services";



@Component({
    selector: 'user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnChanges, OnInit {

    private username: string;
    private pass: string;
    private user: LoginResponseModel;
    isLoading = new Subject<boolean>();
/*
    public dialogRef: MatDialogRef<UserDialogComponent>;
*/


    ngOnInit() {

    }


    ngOnChanges() {
    }


    constructor( private usersService: UsersService, private authGuard: AuthGuard, private router: Router) {

    }

    openSnackBar(message: string, action: string) {
        /*this._snackBar.open(message, action, {
            duration: 10000,
        });*/
    }

    public signIn(username: string, password: string) {

        if(username == '' && password == ''){
            this.openSnackBar('Please enter a username and password', 'Ok');
        }else if(username == ''){
            this.openSnackBar('Please enter a username', 'Ok');

        }else if( password == ''){
            this.openSnackBar('Please enter a password', 'Ok');

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
                    this.openSnackBar('Incorrect username / password', 'Ok');
                    this.isLoading.next(false);

                },
                () => {
                    this.authGuard.userValidation(this.user, password, username);
                    if(this.user.userStatus == 1){
                        this.openSnackBar('login successful', 'Ok');
                    }else if(this.user.userStatus == 3){
                        this.openDialog();
                    }
                    this.isLoading.next(false);
                    this.router.navigateByUrl('/dashboard');

                }
            )
        }

    }

    openDialog() {
       /* const dialogRef = this.dialog.open(UserDialogComponent);*/

        /*dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });*/
    }
}

@Component({
    selector: 'user-dialog-component',
    templateUrl: 'user-dialog.component.html',
    styleUrls: ['./user-login.component.scss'],
})
export class UserDialogComponent {}