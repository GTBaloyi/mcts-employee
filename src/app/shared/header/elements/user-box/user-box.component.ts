import {Component, OnInit} from '@angular/core';
import {ThemeOptions} from "../../../../theme-options";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeRequestModel, EmployeesService} from "../../../../services";

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
})
export class UserBoxComponent implements OnInit {

  public email: string;
  public employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};

  constructor(public globals: ThemeOptions, public router: Router, public employeesService: EmployeesService) {
  }

  ngOnInit() {
    this.email  = JSON.parse(sessionStorage.getItem("username"));

    if(this.email != null) {
      this.getEmployeeInformation(this.email);
    }
  }

  public getEmployeeInformation(employeeID: string) {
    this.employeesService.apiEmployeesEmployeeNumberGet(employeeID).subscribe(
        (data: EmployeeRequestModel) => {
          this.employeeInformation = data;
          sessionStorage.setItem('userInformation', JSON.stringify(this.employeeInformation));
        },
        error => {

        },
        () => {
        }
    );
  }

  logout() {
    sessionStorage.removeItem('loginInfo');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userInformation');
    sessionStorage.removeItem('viewQuotation');
    this.router.navigateByUrl('/landing-page');
  }
}
