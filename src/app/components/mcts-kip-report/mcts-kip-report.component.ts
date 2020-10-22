import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";

import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MctsKpiReportsService, MctsKpiSummaryTile} from "../../services";

@Component({
  selector: 'app-mcts-kip-report',
  templateUrl: './mcts-kip-report.component.html',
  styleUrls: ['./mcts-kip-report.component.scss']
})
export class MCTSKIPReportComponent implements OnInit {

  heading = 'MCTS KPI Reports';
  subheading = 'View and download all MCTS KPI Reports';
  icon = 'pe-7s-graph2 icon-gradient bg-tempting-azure';

  isLoading = new Subject<boolean>();

  private mctsKpiReport : MctsKpiSummaryTile = {}

  constructor(private router: Router,
              private mctsKpiReportsService: MctsKpiReportsService,
              private toastr: ToastrService) {
  }


  ngOnInit() {
    this.getMctsKpiReports();
  }


  getMctsKpiReports(){
    this.isLoading.next(true);
    this.mctsKpiReportsService.apiMctsKpiReportsMctsKpiSummaryTilesGet().subscribe (
        (data: any) => {
          this.mctsKpiReport = data;
        },
        error => {
          console.log(error);
          this.isLoading.next(false);
        },
        () => {
          this.isLoading.next(false);
        }
    );
  }
}
