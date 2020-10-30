import { Component, OnInit } from '@angular/core';
import {ClientsService, EmployeeRequestModel, ProductsService, QuotationItemEntity, QuotationModel, QuotationService} from "../../services";
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
  heading = 'Quotation'
  subheading = 'Create and view all client quotations';
  icon = 'pe-7s-note2 icon-gradient bg-tempting-azure';

  isLoading = false;
  public focusAreas: Array<any> = [];
  public selectedFocusArea: string;
  public products: Array<any> = [];
  public selectedProduct: string;
  public quotationID: string;
  public selectedQuantity: number;
  public selectedNumberOfTest: number = 0;
  public selectedUnitPrice: number = 0;
  public selectedProductTotal: number = 0;
  public newProduct: QuotationItemEntity  = {};
  public quotation: QuotationModel= <QuotationModel> {};
  public employeeInformation : EmployeeRequestModel;
  public date: NgbDate;

  constructor(public quotationService: QuotationService, public clientService: ClientsService, public productsService: ProductsService, public router: Router,public toastr: ToastrService) {
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
    this.isLoading = true;

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
                    this.isLoading = false;
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
    this.isLoading = true;

    quotation.status = 'Pending Manager Approval';
    quotation.generatedBy = this.employeeInformation.email;
    quotation.approvedBy = '';

    this.quotationService.apiQuotationGenerateQuotePut(quotation).subscribe (
        (data: any) => {
        },
        error => {
          console.log(error);
          this.isLoading = false;
          this.showError();
        },
        () => {
          this.isLoading = false;

            this.quotationService.apiQuotationQuoteReferenceQuoteReferenceGet(this.quotationID).subscribe(
                (data: any) => {
                  this.quotation = data
                },
                error => {
                  console.log(error);
                  this.isLoading = false;
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

  showManagerMenu(): boolean{
    if(this.employeeInformation.position === 'Manager'){
      return true;
    } else{
      return false;
    }
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
