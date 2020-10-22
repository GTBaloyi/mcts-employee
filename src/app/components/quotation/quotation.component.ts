import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
  EmployeeRequestModel,
  ProductsService,
  ProjectInformationRequestModel,
  QuotationItemEntity,
  QuotationModel,
  QuotationResponseModel,
  QuotationService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');


@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {

  heading = 'Quotation';
  subheading = 'Create and view all client quotations';
  icon = 'pe-7s-calculator icon-gradient bg-tempting-azure';

  isLoading = true;
  private config: any;
  private filter : string;
  private focusAreas: Array<any> = [];
  private selectedFocusArea: string;
  private products: Array<any> = [];
  private selectedProduct: string;
  private selectedQuantity: number;
  private quotations: Array<QuotationResponseModel>= [];
  private employeeInformation : EmployeeRequestModel;

  constructor(private quotationService: QuotationService,
              private productsService: ProductsService,
              private router: Router,
              private toastr: ToastrService) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
  }
  ngOnInit() {
    this.isLoading = true;

    this.selectedFocusArea = 'Physical Metallurgy';
    this.selectedProduct = 'Non Testing Act (Phys)';
    this.selectedQuantity = 1;

    this.getQuotation();

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.quotations.length
    };
  }


  getFocusArea(){
    this.productsService.apiProductsFocusAreasGet().subscribe (
        (data: any) => {
          this.focusAreas = data
        },
        error => {
          console.log(error);
        },
        () => {
        }
    )
  }

  getProducts(focusArea: any){
    this.selectedFocusArea = focusArea;
    this.products = [];

    this.productsService.apiProductsProductsFocusAreaGet(focusArea).subscribe (
        (data: any ) => {
          this.products = data
        },
        error => {
          console.log(error);
        },
        () => {
        }
    )
  }

  getQuotation(){
    this.quotationService.apiQuotationQuotesGet().subscribe (
        (data: any) => {
          this.quotations = data;
          this.getFocusArea();
          this.getProducts(this.selectedFocusArea)
        },
        error => {
          console.log(error);
          this.showError();

        },
        () => {
          if(this.quotations !== null){
            this.sortData;
          }
          this.showSuccess();
        }
    );
  }

  get sortData(): Array<QuotationResponseModel> {
    return this.quotations.sort((unsorted, sorted) => {
      return <any>new Date(sorted.date_generated) - <any>new Date(unsorted.date_generated);
    });
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

  pageChanged(event){
    this.config.currentPage = event;
  }


  addQuotation() {
    this.router.navigateByUrl('/add-quotation');
  }

  updateQuotation(quotation : QuotationResponseModel){
    sessionStorage.setItem('viewQuotation', JSON.stringify(quotation));
    this.router.navigateByUrl('/view-quotation');
  }
}
