import { Component, OnInit } from '@angular/core';
import {TargetSettingModel, TargetSettingsService} from "../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

@Component({
  selector: 'app-target-settings',
  templateUrl: './target-settings.component.html',
  styleUrls: ['./target-settings.component.scss']
})
export class TargetSettingsComponent implements OnInit {
  isLoading = false;

  heading = 'Target Settings';
  subheading = 'Set MCTS targets and overall focus area targets.';
  icon = 'pe-7s-graph1 icon-gradient bg-tempting-azure';

  private config: any;
  private filter : string;
  private targetsArray: Array<TargetSettingModel> = [];
  private target: TargetSettingModel = {};
  private NewTarget: TargetSettingModel = {};
  private selectedCategory: string = '';

  constructor(private targetSettingsService: TargetSettingsService,
              private router: Router,
              private toastr: ToastrService,
              private modalService: NgbModal) {

  }

  ngOnInit() {

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.targetsArray.length
    };
  }

  getTargetsByCategory(category){
    this.selectedCategory = category;
    this.targetsArray = [];
    this.isLoading = true;


    if(category == 'MCTS'){
      this.targetSettingsService.apiTargetSettingsAllGet().subscribe (
          (data: any) => {
            this.targetsArray = data
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

    } else {
      this.targetSettingsService.apiTargetSettingsByCategoryCategoryGet(category).subscribe (
          (data: any) => {
            this.targetsArray = data
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

  }

  addSetTarget(target:any){

    target.id = 0;
    target.q1_actual = 0;
    target.q2_actual = 0;
    target.q3_actual = 0;
    target.q3_actual = 0;
    target.overallTarget = 0;
    target.actualOverallTarget = 0;
    target.category = this.selectedCategory;

    this.isLoading = true;

    this.targetSettingsService.apiTargetSettingsCreatePost(target).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
          this.getTargetsByCategory(this.selectedCategory);
        }
    );

  }


  editSetTarget(target:any){

    this.isLoading = true;

    this.targetSettingsService.apiTargetSettingsUpdatePut(target).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
          this.getTargetsByCategory(this.selectedCategory);
        }
    );

  }

  deleteSetTarget(target:any){

    this.isLoading = true;

    this.targetSettingsService.apiTargetSettingsDeleteIdDelete(target.id).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.isLoading = false;
          this.getTargetsByCategory(this.selectedCategory);
        }
    );

  }

  public convertToPDF() {
    this.isLoading = true;

    let date = moment().format("yyyy-MM-DD");
    let data = document.getElementById('pdfTable');

    html2canvas(data).then(canvas => {
      let imgWidth = 200;
      let pageHeight = 395;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      let position = 3;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      pdf.save(this.selectedCategory+' targets '+date+'.pdf');

      this.isLoading = false;
    });
  }

  openModal(value: any, data: any) {
    this.target = data;
    this.modalService.open( value);
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
