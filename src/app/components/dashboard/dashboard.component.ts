import { Component, OnInit } from '@angular/core';
import {Label} from "ng2-charts";
import {
    ClientRegistrationRequestModel,
    ClientsGeneralReportsModel,
    ClientsService,
    EmployeeRequestModel,
    EmployeesReportsService, EmployeesService,
    QuotationGeneralReportModel
} from "../../services";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    heading = 'Analytics Dashboard';
    subheading = 'Summary of available reports';
    icon = 'pe-7s-home icon-gradient bg-tempting-azure';

    public barChartOptions: ChartOptions = {
        responsive: true,
        scales: {xAxes: [{}], yAxes: [{}]},
    };

    public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;

    public barChartData: ChartDataSets[] = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ];


    private numberOfActiveClients: number = 0;
    private numberOfInactiveClients: number = 0;
    private numberOfClients: number = 0;
    private email: string;
    private employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};

    clientsGeneralReports: ClientsGeneralReportsModel = {};
    quotationGeneralReports: QuotationGeneralReportModel = {};
    isLoading = true;
    clients: ClientRegistrationRequestModel[] = [];

    constructor(private router: Router,
                private toastr: ToastrService,
                private employeesReportsService: EmployeesReportsService,
                private clientService: ClientsService,
                private employeesService: EmployeesService) {

    }


    ngOnInit() {
        this.getClients();
        this.getClientsReport();
        this.getQuotationReport();
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

    getClientsReport(){
        this.isLoading = true;
        this.employeesReportsService.apiEmployeesReportsClientsGeneralReportGet().subscribe(
            (data )=>{
                this.clientsGeneralReports = data;
            },
            err =>{
                this.isLoading = false;
            },
            ()=>{
                this.isLoading = false;
            }
        );

    }

    getQuotationReport(){
        this.isLoading = true;
        this.employeesReportsService.apiEmployeesReportsQuotationGeneralReportGet().subscribe(
            (data )=>{
                this.quotationGeneralReports = data;
            },
            err =>{
                this.isLoading = false;


            },
            ()=>{
                this.isLoading = false;

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
                this.isLoading = false;
            },
            ()=>{

                this.numberOfClients = 0;
                this.numberOfActiveClients = 0;
                this.numberOfInactiveClients = 0;

                this.inactiveClients();
                this.getActiveClients();
                this.getClientsOfMonth();

                this.isLoading = false;


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


    public chartHovered({event, active}: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    public randomize(): void {
        this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
    }

    showManagerMenu(): boolean{
        if(this.employeeInformation.position === 'Manager'){
            return true;
        } else{
            return false;
        }
    }
}
