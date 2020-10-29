import { Component, OnInit } from '@angular/core';
import {
    EmployeeRequestModel,
    EmployeeResponseModel,
    EmployeesService,
    InvoiceResponseModel,
    InvoiceService,
    ProductsService,
    ProjectExpenditureResponseModel,
    ProjectExpenditureService,
    ProjectInformationRequestModel,
    ProjectProgressResponseModel,
    ProjectProgressService,
    ProjectsService,
    ProjectSummaryModel,
    ProjectTodoResponseModel,
    ProjectTodosRequestModel,
    ProjectTodosService,
    ResponsibleEmployees
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment = require('moment');
import {THIS_EXPR} from "@angular/compiler/src/output/output_ast";


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

    heading = 'Projects';
    subheading = 'View and manage projects';
    icon = 'pe-7s-hammer icon-gradient bg-tempting-azure';

     actualCost: number;
     targetCost: number;
     config: any;
     itemStatus: string;
     finishDate: Date;
     startedDate: Date;
     selectedProduct: string;
    employeeNumber = 'employeeNumber';
     selectedFocusArea: string;
     products: Array<any> = [];
    isLoading = false;
     focusAreas: Array<any> = [];
     projectExpenditure: ProjectExpenditureResponseModel = {};
     employees: Array<EmployeeResponseModel> = [];
     ProjectTodoItems: ProjectTodosRequestModel[] = [];
     assignedEmployees: Array<ResponsibleEmployees> = [];
     invoice: InvoiceResponseModel = <InvoiceResponseModel>'';
     addProjectTodoItem: ProjectTodosRequestModel = {};
     item: ProjectTodoResponseModel = {};
     project: any = {};
     projectProgress: ProjectProgressResponseModel = <ProjectProgressResponseModel>'';
     statuses: Array<string> = ['Not Started', 'Ongoing', 'Completed', 'Paused'];


    constructor(private router: Router,
                private toastr: ToastrService,
                private invoiceService: InvoiceService,
                private projectTodosService: ProjectTodosService,
                private projectService: ProjectsService,
                private employeesService: EmployeesService,
                private productsService: ProductsService,
                private projectExpenditureService: ProjectExpenditureService,
                private projectProgressService: ProjectProgressService,
                private modalService: NgbModal) {
        this.project = JSON.parse(sessionStorage.getItem("projectDetails"));
    }

    ngOnInit() {
        this.isLoading = true;
        this.getFocusArea();
        this.getEmployees();
        this.getTodoItems();
        this.itemStatus = 'Not Started'
        this.selectedFocusArea = 'Physical Metallurgy';
        this.selectedProduct = 'Non Testing Act (Phys)';

        this.getProducts(this.selectedFocusArea)
        this.getProjectExpenditure();
        this.getProjectProgress();
        this.getInvoice();

    }

    getProjectExpenditure(){
        this.projectExpenditureService.apiProjectExpenditureByProjectNumberProjectNumberGet(this.project.projectNumber).subscribe(
            (data: any) => {
                this.projectExpenditure = data;
                this.actualCost = data.actualCost
                this.targetCost = data.targetCost;
            },
            error => {
                console.log(error);
            },
            () => {
            }
        );
    }

    getProjectProgress(){
        this.projectProgressService.apiProjectProgressByProjectNumberProjectNumberGet(this.project.projectNumber).subscribe(
            (data: any) => {
                this.projectProgress = data;
            },
            error => {
                console.log(error);
                this.showError();
            },
            () => {
                this.showSuccess();
            }
        );
    }

    get sortData(): Array<ProjectInformationRequestModel> {
        return this.ProjectTodoItems.sort((unsorted, sorted) => {
            return <any>new Date(sorted.dateStarted) - <any>new Date(unsorted.dateStarted);
        });
    }

    getProducts(focusArea: any) {
        this.selectedFocusArea = focusArea;
        this.products = [];

        this.productsService.apiProductsProductsFocusAreaGet(focusArea).subscribe(
            (data: any) => {
                this.products = data
                if (this.project == []) {
                    this.selectedProduct = 'None';
                }
            },
            error => {
                console.log(error);
            }
        )
    }

    getFocusArea() {
        this.productsService.apiProductsFocusAreasGet().subscribe(
            (data: any) => {
                this.focusAreas = data
            },
            error => {
                console.log(error);
            }
        )
    }

    getEmployees() {
        this.employeesService.apiEmployeesGet().subscribe(
            (data: any) => {
                this.employees = data;
            },
            error => {
                console.log(error);
            }
        );
    }

    getInvoice() {
        this.invoiceService.apiInvoiceInvoiceByReferenceInvoiceReferenceGet(this.project.invoiceReference).subscribe(
            (data: any) => {
                this.invoice = data;
            },
            error => {
                console.log(error);
            }
        );
    }

    addTodoItem() {
        this.isLoading =true;

        var employees: Array<string> = [];
        for (var i = 0; i < this.assignedEmployees.length; i++) {
            employees.push(this.assignedEmployees[i].employeeNumber);
        }

        this.addProjectTodoItem.id = 0;
        this.addProjectTodoItem.sequenceNumber = 0;
        this.addProjectTodoItem.isSequential = false;
        this.addProjectTodoItem.status = this.itemStatus;
        this.addProjectTodoItem.item = this.selectedProduct;
        this.addProjectTodoItem.responsibleEmployees = employees;
        this.addProjectTodoItem.focusArea = this.selectedFocusArea;
        this.addProjectTodoItem.projectNumber = this.project.projectNumber;
        this.addProjectTodoItem.dateStarted = moment(this.startedDate).format("yyyy-MM-DD");
        this.addProjectTodoItem.dateEnded = moment(this.finishDate).format("yyyy-MM-DD");

        console.log('values: ', this.addProjectTodoItem);

        this.projectTodosService.apiProjectTodosPost(this.addProjectTodoItem).subscribe(
            (data: any) => {
            },
            error => {
                if (error.status == 200) {
                    this.modalService.dismissAll();
                    this.getTodoItems();
                    this.getProjectProgress();
                    this.showSuccess();

                } else {
                    console.log(error);
                    this.showError();
                }
            },
            () => {
            }
        );
    }

    removeProduct(item){
        this.isLoading = true;
        this.modalService.dismissAll();

        var employees: Array<string> = [];
        for (var i = 0; i < item.responsibleEmployees.length; i++) {
            employees.push(item.responsibleEmployees[i].employeeNumber);
        }

        item.responsibleEmployees = employees;

        console.log(item);

        this.projectTodosService.apiProjectTodosDeleteIdDelete(item.id).subscribe (
            (data: any) => {
            },
            error => {
                if(error.status == 200) {
                    this.getTodoItems();
                    this.showSuccess();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.getTodoItems();
                this.showSuccess();
            }
        );
    }

    editTodoItem() {
        this.isLoading = true;

        var employees: Array<string> = []
        for (var i = 0; i < this.assignedEmployees.length; i++) {
            employees.push(this.assignedEmployees[i].employeeNumber);
        }

        var item: ProjectTodosRequestModel = {};

        item.id= this.item.id;
        item.projectNumber = this.item.projectNumber;
        item.sequenceNumber = this.item.sequenceNumber;
        item.isSequential = this.item.isSequential;
        item.focusArea = this.item.focusArea;
        item.item=  this.item.item;
        item.status = this.item.status;
        item.responsibleEmployees = employees;
        item.projectNumber = this.project.projectNumber;
        item.dateStarted = moment(this.startedDate).format("yyyy-MM-DD");
        item.dateEnded = moment(this.finishDate).format("yyyy-MM-DD");

        this.projectTodosService.apiProjectTodosPut(item).subscribe(
            (data: any) => {
            },
            error => {
                console.log(error);
                this.showError();
            },
            () => {
                this.modalService.dismissAll();
                this.getTodoItems();
                this.getProjectProgress();
                this.showSuccess();
            }
        );
    }

    getProgressPercentage(value): string{
        return value+'%';
    }

    getTodoItems() {
        this.isLoading = true;

        this.projectTodosService.apiProjectTodosProjectNumberProjectNumberGet(this.project.projectNumber).subscribe(
            (data: any) => {
                this.ProjectTodoItems = data;
            },
            error => {
                console.log(error);
                this.showError();
            },
            () => {
                this.sortData
            }
        );
    }

    changeAssignedEmployees(value) {
        var ifExist: boolean = false;

        for (var i = 0; i < this.assignedEmployees.length; i++) {
            if (this.assignedEmployees[i].employeeNumber === value.id) {
                ifExist = true;
            } else {
                ifExist = false;
            }
        }

        if (!ifExist) {
            this.assignedEmployees.push(value);
        } else {
            this.toastr.info('You have already selected this ' + value.employeeNumber + ' employee', 'Warning', {
                timeOut: 3000,
            });
        }
    }

    deleteItem(index) {
        this.assignedEmployees.splice(index, 1);
    }

    openModal(value: any, data: any) {

        if(data !== null){
            var start: any;
            var end: any;

            start = moment(data.dateStarted).format("yyyy-MM-DD");
            end = moment(data.dateEnded).format("yyyy-MM-DD");

            this.item = data;
            this.assignedEmployees = data.responsibleEmployees;
            this.startedDate = start;
            this.finishDate = end;

            this.modalService.open(value);
        }else{
            this.modalService.open(value);
        }

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
}
