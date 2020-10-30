import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
  ClientRegistrationRequestModel,
  ClientsService,
  EmployeeRequestModel, EmployeeResponseModel,
  EmployeesService,
  UsersService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  heading = 'My Account';
  subheading = 'Update account information';
  icon = 'pe-7s-id icon-gradient bg-tempting-azure';

  isLoading = new Subject<boolean>();
  public employeeInformation : EmployeeResponseModel= <EmployeeResponseModel> {};

  constructor(public router: Router,
              public toastr: ToastrService,
              public employeesService: EmployeesService,
              public usersService: UsersService) {

    this.employeeInformation  = JSON.parse(sessionStorage.getItem('userInformation'));

    console.log(this.employeeInformation);

  }

  ngOnInit() {
  }

  updateClient(editEmployee : EmployeeRequestModel) {
    this.isLoading.next(true);
    this.employeesService.apiEmployeesUpdateEmployeePut(editEmployee).subscribe(
        () => {
        },
        error => {
          if (error.status == 200) {
            this.getEmployee();
          } else {
            console.log(error);
            this.showError();
          }
        },
        () => {
          this.getEmployee();
        }
    );

  }

  getEmployee() {
    this.isLoading.next(true);
    this.employeesService.apiEmployeesEmployeeNumberGet(this.employeeInformation.employeeNumber).subscribe(
        (data: EmployeeResponseModel) => {
          this.employeeInformation = data;
          sessionStorage.setItem('userInformation', JSON.stringify(data));
        },
        err => {
        },
        () => {
          this.isLoading.next(false);
        }
    );

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
