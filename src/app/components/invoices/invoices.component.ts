import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
  ClientRegistrationRequestModel,
  EmployeeRequestModel,
  InvoiceRequestModel,
  InvoiceService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-invoives',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  isLoading = new Subject<boolean>();
  private invoices: Array<InvoiceRequestModel> = [];
  private employeeInformation : EmployeeRequestModel = <EmployeeRequestModel> {};
  private filter : string;
  private config: any;

  constructor( private router: Router,private toastr: ToastrService, private invoiceService: InvoiceService) {
    sessionStorage.removeItem('viewInvoice');
  }

  ngOnInit() {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
    this.getInvoices();

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.invoices.length
    };
  }

  getInvoices(){
    this.isLoading.next(true);

    this.invoiceService.apiInvoiceInvoiceGet().subscribe (
        (data: any) => {
          this.invoices = data;
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

  viewPDF(invoice : InvoiceRequestModel){
    sessionStorage.setItem('viewInvoice', JSON.stringify(invoice));
    this.router.navigateByUrl('/view-invoice-pdf');
  }

}
