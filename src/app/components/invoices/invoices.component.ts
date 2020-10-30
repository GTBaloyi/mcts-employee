import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {
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
  heading = 'Invoices';
  subheading = 'View and manage all client invoices';
  icon = 'pe-7s-note2 icon-gradient bg-tempting-azure';


  isLoading = true;
   invoices: Array<InvoiceRequestModel> = [];
   employeeInformation : EmployeeRequestModel = <EmployeeRequestModel> {};
   filter : string;
   config: any;

  constructor( public router: Router,public toastr: ToastrService, public invoiceService: InvoiceService) {
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
    this.isLoading = true;

    this.invoiceService.apiInvoiceInvoiceGet().subscribe (
        (data: any) => {
          this.invoices = data;
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          if(this.invoices !== null){
            this.sortData;
          }
          this.showSuccess();
        }
    );
  }

  get sortData(): Array<InvoiceRequestModel> {
    return this.invoices.sort((invoiceUnsorted, invoiceSorted) => {
      return <any>new Date(invoiceSorted.invoice_date) - <any>new Date(invoiceUnsorted.invoice_date);
    });
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

  viewPDF(invoice : InvoiceRequestModel){
    sessionStorage.setItem('viewInvoice', JSON.stringify(invoice));
    this.router.navigateByUrl('/view-invoice-pdf');
  }

}
