import { Component, OnInit } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {ClientRegistrationRequestModel, EmployeeResponseModel, LoginResponseModel, UsersService} from "../../services";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  heading = 'Change Password';
  subheading = 'Change password';
  icon = 'pe-7s-door-lock icon-gradient bg-tempting-azure';

  isLoading = new Subject<boolean>();
  public oldPassword : string;
  public newPassword : string;
  public user : LoginResponseModel;
  public employeeInformation : EmployeeResponseModel= <EmployeeResponseModel> {};


  constructor(public formBuilder: FormBuilder,
              public router: Router,
              public toastr: ToastrService,
              public usersService: UsersService) {
    this.user = JSON.parse(sessionStorage.getItem("loginInfo"));
    this.employeeInformation = JSON.parse(sessionStorage.getItem("userInformation"));
  }

  ngOnInit() {

  }

  changePassword() {
    this.isLoading.next(true);
    this.usersService.apiUsersResetPasswordPut(this.employeeInformation.employeeNumber, this.oldPassword, this.newPassword,1).subscribe(

        (data: Observable<any>) => {
          console.log(data)
        },
        error => {
          if(error.status == 200){
            this.user.userStatus = 1;
            sessionStorage.setItem('loginInfo', JSON.stringify(this.user));
            this.isLoading.next(false);
            this.showSuccess();
          }else{
            this.showError();
            this.isLoading.next(false);
            console.log(error);
          }
        },
        () => {
          this.showSuccess();
          this.user.userStatus = 1;
          sessionStorage.setItem('loginInfo', JSON.stringify(this.user));
          this.isLoading.next(false);
        }
    )
  }

  showSuccess() {
    this.isLoading.next(false);
    this.toastr.success('Process successfully completed', 'Success', {
      timeOut: 3000,
    });
  }

  showError() {
    this.isLoading.next(false);
    this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
      timeOut: 3000,
    });
  }


}
