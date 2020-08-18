import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    passwordContainsLowercase,
    passwordContainsNumbers,
    passwordMatchValidator, passwordStrong,
    passwordUppercaseValidator
} from "../../validations/Password-validator";
import {Router} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {AuthGuard} from "../../services/auth.guard";
import {LoginResponseModel, UsersService} from "../../services";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnChanges {

    private formGroup: FormGroup;
    private user : LoginResponseModel;
    private oldPassword : string;
    private username : string;
    isLoading = new Subject<boolean>();



    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private usersService: UsersService,
                private authGuard: AuthGuard){

        if(this.router.getCurrentNavigation().extras.state != undefined) {
            this.oldPassword = this.router.getCurrentNavigation().extras.state.password;
            this.username = this.router.getCurrentNavigation().extras.state.username;
        }else{
            this.router.navigateByUrl('/login');
        }
    }

    ngOnInit(): void {

        this.user = JSON.parse(sessionStorage.getItem("loginInfo"));

        this.formGroup = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validator: [
                passwordMatchValidator,
                passwordUppercaseValidator,
                passwordContainsLowercase,
                passwordContainsNumbers,
                passwordStrong
            ]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    get password() {
        return this.formGroup.get('password');
    }

    get confirmPassword() {
        return this.formGroup.get('confirmPassword');
    }

    onPasswordInput() {


        if (this.formGroup.hasError('passwordMismatch'))
            this.confirmPassword.setErrors({'passwordMismatch': true});
        else
            this.confirmPassword.setErrors(null);


        if (this.formGroup.hasError('passwordNoUppercase'))
            this.password.setErrors({'passwordNoUppercase': true});
        else
            this.password.setErrors(null);


        if (this.formGroup.hasError('passwordNoLowercase'))
            this.password.setErrors({'passwordNoLowercase': true});
        else
            this.password.setErrors(null);


        if (this.formGroup.hasError('passwordNoNumbers'))
            this.password.setErrors({'passwordNoNumbers': true});
        else
            this.password.setErrors(null);



        if (!this.formGroup.hasError('passwordIsStrong'))
            this.password.setErrors({'passwordIsStrong': true});
        else
            this.password.setErrors(null);

    }


    openSnackBar(message: string, action: string) {
       /* this._snackBar.open(message, action, {
            duration: 10000,
        });*/
    }

    resetPassword() {
        this.isLoading.next(true);

        this.usersService.apiUsersResetPasswordPut(this.username, this.oldPassword, this.confirmPassword.value,1).subscribe(

            (data: Observable<any>) => {
                console.log(data)
            },
            error => {
                if(error.status == 200){
                    this.user.userStatus = 1;
                    sessionStorage.setItem('loginInfo', JSON.stringify(this.user));
                    this.authGuard.userValidation(this.user, this.confirmPassword.value, this.username);
                    this.openSnackBar('password reset successfully', 'Ok');
                    this.isLoading.next(false);
                    this.router.navigateByUrl('/dashboard');
                }else{
                    this.isLoading.next(false);
                    this.openSnackBar('something went wrong, please try again later', 'Ok');
                    console.log(error);
                }
            },
            () => {
                this.user.userStatus = 1;
                sessionStorage.setItem('loginInfo', JSON.stringify(this.user));
                this.openSnackBar('password reset successfully', 'Ok');
                this.isLoading.next(false);
                this.router.navigateByUrl('/dashboard');

            }
        )
    }

}
