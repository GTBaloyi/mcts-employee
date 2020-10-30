import { Component, OnInit } from '@angular/core';
import {
  ClientRegistrationRequestModel,
  EmployeeRequestModel,
  EmployeeResponseModel,
  EmployeesPositionEntity,
  EmployeesService
} from "../../services";
import {Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import moment = require('moment');
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  heading = 'Employees';
  subheading = 'View and manage Employees';
  icon = 'pe-7s-id icon-gradient bg-tempting-azure';

  isLoading = true;
  employees: Array<EmployeeResponseModel> = [];
  positions: Array<EmployeesPositionEntity> = [];
  employeeUpdate: EmployeeResponseModel = {};
  AddEmployee: EmployeeResponseModel = {};
  employeeInformation : EmployeeRequestModel;
  filter : string;
  config: any;

  constructor(public router: Router,
              public toastr: ToastrService,
              public employeesService: EmployeesService,
              public modalService: NgbModal) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
  }
  ngOnInit() {
    this.getPosition();
    this.getEmployees();

    let date = moment().format("yyyy-MM-DD");
    this.AddEmployee.createdOn = date
    this.AddEmployee.position = 'General Staff';

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.employees.length
    };
  }

  getPosition(){
    this.employeesService.apiEmployeesEmployeePositionGet().subscribe (
        (data: any) => {
          this.positions = data;
        },
        error => {
          console.log(error);
        },
        () => {
        }
    );
  }

  getEmployees(){
    this.isLoading = true;

    this.employeesService.apiEmployeesGet().subscribe (
        (data: any) => {
          this.employees = data;
        },
        error => {

          console.log(error);
          this.showError();

        },
        () => {
          if(this.employees !== null){
            this.sortData;
          }
          this.showSuccess();
        }
    );

  }

  get sortData(): Array<EmployeeResponseModel> {
    return this.employees.sort((unsorted, sorted) => {
      return <any>new Date(sorted.createdOn) - <any>new Date(unsorted.createdOn);
    });
  }

  UpdateEmployees(employeeUpdate){
    this.modalService.dismissAll();
    this.isLoading = true;

    this.employeesService.apiEmployeesUpdateEmployeePut(employeeUpdate).subscribe (
          () => {
          },
          error => {

            console.log(error);
            this.showError();

          },
          () => {
            this.getEmployees();
            this.employeeUpdate = {};
          }
      );

  }

  AddEmployees(employeeAddForm: NgForm){
    this.modalService.dismissAll();
    this.isLoading = false;

    this.employeesService.apiEmployeesCreateEmployeePost(employeeAddForm.value).subscribe (
            () => {
            },
            error => {

              console.log(error);
              this.showError();

            },
            () => {
              this.getEmployees();
              this.AddEmployee = {};
            }
        );

    }

  showSuccess() {
    this.toastr.success('Process successfully completed', 'Success', {
      timeOut: 3000,
    });
    this.isLoading = false;
  }

  showError() {
    this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
      timeOut: 3000,
    });
    this.isLoading = false;
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  openModal(value: any, data: any) {
    this.employeeUpdate = data;
    this.modalService.open( value);
  }

}
