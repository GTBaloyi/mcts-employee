import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
  ClientRegistrationRequestModel,
  ClientsService,
  EmployeeRequestModel, ProductsService,
  QuotationItemEntity,
  QuotationModel, QuotationResponseModel,
  QuotationService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import moment = require('moment');
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-add-quotation',
  templateUrl: './add-quotation.component.html',
  styleUrls: ['./add-quotation.component.scss']
})
export class AddQuotationComponent implements OnInit {
  heading = 'Quotation';
  subheading = 'Creat and view all client quotations';
  icon = 'pe-7s-note2 icon-gradient bg-tempting-azure';

  isLoading = new Subject<boolean>();
  private focusAreas: Array<any> = [];
  private selectedFocusArea: string;
  private products: Array<any> = [];
  private selectedProduct: string;
  private quotationID: string;
  private selectedQuantity: number;
  private selectedNumberOfTest: number = 0;
  private selectedUnitPrice: number = 0;
  private selectedProductTotal: number = 0;
  private newProduct: QuotationItemEntity  = {};
  private quotation: QuotationModel= <QuotationModel> {};
  private employeeInformation : EmployeeRequestModel;
  private date: NgbDate;

  constructor(private quotationService: QuotationService, private clientService: ClientsService, private productsService: ProductsService, private router: Router,private toastr: ToastrService) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
  }

  ngOnInit() {
    this.selectedFocusArea = 'Physical Metallurgy';
    this.selectedProduct = 'Non Testing Act (Phys)';
    this.selectedQuantity = 1;

    this.getFocusArea();
    this.getProducts(this.selectedFocusArea)

    let date = moment().format("yyyy-MM-DD");
    this.quotation.date_generated = date.toString();
    this.quotation.items = [];
    this.quotation.description = '';
    this.quotation.reason = '';

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

    this.newProduct = {
      id:0,
      focusArea: this.selectedFocusArea,
      item: this.selectedProduct,
      numberOfTests: this.selectedNumberOfTest,
      unit_Price: this.selectedUnitPrice,
      quantity: this.selectedQuantity,
      total: this.selectedProductTotal,
      quote_reference: this.quotation.quote_reference};
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

    this.quotation.quote_expiryDate = moment(new Date(this.date.year, this.date.month, this.date.day)).format("yyyy-MM-DD");
    this.quotation.discount = this.quotation.discount /100;
    this.quotation.quote_reference = '';
    this.quotation.vatAmount = 0;
    this.quotation.subTotal = 0;
    this.quotation.grand_total = 0;
    this.quotation.status = 'Pending';


    this.quotationService.apiQuotationCreateQuotePost(this.quotation).subscribe(
        (data: any) => {
        },
        error => {
          if (error.status == 200) {
            this.quotationID = error.error.text;
            this.quotationService.apiQuotationQuoteReferenceQuoteReferenceGet(error.error.text).subscribe(
                (data: any) => {
                  this.quotation = data
                },
                error => {
                    console.log(error);
                    this.isLoading.next(false);
                    this.showError();
                },
                () => {
                  this.updateQuotation(this.quotation);
                }
            );

          } else {
            console.log(error);
          }
        }
    )
  }


  updateQuotation(quotation){
    this.isLoading.next(true);

    quotation.status = 'Pending Manager Approval';
    quotation.generatedBy = this.employeeInformation.email;
    quotation.approvedBy = '';

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

            this.quotationService.apiQuotationQuoteReferenceQuoteReferenceGet(this.quotationID).subscribe(
                (data: any) => {
                  this.quotation = data
                },
                error => {
                  console.log(error);
                  this.isLoading.next(false);
                  this.showError();
                },
                () => {
                  sessionStorage.setItem('viewQuotation', JSON.stringify(this.quotation));
                  this.router.navigateByUrl('/view-quotation');
                }
            );

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
