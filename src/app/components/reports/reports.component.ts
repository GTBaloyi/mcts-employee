import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import moment = require('moment');
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
// @ts-ignore
import {GeneralProjectReportsModel, GeneralQuotationReport, MctsKpiReportsService, PerformanceIndicatorModel, ProjectsEntryModel,} from "../../services";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import Chart from "chart.js";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = false;

  heading = 'Reports';
  subheading = 'View and generate reports';
  icon = 'pe-7s-graph1 icon-gradient bg-tempting-azure';

  private config: any;
  private filter : string;
  private reportData: Array<any> = [];
  private category: string = '';
  private showChart: boolean = false;
  private  selectedTitle: string = '';

  private deliveredInTime: Array<PerformanceIndicatorModel> = [];
  private customerSatisfaction: Array<PerformanceIndicatorModel> = [];
  private focusAreaFinal: Array<ProjectsEntryModel> = [];
  private focusAreaFinalTable: Array<ProjectsEntryModel> = [];


  private generalProjectData: GeneralProjectReportsModel = {};
  private generalQuotationData: GeneralQuotationReport = {};

  private FocusAreaFinalProjectsData = [];

  private chartActualData: any = [];
  private chartTargetData: any = [];

  private MtechchartTargetData: any = [];
  private MtechchartActualData: any = [];
  private FtechchartActualData: any = [];
  private FtechchartTargetData: any = [];
  private PtechchartActualData: any = [];
  private PtechchartTargetData: any = [];

  private OtherchartFocusArea: any = [];
  private MtechchartFocusArea: any = [];
  private FtechchartFocusArea: any = [];
  private PtechchartFocusArea: any = [];
  private StechchartFocusArea: any = [];

  mixedChart: Chart;

  pieChart: any = {}
  chartype = '';
  labels = [];

  constructor(public mctsKpiReportsService: MctsKpiReportsService,
              public router: Router,
              public toastr: ToastrService,
              public  modalService: NgbModal) {

  }

  ngOnInit() {
    this.getReports();

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.reportData.length
    };

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

  overallKPI(category, title) {
    this.category = category;
    this.selectedTitle = title;

    this.reportData = [];
    this.focusAreaFinalTable = [];

    if(title == 'Projects Delivered in time') {
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
    else if (title == 'Percentage Customer Satisfaction') {

      this.reportData = this.customerSatisfaction;

      for(var i = 0; i < this.customerSatisfaction.length ; i++) {
        if (this.customerSatisfaction[i].category == 'Moulding Technology') {
          this.MtechchartTargetData = [
            this.customerSatisfaction[i].firstQuarterTarget,
            this.customerSatisfaction[i].secondQuarterTarget,
            this.customerSatisfaction[i].thirdQuarterTarget,
            this.customerSatisfaction[i].fourthQuarterTarget
          ]

          this.MtechchartActualData =  [
            this.customerSatisfaction[i].firstQuarterActual,
            this.customerSatisfaction[i].secondQuarterActual,
            this.customerSatisfaction[i].thirdQuarterActual,
            this.customerSatisfaction[i].fourthQuarterActual
          ];

        }else if(this.deliveredInTime[i].category == 'Foundry Technology'){
          this.FtechchartTargetData = [
            this.customerSatisfaction[i].firstQuarterTarget,
            this.customerSatisfaction[i].secondQuarterTarget,
            this.customerSatisfaction[i].thirdQuarterTarget,
            this.customerSatisfaction[i].fourthQuarterTarget
          ]

          this.FtechchartActualData =  [
            this.customerSatisfaction[i].firstQuarterActual,
            this.customerSatisfaction[i].secondQuarterActual,
            this.customerSatisfaction[i].thirdQuarterActual,
            this.customerSatisfaction[i].fourthQuarterActual
          ];

        }else if(this.deliveredInTime[i].category == 'Physical Technology'){
          this.PtechchartTargetData = [
            this.customerSatisfaction[i].firstQuarterTarget,
            this.customerSatisfaction[i].secondQuarterTarget,
            this.customerSatisfaction[i].thirdQuarterTarget,
            this.customerSatisfaction[i].fourthQuarterTarget
          ]

          this.PtechchartActualData =  [
            this.customerSatisfaction[i].firstQuarterActual,
            this.customerSatisfaction[i].secondQuarterActual,
            this.customerSatisfaction[i].thirdQuarterActual,
            this.customerSatisfaction[i].fourthQuarterActual
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
    }else if (title == 'Focus Areas') {

      this.reportData = this.focusAreaFinal;

      this.MtechchartFocusArea = [
        this.focusAreaFinal[0].mouldingTechProjects,
        this.focusAreaFinal[1].mouldingTechProjects,
        this.focusAreaFinal[2].mouldingTechProjects,
        this.focusAreaFinal[3].mouldingTechProjects
      ]

      this.OtherchartFocusArea =  [
        this.focusAreaFinal[0].otherProjects,
        this.focusAreaFinal[1].otherProjects,
        this.focusAreaFinal[2].otherProjects,
        this.focusAreaFinal[3].otherProjects
      ];

      this.StechchartFocusArea =  [
        this.focusAreaFinal[0].supportTechProjects,
        this.focusAreaFinal[1].supportTechProjects,
        this.focusAreaFinal[2].supportTechProjects,
        this.focusAreaFinal[3].supportTechProjects
      ];

      this.FtechchartActualData =  [
        this.focusAreaFinal[0].foundryTechProjects,
        this.focusAreaFinal[1].foundryTechProjects,
        this.focusAreaFinal[2].foundryTechProjects,
        this.focusAreaFinal[3].foundryTechProjects
      ];

      this.PtechchartFocusArea =  [
        this.focusAreaFinal[0].physicalMetallurgyProjects,
        this.focusAreaFinal[1].physicalMetallurgyProjects,
        this.focusAreaFinal[2].physicalMetallurgyProjects,
        this.focusAreaFinal[3].physicalMetallurgyProjects
      ];

      var data = [
        {
        label: 'Moulding Technology projects',
        data: this.MtechchartFocusArea,
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
          label: 'Support Technology Actual Projects',
          data: this.StechchartFocusArea,
          backgroundColor: [
            "#8e5ea2",
            "#8e5ea2",
            "#8e5ea2",
            "#8e5ea2",
          ],
          borderWidth: 1,
          order: 2
        },
        {
          label: 'Foundry Technology Actual Projects',
          data: this.FtechchartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
          ],
          borderWidth: 1,
          order: 2
        },
        {
          label: 'Physical Technology Target',
          data: this.PtechchartFocusArea,
          backgroundColor: [
            "#e8c3b9",
            "#e8c3b9",
            "#e8c3b9",
            "#e8c3b9",
          ],
          borderWidth: 1,
          order: 1
        },
        {
          label: 'Other Projects',
          data: this.OtherchartFocusArea,
          backgroundColor: [
            "#c45850",
            "#c45850",
            "#c45850",
            "#c45850",

          ],
          borderWidth: 1,
          order: 1
        }
        ]
      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
      this.focusAreaFinalTable = this.focusAreaFinal;
      this.getChart(data);
    }
  }

  mouldingTechnologyKPI(category, title) {
    this.reportData = [];
    this.focusAreaFinalTable = [];

    this.category = category;
    this.selectedTitle = title;
    var filterByCategory : PerformanceIndicatorModel = {};

    if(title == 'Projects Delivered in time') {

      for(var i = 0; i < this.deliveredInTime.length ; i++) {
        if (this.deliveredInTime[i].category == category) {
           filterByCategory = this.deliveredInTime[i]
        }
      }

      this.reportData.push(filterByCategory);

      this.chartTargetData = [
          filterByCategory.firstQuarterTarget,
          filterByCategory.secondQuarterTarget,
          filterByCategory.thirdQuarterTarget,
          filterByCategory.fourthQuarterTarget
      ]

       this.chartActualData =  [
           filterByCategory.firstQuarterActual,
           filterByCategory.secondQuarterActual,
           filterByCategory.thirdQuarterActual,
           filterByCategory.fourthQuarterActual
       ];

      var dataset = [
        {
          label: 'Set Target',
          data: this.chartTargetData,
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
          label: 'Actual Target',
          data: this.chartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f"
          ],
          borderWidth: 1,
          order: 2
        }];

      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
      this.getChart(dataset);

    } else if (title == 'Percentage Customer Satisfaction') {

      for(var i = 0; i < this.customerSatisfaction.length ; i++) {
        if (this.customerSatisfaction[i].category == category) {
          filterByCategory = this.customerSatisfaction[i]
        }
      }

      this.reportData.push(filterByCategory);

      this.chartTargetData = [
        filterByCategory.firstQuarterTarget,
        filterByCategory.secondQuarterTarget,
        filterByCategory.thirdQuarterTarget,
        filterByCategory.fourthQuarterTarget
      ]

      this.chartActualData =  [
        filterByCategory.firstQuarterActual,
        filterByCategory.secondQuarterActual,
        filterByCategory.thirdQuarterActual,
        filterByCategory.fourthQuarterActual
      ];

      var dataset = [
        {
          label: 'Set Target',
          data: this.chartTargetData,
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
          label: 'Actual Target',
          data: this.chartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f"
          ],
          borderWidth: 1,
          order: 2
        }];
      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
      this.getChart(dataset);
    }
  }

  foundryTechnologyKPI(category, title) {
    this.reportData = [];
    this.focusAreaFinalTable = [];


    this.category = category;
    this.selectedTitle = title;
    var filterByCategory : PerformanceIndicatorModel = {};

    if(title == 'Projects Delivered in time') {

      for(var i = 0; i < this.deliveredInTime.length ; i++) {
        if (this.deliveredInTime[i].category == category) {
          filterByCategory = this.deliveredInTime[i]
        }
      }

      this.reportData.push(filterByCategory);

      this.chartTargetData = [
        filterByCategory.firstQuarterTarget,
        filterByCategory.secondQuarterTarget,
        filterByCategory.thirdQuarterTarget,
        filterByCategory.fourthQuarterTarget
      ]

      this.chartActualData =  [
        filterByCategory.firstQuarterActual,
        filterByCategory.secondQuarterActual,
        filterByCategory.thirdQuarterActual,
        filterByCategory.fourthQuarterActual
      ];

      var dataset = [
        {
          label: 'Set Target',
          data: this.chartTargetData,
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
          label: 'Actual Target',
          data: this.chartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f"
          ],
          borderWidth: 1,
          order: 2
        }];
      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
      this.getChart(dataset);

    } else if (title == 'Percentage Customer Satisfaction') {


      for(var i = 0; i < this.customerSatisfaction.length ; i++) {
        if (this.customerSatisfaction[i].category == category) {
          filterByCategory = this.customerSatisfaction[i]
        }
      }

      this.reportData.push(filterByCategory);

      this.chartTargetData = [
        filterByCategory.firstQuarterTarget,
        filterByCategory.secondQuarterTarget,
        filterByCategory.thirdQuarterTarget,
        filterByCategory.fourthQuarterTarget
      ]

      this.chartActualData =  [
        filterByCategory.firstQuarterActual,
        filterByCategory.secondQuarterActual,
        filterByCategory.thirdQuarterActual,
        filterByCategory.fourthQuarterActual
      ];

      var dataset = [
        {
          label: 'Set Target',
          data: this.chartTargetData,
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
          label: 'Actual Target',
          data: this.chartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f"
          ],
          borderWidth: 1,
          order: 2
        }];
      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
      this.getChart(dataset);

    }
  }

  physicalMetallurgyKPI(category, title) {
    this.reportData = [];
    this.focusAreaFinalTable = [];


    this.category = category;
    this.selectedTitle = title;
    var filterByCategory : PerformanceIndicatorModel = {};


    if(title == 'Projects Delivered in time') {
      for(var i = 0; i < this.deliveredInTime.length ; i++) {
        if (this.deliveredInTime[i].category == category) {
          filterByCategory = this.deliveredInTime[i]
        }
      }

      this.reportData.push(filterByCategory);

      this.chartTargetData = [
        filterByCategory.firstQuarterTarget,
        filterByCategory.secondQuarterTarget,
        filterByCategory.thirdQuarterTarget,
        filterByCategory.fourthQuarterTarget
      ]

      this.chartActualData =  [
        filterByCategory.firstQuarterActual,
        filterByCategory.secondQuarterActual,
        filterByCategory.thirdQuarterActual,
        filterByCategory.fourthQuarterActual
      ];

      var dataset = [
        {
          label: 'Set Target',
          data: this.chartTargetData,
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

          label: 'Actual Target',
          data: this.chartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
          ],
          borderWidth: 1,
          order: 2
        }];
      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];

      this.getChart(dataset);

    } else if (title == 'Percentage Customer Satisfaction') {

      for(var i = 0; i < this.customerSatisfaction.length ; i++) {
        if (this.customerSatisfaction[i].category == category) {
          filterByCategory = this.customerSatisfaction[i]
        }
      }

      this.reportData.push(filterByCategory);

      this.chartTargetData = [
        filterByCategory.firstQuarterTarget,
        filterByCategory.secondQuarterTarget,
        filterByCategory.thirdQuarterTarget,
        filterByCategory.fourthQuarterTarget
      ]

      this.chartActualData =  [
        filterByCategory.firstQuarterActual,
        filterByCategory.secondQuarterActual,
        filterByCategory.thirdQuarterActual,
        filterByCategory.fourthQuarterActual
      ];

      var dataset = [
        {
          label: 'Set Target',
          data: this.chartTargetData,
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

          label: 'Actual Target',
          data: this.chartActualData,
          backgroundColor: [
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
            "#3cba9f",
          ],
          borderWidth: 1,
          order: 2
        }];
      this.chartype = 'bar';
      this.labels = ['Quarter 1','Quarter 2','Quarter 3','Quarter 4'];
      this.getChart(dataset);

    }
  }

  generalReports(category, title) {
    this.category = category;
    this.selectedTitle = title;

    if (title == 'Quotations Report'){
      this.chartype = 'pie';
      this.labels = ['Pending Client Approval','Pending Manager Approval','Pending Attendance','Accepted', 'Rejected'];
      var dataset = [
        {
          label: '',
          data: [this.generalQuotationData.pendingClientApproval, this.generalQuotationData.pendingManagerApproval, this.generalQuotationData.pendingAttendance, this.generalQuotationData.accepted, this.generalQuotationData.rejected],
          backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9", "#c45850"],
        }];

      console.log(this.generalQuotationData)


      this.getChart(dataset);

    }else if (title == 'Projects Report'){

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

  }

  getReports(){
    this.mctsKpiReportsService.apiMctsKpiReportsCustomerSatisfactionGet().subscribe (
        (data: any) => {
          this.customerSatisfaction = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
        }
    );

    this.mctsKpiReportsService.apiMctsKpiReportsDeliveredInTimeReportGet().subscribe (
        (data: any) => {
          this.deliveredInTime = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
        }
    );

    this.mctsKpiReportsService.apiMctsKpiReportsGeneralProjectsGet().subscribe (
        (data: any) => {
          this.generalProjectData = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
        }
    );

    this.mctsKpiReportsService.apiMctsKpiReportsGeneralQuotationGet().subscribe (
        (data: any) => {
          this.generalQuotationData = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
        }
    );


    this.mctsKpiReportsService.apiMctsKpiReportsFocusAreaFinalProjectsGet().subscribe (
        (data: any) => {
          this.FocusAreaFinalProjectsData = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
        }
    );

    this.mctsKpiReportsService.apiMctsKpiReportsFocusAreaFinalProjectsGet().subscribe (
        (data: any) => {
          this.focusAreaFinal = data
          this.focusAreaFinalTable = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
        }
    );
  }

  public convertToPDF() {
    this.isLoading = true;

    let date = moment().format("yyyy-MM-DD");
    let data = document.getElementById('pdfTable');

    html2canvas(data).then(canvas => {
      let imgWidth = 200;
      let imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      let position = 3;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save(this.selectedTitle+' report '+date+'.pdf');

      this.isLoading = false;
    });
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  showSuccess() {
    this.modalService.dismissAll();
    this.toastr.success('Process successfully completed', 'Success', {
      timeOut: 3000,
    });
    this.isLoading = false;
  }

  showError() {
    this.modalService.dismissAll();

    this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
      timeOut: 3000,
    });
    this.isLoading = false;
  }

}