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
    ProjectInformationResponseModel,
    ProjectsService,
    ProjectTodoResponseModel,
    ProjectTodosRequestModel,
    ProjectTodosService,
    ResponsibleEmployees
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment = require('moment');


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

    heading = 'Projects';
    subheading = 'View and manage projects';
    icon = 'pe-7s-hammer icon-gradient bg-tempting-azure';

    private actualCost: number;
    private targetCost: number;
    private config: any;
    private itemStatus: string;
    private finishDate: Date;
    private startedDate: Date;
    private selectedProduct: string;
    employeeNumber = 'employeeNumber';
    private selectedFocusArea: string;
    private products: Array<any> = [];
    isLoading = new Subject<boolean>();
    private focusAreas: Array<any> = [];
    private projectExpenditure: ProjectExpenditureResponseModel = {};
    private employeeInformation: EmployeeRequestModel;
    private employees: Array<EmployeeResponseModel> = [];
    private ProjectTodoItems: ProjectTodosRequestModel[] = [];
    private assignedEmployees: Array<ResponsibleEmployees> = [];
    private invoice: InvoiceResponseModel = <InvoiceResponseModel>'';
    private addProjectTodoItem: ProjectTodosRequestModel = {};
    private item: ProjectTodoResponseModel = {};
    private project: ProjectInformationResponseModel = <ProjectInformationResponseModel>'';
    private statuses: Array<string> = ['Not Started', 'Ongoing', 'Completed', 'Paused'];


    constructor(private router: Router,
                private toastr: ToastrService,
                private invoiceService: InvoiceService,
                private projectTodosService: ProjectTodosService,
                private projectService: ProjectsService,
                private employeesService: EmployeesService,
                private productsService: ProductsService,
                private projectExpenditureService: ProjectExpenditureService,
                private modalService: NgbModal) {
        this.project = JSON.parse(sessionStorage.getItem("projectDetails"));
    }

    ngOnInit() {
        this.getInvoices();
        this.getFocusArea();
        this.getEmployees();
        this.getTodoItems();
        this.getEmployeeInfo();
        this.itemStatus = 'Not Started'
        this.selectedFocusArea = 'Physical Metallurgy';
        this.selectedProduct = 'Non Testing Act (Phys)';

        this.getProducts(this.selectedFocusArea)
        this.getProject();
        this.getProjectExpenditure();

            this.config = {
            itemsPerPage: 4,
            currentPage: 1,
            totalItems: this.ProjectTodoItems.length
        };
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

    getProject() {
        this.projectService.apiProjectsByProjectNumberProjectNumberGet(this.project.projectNumber).subscribe(
            (data: any) => {
                this.project = data
                sessionStorage.setItem('projectDetails', JSON.stringify(this.project));

            },
            error => {
                console.log(error);
            }
        )
    }

    get sortData(): Array<ProjectInformationRequestModel> {
        return this.ProjectTodoItems.sort((unsorted, sorted) => {
            return <any>new Date(sorted.dateStarted) - <any>new Date(unsorted.dateStarted);
        });
    }

    pageChanged(event) {
        this.config.currentPage = event;
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

    getEmployeeInfo() {
        this.employeesService.apiEmployeesEmployeeNumberGet(this.project.projectLeaderId).subscribe(
            (data: any) => {
                this.employeeInformation = data;
            },
            error => {
                console.log(error);
            }
        );
    }

    getInvoices() {
        this.invoiceService.apiInvoiceInvoiceByReferenceInvoiceReferenceGet(this.project.invoiceReferenceNumber).subscribe(
            (data: any) => {
                this.invoice = data;
            },
            error => {
                console.log(error);
            }
        );
    }

    addTodoItem() {
        this.isLoading.next(true);

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
                    this.isLoading.next(false);
                    this.modalService.dismissAll();
                    this.getTodoItems();
                    this.showSuccess();

                } else {
                    this.isLoading.next(false);
                    console.log(error);
                    this.showError();
                }
            },
            () => {
            }
        );
    }

    removeProduct(item){
        this.isLoading.next(true);
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
                    this.isLoading.next(false);
                    this.getTodoItems();
                    this.showSuccess();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.isLoading.next(false);
                this.getTodoItems();
                this.showSuccess();
            }
        );
    }

    editTodoItem() {
        this.isLoading.next(true);

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
                this.isLoading.next(false);
                console.log(error);
                this.showError();
            },
            () => {
                this.isLoading.next(false);
                this.modalService.dismissAll();
                this.getTodoItems();
                this.showSuccess();
            }
        );
    }

    getProgressPercentage(value): string{
        return value+'%';
    }

    getTodoItems() {
        this.isLoading.next(true);

        this.projectTodosService.apiProjectTodosProjectNumberProjectNumberGet(this.project.projectNumber).subscribe(
            (data: any) => {
                this.ProjectTodoItems = data;
            },
            error => {
                console.log(error);
                this.isLoading.next(false);
                this.showError();
            },
            () => {
                this.sortData
                this.isLoading.next(false);
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
    }

    showError() {
        this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
            timeOut: 3000,
        });
    }
}
