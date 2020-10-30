import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
  ClientRegistrationRequestModel,
  InvoiceResponseModel, InvoiceService,
  PaymentResponseModel,
  PaymentService, ProjectInformationRequestModel
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  heading = 'Payments';
  subheading = 'View and manage payments';
  icon = 'pe-7s-cash icon-gradient bg-tempting-azure';

   config: any;
   filter : string;
  isLoading = true;
   payments: Array<PaymentResponseModel> = [];
   invoice: InvoiceResponseModel =<InvoiceResponseModel> '';
   payment: PaymentResponseModel = <PaymentResponseModel> '';

  constructor( public router: Router,
               public toastr: ToastrService,
               public modalService: NgbModal,
               public invoiceService: InvoiceService,
               public paymentService: PaymentService) {

  }

  ngOnInit() {
    this.getPayments();

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.payments.length
    }
  }

  getPayments(){
    this.isLoading = true;

    this.paymentService.apiPaymentAllGet().subscribe (
        (data: any) => {
          this.payments = data;
        },
        error => {

          console.log(error);
          this.isLoading = false;
          this.showError();
        },
        () => {
          if(this.payments !== null){
            this.sortData;
          }
          this.isLoading = false;
          this.showSuccess();
        }
    );
  }

  paymentDetails(payment){
    sessionStorage.setItem('paymentDetails', JSON.stringify(payment));
    this.router.navigateByUrl('/payment-details');
  }


  get sortData(): Array<PaymentResponseModel> {
    return this.payments.sort((invoiceUnsorted, invoiceSorted) => {
      return <any>new Date(invoiceSorted.dateOfPayment) - <any>new Date(invoiceUnsorted.dateOfPayment);
    });
  }

  pageChanged(event){
    this.config.currentPage = event;
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
