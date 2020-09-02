import { Component, OnInit } from '@angular/core';
import {ClientRegistrationRequestModel, ClientsService, UsersService} from "../../services";
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
    private numberOfClientsSatisfaction: number = 0


    private config: any;
    private filter : string;
    isLoading = new Subject<boolean>();
    clients: ClientRegistrationRequestModel[] = [];
    addClient: ClientRegistrationRequestModel= {};
    editClient: ClientRegistrationRequestModel= <ClientRegistrationRequestModel>{};
    companyRegistration: string = '';
    private titles: Array<string> = ['Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr'];
    private genders: Array<string> = ['Male', 'Female', 'Other'];
    private companyProfiles: Array<string> = ['Small', 'Large', 'HEIs/Science Council', 'Techno/Star-Entrepreneur'];

    constructor(private router: Router,
                private toastr: ToastrService,
                private clientService: ClientsService,
                private modalService: NgbModal,
                private usersService: UsersService,) {

    }

    ngOnInit() {
        this.addClient.title = 'Mr';
        this.addClient.gender = 'Male';
        this.addClient.companyProfile = 'Small';

        this.getClients();

        this.config = {
            itemsPerPage: 5,
            currentPage: 1,
            totalItems: this.clients.length
        };
    }

    getClients(){
        this.isLoading.next(true);
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
                this.numberOfClientsSatisfaction = 0;

                this.inactiveClients();
                this.getActiveClients();
                this.getClientsOfMonth();
                this.getCustomerSatisfaction();

                this.showSuccess();
            }
        );

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

    getCustomerSatisfaction(){

    }

    createClient(addClient) {
        addClient.isCompanyPresent = true;
        addClient.avatar = '';
        this.isLoading.next(true);
        this.usersService.apiUsersClientRegistrationPost(addClient).subscribe(
            () => {
            },
            error => {
                console.log(error);
                this.showError();
            },
            () => {
                this.modalService.dismissAll();
                this.addClient = {};
                this.getClients();
            }
        );

    }

    updateClient(editClient) {
        this.isLoading.next(true);
        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.modalService.dismissAll();
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.modalService.dismissAll();
                this.getClients();
            }
        );

    }

    removeClient(editClient){
        this.isLoading.next(true);
        editClient.userStatus = 4;

        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.modalService.dismissAll();
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.modalService.dismissAll();
                this.getClients();
            }
        );

    }

    lockAccount(editClient){
        this.isLoading.next(true);
        editClient.userStatus = 3;

        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.modalService.dismissAll();
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.modalService.dismissAll();
                this.getClients();
            }
        );

    }

    unlockAccount(editClient){
        this.isLoading.next(true);
        editClient.userStatus = 1;

        this.clientService.apiClientsUpdateClientPut(editClient).subscribe(
            () => {
            },
            error => {
                if(error.status == 200){
                    this.modalService.dismissAll();
                    this.getClients();
                }else{
                    console.log(error);
                    this.showError();
                }
            },
            () => {
                this.modalService.dismissAll();
                this.getClients();
            }
        );

    }



    openModal(value: any, data: any) {
        this.editClient = data;
      this.modalService.open( value);
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

    pageChanged(event){
        this.config.currentPage = event;
    }
}
