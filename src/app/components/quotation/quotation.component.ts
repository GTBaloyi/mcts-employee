import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {EmployeeRequestModel,ProductsService, QuotationItemEntity, QuotationModel, QuotationResponseModel, QuotationService} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');


@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {
  isLoading = new Subject<boolean>();
  private config: any;
  private filter : string;
  private showAddQuotation: boolean;
  private focusAreas: Array<any> = [];
  private selectedFocusArea: string;
  private products: Array<any> = [];
  private selectedProduct: string;
  private selectedQuantity: number;
  private newProduct: QuotationItemEntity  = {};
  private quotation: QuotationModel= <QuotationModel> {};
  private quotations: Array<QuotationResponseModel>= [];
  private productsArray: Array<QuotationItemEntity> = [];
  private employeeInformation : EmployeeRequestModel;

  constructor(private quotationService: QuotationService, private productsService: ProductsService, private router: Router,private toastr: ToastrService) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
  }
  ngOnInit() {
    this.getQuotation();

    this.selectedFocusArea = 'Physical Metallurgy';
    this.selectedProduct = 'Non Testing Act (Phys)';
    this.selectedQuantity = 1;

    this.getFocusArea();
    this.getProducts(this.selectedFocusArea)

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

  requestQuotation(quotation){
    this.isLoading.next(true);

    let date = moment().format("YYYY-MM-DD");

    quotation.quote_reference = '';
    quotation.date_generated = date.toString();
    quotation.quote_expiryDate = date.toString();
    quotation.items = this.productsArray;
    if(this.employeeInformation.position == 'General Staff'){
      quotation.status = 'Pending Manager Approval';
    }else{
      quotation.status = 'Pending Client Approval';
    }

    quotation.approvedBy = this.employeeInformation.surname +" "+ this.employeeInformation.name

    this.quotationService.apiQuotationCreateQuotePost(quotation).subscribe (
        (data: any) => {
        },
        error => {
            console.log(error);
            this.isLoading.next(false);
            this.showError();
        },
        () => {
          this.isLoading.next(false);
          this.showSuccess();
        }
    )

  }


  getQuotation(){
    this.isLoading.next(true);
    this.quotationService.apiQuotationQuotesGet().subscribe (
        (data: any) => {
          this.quotations = data;
        },
        error => {

          console.log(error);
          this.isLoading.next(false);
          this.showError();

        },
        () => {
          this.isLoading.next(false);
          this.showSuccess();
        }
    );

  }


  showSuccess() {
    this.toastr.success('Process successfully completed', 'Success', {
      timeOut: 3000,
    });
  }

  showError() {
    this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
      timeOut: 3000,
    });
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
