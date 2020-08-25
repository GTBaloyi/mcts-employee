import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {


    constructor() {
    }


    ngOnInit() {
    }

    date: Date = new Date();

    visitSaleChartOptions = {
        responsive: true,
        legend: false,
        scales: {
            yAxes: [{
                ticks: {
                    display: false,
                    min: 0,
                    stepSize: 20,
                    max: 80
                },
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(235,237,242,1)',
                    zeroLineColor: 'rgba(235,237,242,1)'
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false,
                    color: 'rgba(0,0,0,1)',
                    zeroLineColor: 'rgba(235,237,242,1)'
                },
                ticks: {
                    padding: 20,
                    fontColor: "#9c9fa6",
                    autoSkip: true,
                },
                categoryPercentage: 0.4,
                barPercentage: 0.4
            }]
        }
    };

    trafficChartData = [
        {
            data: [30, 30, 40],
        }
    ];

    trafficChartLabels = ["Completed", "Overdue", "Inprogress"];

    trafficChartOptions = {
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        legend: false,
    };

    trafficChartColors = [
        {
            backgroundColor: [
                'rgb(106,80,169)',
                'rgb(222,21,75)',
                'rgb(22,198,184)'
            ],
            borderColor: [
                'rgba(106,80,169,0.2)',
                'rgba(1222,21,75,0.2)',
                'rgba(22,198,184,.2)'
            ]
        }
    ];

}