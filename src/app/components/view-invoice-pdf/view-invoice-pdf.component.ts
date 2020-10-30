import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import moment = require('moment');
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import {EmployeeRequestModel, InvoiceResponseModel, ProductsService, QuotationResponseModel, QuotationService} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";
import nodemailer from 'nodemailer';

@Component({
  selector: 'app-view-invoice-pdf',
  templateUrl: './view-invoice-pdf.component.html',
  styleUrls: ['./view-invoice-pdf.component.scss']
})
export class ViewInvoicePdfComponent implements OnInit {
  heading = 'Invoices';
  subheading = 'View and manage all client invoices';
  icon = 'pe-7s-note2 icon-gradient bg-tempting-azure';

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  isLoading = new Subject<boolean>();
  invoice: InvoiceResponseModel = <InvoiceResponseModel>'';
  quotation: QuotationResponseModel = <QuotationResponseModel>'';
  public userInformation : EmployeeRequestModel =  <EmployeeRequestModel>'' ;
  public showModal: boolean;


  constructor(public quotationService: QuotationService,
              public productsService: ProductsService,
              public router: Router,
              public toastr: ToastrService) {

      this.invoice = JSON.parse(sessionStorage.getItem("viewInvoice"));
      this.userInformation  = JSON.parse(sessionStorage.getItem("userInformation"));

  }

  ngOnInit() {

  }


  public convertToPDF() {
    this.isLoading.next(true);

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

      pdf.save('Invoice-'+date+'.pdf');

      pdf.email();

      this.isLoading.next(false);
    });
  }

  public emailPDF() {
    var pdfBase64;
    this.isLoading.next(true);

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

      pdfBase64 = pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

    });

    this.isLoading.next(false);
  }


  show() {
    this.showModal = true;
  }

  hide() {
    this.showModal = false;
  }


  showSuccess() {
    this.toastr.success('Process successfully completed', 'Success', {
      timeOut: 3000,
    });
    this.isLoading.next(false);
  }

  showError() {
    this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
      timeOut: 3000,
    });
    this.isLoading.next(false);
  }
}
