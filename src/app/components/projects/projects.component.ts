import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
    ClientRegistrationRequestModel,
    ClientsService, EmployeeRequestModel,
    EmployeeResponseModel,
    EmployeesService,
    InvoiceRequestModel,
    InvoiceService, ProjectExpenditureRequestModel, ProjectExpenditureResponseModel, ProjectExpenditureService,
    ProjectInformationRequestModel,
    ProjectInformationResponseModel,
    ProjectProgressRequestModel,
    ProjectProgressService,
    ProjectsService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment = require('moment');

export interface ProjectModel {
    id?: number;
    projectNumber?: string | null;
    projectName?: string | null;
    isSequential?: boolean;
    projectDescription?: string | null;
    invoiceReferenceNumber?: string | null;
    companyRegistrationNumber?: string | null;
    projectSatisfaction?: number;
    createdOn?: string;
    projectStatus?: string;
    projectLeaderId?: string | null;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
    isLoading = true;

    heading = 'Projects';
    subheading = 'View and manage projects';
    icon = 'pe-7s-hammer icon-gradient bg-tempting-azure';

    private projects: Array<ProjectInformationResponseModel> = [];
    private projectProgress: ProjectProgressRequestModel = {};
    newProject: ProjectInformationRequestModel= {};
    createProject: ProjectInformationRequestModel= {};
    project: ProjectModel= {};
    private statuses: Array<string> = ['Not Started', 'Ongoing', 'Completed', "Paused"];
    private invoices: Array<InvoiceRequestModel> = [];
    private employees: Array<EmployeeResponseModel> = [];
    clients: ClientRegistrationRequestModel[] = [];
    private userInformation : EmployeeRequestModel =  <EmployeeRequestModel>'';
    private username: string;
    private filter : string;
    private config: any;
    private employeeID : string;
    private invoiceID : string;
    reference = 'reference';
    employeeNumber = 'employeeNumber';


    constructor(private projectsService: ProjectsService,
                private projectsProgressService: ProjectProgressService,
                private router: Router,
                private toastr: ToastrService,
                private modalService: NgbModal,
                private invoiceService: InvoiceService,
                private clientService: ClientsService,
                private employeesService: EmployeesService) {
        this.userInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
        this.username  = JSON.parse(sessionStorage.getItem("username"));

    }

    ngOnInit() {

        this.getEmployees();
        this.getInvoices()
        this.getProjects();

        this.project.projectStatus = 'Not Started';

        this.config = {
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: this.projects.length
        };

    }

    getProgressPercentage(value): string{
        return value+'%';
    }


    getProjects(){
        this.isLoading = true;

        if(this.userInformation.position === 'Manager'){
            this.projectsService.apiProjectsAllProjectsGet().subscribe (
                (data: any) => {
                    this.projects = data
                },
                error => {
                    console.log(error);
                    this.showError();
                },
                () => {
                    if(this.projects !== null){
                        this.sortData;
                    }
                    this.isLoading = false;
                    this.showSuccess();
                }
            );

        } else {
            this.projectsService.apiProjectsByEmployeeEmployeeIdGet(this.username).subscribe (
                (data: any) => {
                    this.projects = data
                },
                error => {
                    console.log(error);
                    this.showError();
                },
                () => {
                    if(this.projects !== null){
                        this.sortData;
                    }
                    this.isLoading = false;
                    this.showSuccess();
                }
            );

        }
    }

    get sortData(): Array<ProjectInformationRequestModel> {
        return this.projects.sort((unsorted, sorted) => {
            return <any>new Date(sorted.createdOn) - <any>new Date(unsorted.createdOn);
        });
    }

