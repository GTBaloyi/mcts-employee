import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
  EmployeeRequestModel, ProductsService,
  QuotationItemEntity,
  QuotationModel,
  QuotationResponseModel,
  QuotationService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');


@Component({
  selector: 'app-add-quotation',
  templateUrl: './add-quotation.component.html',
  styleUrls: ['./add-quotation.component.scss']
})
export class AddQuotationComponent implements OnInit {

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
    this.selectedFocusArea = 'Physical Metallurgy';
    this.selectedProduct = 'Non Testing Act (Phys)';
    this.selectedQuantity = 1;

    this.getFocusArea();
    this.getProducts(this.selectedFocusArea)

    let date = moment().format("YYYY-MM-DD");
    this.quotation.date_generated = date.toString();

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

  addItem() {
    this.newProduct = {id:0, focusArea: this.selectedFocusArea, item: this.selectedProduct, quantity: this.selectedQuantity, total: 0};
    this.quotation.items.push(this.newProduct);
    this.toastr.success('New row added successfully', 'New product');
    return true;
  }

  deleteItem(index) {
    this.quotation.items.splice(index, 1);
    this.toastr.warning('Product deleted successfully', 'Delete product');
    return true;
  }

  requestQuotation(){
    this.isLoading.next(true);
    let date = moment().format("YYYY-MM-DD");

    this.quotation.quote_reference = '';
    this.quotation.date_generated = date.toString();
    this.quotation.quote_expiryDate = date.toString();
    this.quotation.subTotal = 0;
    this.quotation.globalDiscount = 0;
    this.quotation.globalTax = 0;
    this.quotation.grand_total = 0;
    this.quotation.items = this.quotation.items;
    this.quotation.status = 'Pending';

    this.quotationService.apiQuotationCreateQuotePost(this.quotation).subscribe(
        (data: any) => {
          data;
        },
        error => {
          if (error.status == 200) {
            this.isLoading.next(false);
            this.showSuccess();

          } else {
            console.log(error);
            this.isLoading.next(false);
            this.showError();
          }
        },
        () => {
          this.updateQuotation(this.quotation);
        }
    )
  }


  updateQuotation(quotation){
    this.isLoading.next(true);

    if(this.employeeInformation.position == 'General Staff'){
      quotation.status = 'Pending Manager Approval';
      quotation.generatedBy = this.employeeInformation.surname +' '+ this.employeeInformation.name +' '+ ' ( ' + this.employeeInformation.email+ ')'
    }else{
      quotation.status = 'Pending Client Approval';
      quotation.approvedBy = this.employeeInformation.surname +' '+ this.employeeInformation.name +' '+ ' ( ' + this.employeeInformation.email+ ')'

    }

    this.quotationService.apiQuotationGenerateQuotePut(quotation).subscribe (
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
          this.router.navigateByUrl('/quotation');

        }
    )
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

}
