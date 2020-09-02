import { Component, OnInit } from '@angular/core';
import {Color} from "ng2-charts";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {


    heading = 'Analytics Dashboard';
    subheading = 'Summary of available reports';
    icon = 'pe-7s-home icon-gradient bg-tempting-azure';


    public datasets = [
        {
            label: 'My First dataset',
            data: [65, 59, 80, 81, 46, 55, 38, 59, 80],
            datalabels: {
                display: false,
            },

        }
    ];

    public datasets2 = [
        {
            label: 'My First dataset',
            data: [46, 55, 59, 80, 81, 38, 65, 59, 80],
            datalabels: {
                display: false,
            },

        }
    ];

    public datasets3 = [
        {
            label: 'My First dataset',
            data: [65, 59, 80, 81, 55, 38, 59, 80, 46],
            datalabels: {
                display: false,
            },

        }
    ];
    public lineChartColors: Color[] = [
        { // dark grey
            backgroundColor: 'rgba(247, 185, 36, 0.2)',
            borderColor: '#f7b924',
            borderCapStyle: 'round',
            borderDash: [],
            borderWidth: 4,
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointBorderColor: '#f7b924',
            pointBackgroundColor: '#fff',
            pointHoverBorderWidth: 4,
            pointRadius: 6,
            pointBorderWidth: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#f7b924',
        },
    ];

    public lineChartColors2: Color[] = [
        { // dark grey
            backgroundColor: 'rgba(48, 177, 255, 0.2)',
            borderColor: '#30b1ff',
            borderCapStyle: 'round',
            borderDash: [],
            borderWidth: 4,
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointBorderColor: '#30b1ff',
            pointBackgroundColor: '#ffffff',
            pointHoverBorderWidth: 4,
            pointRadius: 6,
            pointBorderWidth: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#30b1ff',
        },
    ];

    public lineChartColors3: Color[] = [
        { // dark grey
            backgroundColor: 'rgba(86, 196, 121, 0.2)',
            borderColor: '#56c479',
            borderCapStyle: 'round',
            borderDash: [],
            borderWidth: 4,
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointBorderColor: '#56c479',
            pointBackgroundColor: '#fff',
            pointHoverBorderWidth: 4,
            pointRadius: 6,
            pointBorderWidth: 5,
            pointHoverRadius: 8,
            pointHitRadius: 10,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#56c479',
        },
    ];

    public labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];

    public options = {
        layout: {
            padding: {
                left: 0,
                right: 8,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    display: false,
                    beginAtZero: true
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    display: false
                },
                gridLines: {
                    display: false
                }
            }]
        },
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false
    };

    ngOnInit() {
    }

}