    createProjects(project){
        this.modalService.dismissAll();
        this.isLoading = true;

        let date = moment().format("yyyy-MM-DD");

        this.createProject.id = 0;
        this.createProject.projectNumber = '';
        this.createProject.projectName = project.projectName;
        this.createProject.companyRegistrationNumber = project.companyRegistrationNumber;
        this.createProject.invoiceReferenceNumber = project.invoiceReferenceNumber;
        this.createProject.projectDescription = project.projectDescription;
        this.createProject.createdOn = date.toString();
        this.createProject.isSequential = false;
        this.createProject.projectLeaderId = project.projectLeaderId

        if(project.projectStatus == 'Completed'){
            this.createProject.projectSatisfaction = 100;
        }else{
            this.createProject.projectSatisfaction = 0;
        }

        this.projectsService.apiProjectsCreateProjectPost(this.createProject).subscribe (
            (data: any) => {
            },
            error => {
                if(error.status == 200){
                    this.projectsService.apiProjectsByInvoiceInvoiceIdGet(this.createProject.invoiceReferenceNumber).subscribe (
                        (data: any) => {
                            this.newProject = data

                            this.projectProgress.projectNumber = data.projectNumber;
                            this.projectProgress.targetStartDate = date.toString();
                            this.projectProgress.targetEndDate = date.toString();
                            this.projectProgress.actualStartDate = date.toString();
                            this.projectProgress.actualEndDate = date.toString();
                            this.projectProgress.projectStatus = project.projectStatus;
                            this.projectProgress.progressUpdatePercentage = 0;
                            this.projectProgress.startedQuarter = null;
                            this.projectProgress.currentQuarter = null;
                            this.projectProgress.endingQuarter = null;
                        },
                        error => {

                        },
                        () => {
                            this.projectsProgressService.apiProjectProgressCreatePost(this.projectProgress).subscribe (
                                (data: any) => {
                                },
                                error => {
                                    if(error.status == 200) {
                                        this.getProjects();
                                        this.isLoading = false;

                                    }else{
                                        console.log(error);
                                        this.showError();
                                    }
                                },
                                () => {
                                    this.getProjects();
                                }
                            );
                        }
                    );
                }else {
                    console.log(error);
                    this.showError();
                    this.isLoading = false;

                }
            }
        );
    }

    getProjectsByEmployeeID(employeeID : string){
        this.projectsService.apiProjectsByEmployeeEmployeeIdGet(employeeID).subscribe (
            (data: any) => {
                this.projects = data
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

    getProjectsByInvoiceID(invoiceID : string){
        this.projectsService.apiProjectsByInvoiceInvoiceIdGet(invoiceID).subscribe (
            (data: any) => {
                this.projects = data
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

    projectDetails(project : ProjectInformationRequestModel){
        sessionStorage.setItem('projectDetails', JSON.stringify(project));
        this.router.navigateByUrl('/project-details');
    }

    startProject(projectProgress){
        projectProgress.projectStatus = "Ongoing";
        this.isLoading = true;


        this.projectsProgressService.apiProjectProgressUpdatePut(projectProgress).subscribe (
            (data: any) => {
            },
            error => {
                if(error.status == 200) {
                    this.isLoading = false;
                    this.getProjects();
                    this.showSuccess();

                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.isLoading = false;

                this.getProjects();
                this.showSuccess();
            }
        );

    }

    pauseProject(projectProgress){
        this.isLoading = true;

        projectProgress.projectStatus = "Paused";

        this.projectsProgressService.apiProjectProgressUpdatePut(projectProgress).subscribe (
            (data: any) => {
            },
            error => {
                if(error.status == 200) {
                    this.isLoading = false;

                    this.getProjects();
                    this.showSuccess();

                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.isLoading = false;
                this.getProjects();
                this.showSuccess();
            }
        );
    }

    removeProject(project){
        this.isLoading = true;
        this.modalService.dismissAll();

        this.projectsService.apiProjectsProjectNumberDelete(project.projectNumber).subscribe (
            (data: any) => {
            },
            error => {
                if(error.status == 200) {
                    this.isLoading = false;

                    this.getProjects();
                    this.showSuccess();

                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.isLoading = false;
                this.getProjects();
                this.showSuccess();
            }
        );
    }

    getInvoices(){
        this.isLoading = true;

        this.invoiceService.apiInvoiceInvoiceGet().subscribe (
            (data: any) => {
                this.invoices = data;
                this.project.invoiceReferenceNumber = data[0].reference
            },
            error => {
                console.log(error);
            }
        );
    }

    getEmployees(){
        this.employeesService.apiEmployeesGet().subscribe (
            (data: any) => {
                this.employees = data;
            },
            error => {
                console.log(error);
            }
        );
    }

    search(){
        if(this.employeeID != null){
            this.getProjectsByEmployeeID(this.employeeID);
        }else if(this.invoiceID != null){
            this.getProjectsByInvoiceID(this.invoiceID);
        }
    }

    resetSearch() {
        this.invoiceID = null;
        this.employeeID = null;
        this.getProjects();
    }

    changeInvoiceReferenceNumber(value) {
        console.log('view value: ', value.reference);
        console.log('view value: ', value);

        this.project.invoiceReferenceNumber = value.reference;
        this.project.companyRegistrationNumber = value.company_registration;

    }

    changeAssignLeader(value) {
        this.project.projectLeaderId = value.employeeNumber;
    }

    openModal(value: any, data: any) {
        this.newProject = data;
        this.modalService.open( value);
    }

    pageChanged(event){
        this.config.currentPage = event;
    }

    showManagerMenu(): boolean{
        if(this.userInformation.position === 'Manager'){
            return true;
        } else{
            return false;
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
