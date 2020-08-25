import { Component, OnInit } from '@angular/core';
import {EmployeeRequestModel, EmployeeResponseModel, EmployeesPositionEntity, EmployeesService} from "../../services";
import {Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import moment = require('moment');


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  isLoading = new Subject<boolean>();
  private employees: Array<EmployeeResponseModel> = [];
  private positions: Array<EmployeesPositionEntity> = [];
  private employeeUpdate: EmployeeResponseModel = {};
  private AddEmployee: EmployeeResponseModel = {};
  private employeeInformation : EmployeeRequestModel;
  private showUpdateEmployee: boolean;
  private showAddEmployee: boolean;
  private filter : string;
  private config: any;

  constructor(private router: Router,
              private toastr: ToastrService,
              private employeesService: EmployeesService) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
  }
  ngOnInit() {
    this.getPosition();
    this.getEmployees();

    let date = moment().format("YYYY-MM-DD");
    this.AddEmployee.createdOn = date
    this.AddEmployee.position = 'General Staff';

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.employees.length
    };
  }

  getPosition(){
    this.isLoading.next(true);
    this.employeesService.apiEmployeesEmployeePositionGet().subscribe (
        (data: any) => {
          this.positions = data;
        },
        error => {
          console.log(error);
          this.isLoading.next(false);
        },
        () => {
          this.isLoading.next(false);
        }
    );
  }

  getEmployees(){
    this.isLoading.next(true);

    this.employeesService.apiEmployeesGet().subscribe (
        (data: any) => {
          this.employees = data;
        },
        error => {

          console.log(error);
          this.isLoading.next(false);
          this.showError();

        },
        () => {
          this.isLoading.next(false);
          this.showSuccess();
        }
    );

  }

  UpdateEmployees(employeeUpdate){
    this.isLoading.next(true);

    this.employeesService.apiEmployeesUpdateEmployeePut(employeeUpdate).subscribe (
          () => {
          },
          error => {

            console.log(error);
            this.isLoading.next(false);
            this.showError();

          },
          () => {
            this.getEmployees();
            this.hideUpdateEmployeeModel()
            this.employeeUpdate = {};
          }
      );

  }

  AddEmployees(employeeAddForm: NgForm){
    this.isLoading.next(false);

    this.employeesService.apiEmployeesCreateEmployeePost(employeeAddForm.value).subscribe (
            () => {
            },
            error => {

              console.log(error);
              this.isLoading.next(false);
              this.showError();

            },
            () => {
              this.getEmployees();
              this.hideAddEmployeeModel();
              this.AddEmployee = {};
            }
        );

    }

  showSuccess() {
    this.toastr.success('Process successfully completed', 'Success', {
      timeOut: 3000,
    });
  }

  showError() {
    this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
      timeOut: 3000,
    });
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  showUpdateEmployeeModel(employee) {
    this.employeeUpdate = employee;
    this.showUpdateEmployee = true;
  }

  hideUpdateEmployeeModel() {
    this.showUpdateEmployee = false;
  }

  showAddEmployeeModel() {
    this.showAddEmployee = true;
  }

  hideAddEmployeeModel() {
    this.showAddEmployee = false;
  }
}