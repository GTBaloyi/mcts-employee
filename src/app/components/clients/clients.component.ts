import { Component, OnInit } from '@angular/core';
import {
    ClientRegistrationRequestModel,
    ClientsGeneralReportsModel,
    ClientsService,
    EmployeesReportsService,
    UsersService
} from "../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import moment = require('moment');


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
    heading = 'Clients';
    subheading = 'Dashboard to manage clients';
    icon = 'pe-7s-users icon-gradient bg-tempting-azure';

    private numberOfActiveClients: number = 0;
    private numberOfInactiveClients: number = 0;
    private numberOfClients: number = 0;

    private config: any;
    private filter : string;
    isLoading = true;
    clients: ClientRegistrationRequestModel[] = [];
    clientsGeneralReports: ClientsGeneralReportsModel = {};
    addClient: ClientRegistrationRequestModel= {};
    editClient: ClientRegistrationRequestModel= <ClientRegistrationRequestModel>{};
    companyRegistration: string = '';
    private titles: Array<string> = ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr'];
    private genders: Array<string> = ['Male', 'Female', 'Other'];
    private companyProfiles: Array<string> = ['Small', 'Large', 'HEIs/Science Council', 'Techno/Star-Entrepreneur'];

    constructor(private router: Router,
                private toastr: ToastrService,
                private clientService: ClientsService,
                private employeesReportsService: EmployeesReportsService,
                private modalService: NgbModal,
                private usersService: UsersService,) {

    }

    ngOnInit() {
        this.addClient.title = 'Mr';
        this.addClient.gender = 'Male';
        this.addClient.companyProfile = 'Small';

        this.getClients();
        this.getClientsReport();

        this.config = {
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: this.clients.length
        };
    }

    getClientsReport(){
        this.employeesReportsService.apiEmployeesReportsClientsGeneralReportGet().subscribe(
            (data )=>{
                this.clientsGeneralReports = data;
            },
            err =>{
            },
            ()=>{
            }
        );

    }

    getClients(){
        this.isLoading = true;
        this.clientService.apiClientsGet().subscribe(
            (data: ClientRegistrationRequestModel[] )=>{
                this.clients = data;
            },
            err =>{
                this.showError()
            },
            ()=>{
                this.numberOfClients = 0;
                this.numberOfActiveClients = 0;
                this.numberOfInactiveClients = 0;

                if(this.clients !== null){
                    this.sortData;
                }

                this.inactiveClients();
                this.getActiveClients();
                this.getClientsOfMonth();

                this.showSuccess();
            }
        );

    }

    get sortData(): Array<ClientRegistrationRequestModel> {
        return this.clients.sort((unsorted, sorted) => {
            return <any>new Date(sorted.dateGenerated) - <any>new Date(unsorted.dateGenerated);
        });
    }

    getClientsOfMonth(){
        let date = moment().format("MM");
        for(let client of this.clients){
            if(date == moment(client.dateGenerated).format('MM')){
                this.numberOfClients = this.numberOfClients + 1;
            }
        }
    }

    inactiveClients(){
        for(let client of this.clients){
            if(client.userStatus != 1){
                this.numberOfInactiveClients = this.numberOfInactiveClients+1;
            }
        }
    }

    getActiveClients(){
        for(let client of this.clients){
            if(client.userStatus == 1){
                this.numberOfActiveClients = this.numberOfActiveClients+1;
            }
        }
    }

    createClient(addClient) {
        this.modalService.dismissAll();
        addClient.isCompanyPresent = true;
        addClient.avatar = '';
        this.isLoading = true;
        this.usersService.apiUsersClientRegistrationPost(addClient).subscribe(
            () => {
            },
            error => {
                console.log(error);
            },
            () => {
                this.addClient = {};
                this.getClients();
            }
        );

    }

    updateClient(editClient) {
        this.modalService.dismissAll();
        this.isLoading = true;
        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.getClients();
                }else{
                    console.log(error);
                }
            },
            () => {
                this.getClients();
            }
        );

    }

    removeClient(editClient){
        this.modalService.dismissAll();
        this.isLoading = true;
        editClient.userStatus = 4;

        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.getClients();
            }
        );

    }

    lockAccount(editClient){
        this.modalService.dismissAll();
        this.isLoading = true;
        editClient.userStatus = 3;

        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.getClients();
            }
        );

    }

    unlockAccount(editClient){
        this.modalService.dismissAll();
        this.isLoading = true;
        editClient.userStatus = 1;

        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.getClients();
            }
        );

    }

    openModal(value: any, data: any) {
        this.editClient = data;
      this.modalService.open( value);
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
}
