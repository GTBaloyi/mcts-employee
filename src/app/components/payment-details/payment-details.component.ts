import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  EmployeeRequestModel,
  InvoiceResponseModel,
  InvoiceService,
  PaymentResponseModel,
  PaymentService
} from "../../services";

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {

  heading = 'Payments';
  subheading = 'View and manage payments';
  icon = 'pe-7s-cash icon-gradient bg-tempting-azure';


  isLoading = new Subject<boolean>();
  public payment: PaymentResponseModel = {};
  public newPayment: PaymentResponseModel = {};
  public invoice: InvoiceResponseModel =<InvoiceResponseModel> '';
  public employeeInformation : EmployeeRequestModel;



  constructor(public toastr: ToastrService,
              public modalService: NgbModal,
              public invoiceService: InvoiceService,
              public paymentService: PaymentService
              ) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
    this.payment  = JSON.parse(sessionStorage.getItem("paymentDetails"));
  }

  ngOnInit() {
    this.getInvoice(this.payment.invoiceReference);
  }

  getInvoice(reference){
    this.isLoading.next(true);
    this.invoiceService.apiInvoiceInvoiceByReferenceInvoiceReferenceGet(reference).subscribe (
        (data: any) => {
          this.invoice = data;
        },
        error => {
          this.isLoading.next(false);
          console.log(error);
        },
        () => {
          this.isLoading.next(false);

        }
    );
  }

  getPayment(){
    this.paymentService.apiPaymentByInvoiceInvoiceReferenceGet(this.payment.invoiceReference).subscribe (
        (data: any) => {
          this.payment = data;
          sessionStorage.setItem('paymentDetails', JSON.stringify(data));
        },
        error => {
          console.log(error);
        },
        () => {
          this.getInvoice(this.payment.invoiceReference);
          this.showSuccess();
        }
    );
  }

  acceptPayment(){
    this.modalService.dismissAll();

    this.payment.status = 'Approved';
    this.payment.approvedBy = this.employeeInformation.email;



    this.isLoading.next(true);
    this.paymentService.apiPaymentUpdatePut(this.payment).subscribe (
        (data: any) => {
          this.invoice = data;
        },
        error => {
          this.isLoading.next(false);
          console.log(error);
        },
        () => {
          this.getPayment();
          this.isLoading.next(false);

        }
    );
  }

  rejectPayment(){
    this.payment.status = 'Rejected';
    this.payment.approvedBy = this.employeeInformation.email;
    this.modalService.dismissAll();


    this.isLoading.next(true);
    this.paymentService.apiPaymentUpdatePut(this.payment).subscribe (
        (data: any) => {
          this.invoice = data;
        },
        error => {
          this.isLoading.next(false);
          console.log(error);
        },
        () => {
          this.getPayment();
          this.isLoading.next(false);
        }
    );
  }



  openModal(value: any, data: any) {
    this.newPayment = data;
    this.modalService.open( value);
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
