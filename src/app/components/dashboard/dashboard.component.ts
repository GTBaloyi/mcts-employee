import { Component, OnInit } from '@angular/core';

// @ts-ignore
import {ClientRegistrationRequestModel, ClientsGeneralReportsModel, ClientsService, EmployeeRequestModel, EmployeesReportsService, EmployeesService, GeneralProjectReportsModel, GeneralQuotationReport, MctsKpiReportsService, PerformanceIndicatorModel, ProjectsEntryModel, QuotationGeneralReportModel} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');
import Chart, {ChartDataSets, ChartOptions, ChartType} from "chart.js";


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    heading = 'Analytics Dashboard';
    subheading = 'Summary of available reports';
    icon = 'pe-7s-home icon-gradient bg-tempting-azure';

    public generalProjectData: GeneralProjectReportsModel = {};
    public reportData: Array<any> = [];
    public MtechchartTargetData: any = [];
    public MtechchartActualData: any = [];
    public FtechchartActualData: any = [];
    public FtechchartTargetData: any = [];
    public PtechchartActualData: any = [];
    public PtechchartTargetData: any = [];

    mixedChart: Chart;

    pieChart: any = {}
    chartype = '';
    labels = [];


    public numberOfActiveClients: number = 0;
    public numberOfInactiveClients: number = 0;
    public numberOfClients: number = 0;
    public email: string;
    public employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};

    clientsGeneralReports: ClientsGeneralReportsModel = {};
    quotationGeneralReports: QuotationGeneralReportModel = {};
    isLoading = true;
    clients: ClientRegistrationRequestModel[] = [];


    constructor(public router: Router,
                public mctsKpiReportsService: MctsKpiReportsService,
                public toastr: ToastrService,
                public employeesReportsService: EmployeesReportsService,
                public clientService: ClientsService,
                public employeesService: EmployeesService) {

    }


    ngOnInit() {
        this.getReports()
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
                this.overallKPI();
            }
        );
    }

    overallKPI() {

        this.chartype = 'pie';
        this.labels = ['Ongoing Projects','Completed Projects','Not Started Projects','Paused Projects'];
        var data = [
            {
                label: '',
                data: [this.generalProjectData.ongoingProjects, this.generalProjectData.completedProjects, this.generalProjectData.notStartedProjects, this.generalProjectData.pausedProjects],
                backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
            }];
        this.getChart(data);

    }

    getChart(dataset) {

        if (this.mixedChart) {
            this.mixedChart.destroy();
        }

        this.mixedChart = new Chart('myChart', {
            type: this.chartype,
            data: {
                datasets:dataset,
                labels: this.labels
            },
            options: {
            }
        });
        this.mixedChart.update();
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

    getReports(){

        this.mctsKpiReportsService.apiMctsKpiReportsGeneralProjectsGet().subscribe (
            (data: any) => {
                this.generalProjectData = data
            },
            error => {
                console.log(error);
            },
            () => {
                this.isLoading = false;
            }
        );

    }

    showManagerMenu(): boolean{
        if(this.employeeInformation.position === 'Manager'){
            return true;
        } else{
            return false;
        }
    }
}
