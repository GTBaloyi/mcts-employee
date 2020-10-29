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

    private deliveredInTime: Array<PerformanceIndicatorModel> = [];
    private reportData: Array<any> = [];
    private MtechchartTargetData: any = [];
    private MtechchartActualData: any = [];
    private FtechchartActualData: any = [];
    private FtechchartTargetData: any = [];
    private PtechchartActualData: any = [];
    private PtechchartTargetData: any = [];

    mixedChart: Chart;

    pieChart: any = {}
    chartype = '';
    labels = [];


    private numberOfActiveClients: number = 0;
    private numberOfInactiveClients: number = 0;
    private numberOfClients: number = 0;
    private email: string;
    private employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};

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
            }
        );

    }

    overallKPI() {
        this.reportData = this.deliveredInTime;

        for(var i = 0; i < this.deliveredInTime.length ; i++) {
            if (this.deliveredInTime[i].category == 'Moulding Technology') {
                this.MtechchartTargetData = [
                    this.deliveredInTime[i].firstQuarterTarget,
                    this.deliveredInTime[i].secondQuarterTarget,
                    this.deliveredInTime[i].thirdQuarterTarget,
                    this.deliveredInTime[i].fourthQuarterTarget
                ]

                this.MtechchartActualData =  [
                    this.deliveredInTime[i].firstQuarterActual,
                    this.deliveredInTime[i].secondQuarterActual,
                    this.deliveredInTime[i].thirdQuarterActual,
                    this.deliveredInTime[i].fourthQuarterActual
                ];

            }else if(this.deliveredInTime[i].category == 'Foundry Technology'){
                this.FtechchartTargetData = [
                    this.deliveredInTime[i].firstQuarterTarget,
                    this.deliveredInTime[i].secondQuarterTarget,
                    this.deliveredInTime[i].thirdQuarterTarget,
                    this.deliveredInTime[i].fourthQuarterTarget
                ]

                this.FtechchartActualData =  [
                    this.deliveredInTime[i].firstQuarterActual,
                    this.deliveredInTime[i].secondQuarterActual,
                    this.deliveredInTime[i].thirdQuarterActual,
                    this.deliveredInTime[i].fourthQuarterActual
                ];

            }else if(this.deliveredInTime[i].category == 'Physical Technology'){
                this.PtechchartTargetData = [
                    this.deliveredInTime[i].firstQuarterTarget,
                    this.deliveredInTime[i].secondQuarterTarget,
                    this.deliveredInTime[i].thirdQuarterTarget,
                    this.deliveredInTime[i].fourthQuarterTarget
                ]

                this.PtechchartActualData =  [
                    this.deliveredInTime[i].firstQuarterActual,
                    this.deliveredInTime[i].secondQuarterActual,
                    this.deliveredInTime[i].thirdQuarterActual,
                    this.deliveredInTime[i].fourthQuarterActual
                ];
            }
        }
        var dataset = [
                {
                    label: 'Moulding Technology Target',
                    data: this.MtechchartTargetData,
                    backgroundColor: [
                        "#3e95cd",
                        "#3e95cd",
                        "#3e95cd",
                        "#3e95cd"
                    ],
                    borderWidth: 1,
                    order: 1
                },
                {
                    label: 'Moulding Technology Actual Target',
                    data: this.MtechchartActualData,
                    backgroundColor: [
                        "#8e5ea2",
                        "#8e5ea2",
                        "#8e5ea2",
                        "#8e5ea2"
                    ],
                    borderWidth: 1,
                    order: 2
                },
                {
                    label: 'Foundry Technology Target',
                    data: this.FtechchartTargetData,
                    backgroundColor: [
                        "#3cba9f",
                        "#3cba9f",
                        "#3cba9f",
                        "#3cba9f"
                    ],
                    borderWidth: 1,
                    order: 1
                },
                {
                    label: 'Foundry Technology Actual Target',
                    data: this.FtechchartActualData,
                    backgroundColor: [
                        "#e8c3b9",
                        "#e8c3b9",
                        "#e8c3b9",
                        "#e8c3b9"
                    ],
                    borderWidth: 1,
                    order: 2
                },
                {
                    label: 'Physical Technology Target',
                    data: this.PtechchartTargetData,
                    backgroundColor: [
                        "#73c450",
                        "#73c450",
                        "#73c450",
                        "#73c450"
                    ],
                    borderWidth: 1,
                    order: 1
                },
                {
                    label: 'Physical Technology Actual Target',
                    data: this.PtechchartActualData,
                    backgroundColor: [
                        "#c45850",
                        "#c45850",
                        "#c45850",
                        "#c45850"
                    ],
                    borderWidth: 1,
                    order: 2
                }];

        this.chartype = 'bar';
        this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
        this.getChart(dataset);
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

        this.mctsKpiReportsService.apiMctsKpiReportsDeliveredInTimeReportGet().subscribe (
            (data: any) => {
                this.deliveredInTime = data
            },
            error => {
                console.log(error);
            },
            () => {
                this.overallKPI();
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
