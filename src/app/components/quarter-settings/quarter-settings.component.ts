import { Component, OnInit } from '@angular/core';
import { QuarterModel, QuartersService } from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import moment = require('moment');

@Component({
  selector: 'app-quarter-settings',
  templateUrl: './quarter-settings.component.html',
  styleUrls: ['./quarter-settings.component.scss']
})
export class QuarterSettingsComponent implements OnInit {

  heading = 'Quarters';
  subheading = 'View and manage year quarter dates';
  icon = 'pe-7s-settings icon-gradient bg-tempting-azure';

  isLoading = true;
  private config: any;
  private filter : string;
  private quarters: Array<QuarterModel> = [];
  private quarter: QuarterModel = {};
  private StartDate: NgbDate;
  private EndDate: NgbDate;



  constructor(private quartersService: QuartersService,
              private router: Router,
              private toastr: ToastrService,
              private modalService: NgbModal) {

  }

  ngOnInit() {


    this.getQuarters();

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.quarters.length
    };

  }

  getQuarters(){
    this.isLoading = true;

    this.quartersService.apiQuartersAllGet().subscribe (
        (data: any) => {
          this.quarters = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {

          this.isLoading = false;
          this.showSuccess();
        }
    );
  }

  changeQuarter(quarter: QuarterModel ){
    this.isLoading = true;

    quarter.startDate = moment(new Date(this.StartDate.year, this.StartDate.month, this.StartDate.day)).format("yyyy-MM-DD");
    quarter.endDate = moment(new Date(this.EndDate.year, this.EndDate.month, this.EndDate.day)).format("yyyy-MM-DD");


    this.quartersService.apiQuartersPut(quarter).subscribe (
          (data: any) => {
          },
          error => {
            console.log(error);
            this.showError();
          },
          () => {
            this.modalService.dismissAll();
            this.getQuarters();
            this.showSuccess();
          }
      );
  }

  openModal(value: any, data: any) {
    this.quarter = data;
    this.modalService.open( value);
  }

  pageChanged(event){
    this.config.currentPage = event;
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
}


