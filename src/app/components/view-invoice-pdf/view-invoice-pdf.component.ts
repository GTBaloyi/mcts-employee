import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import moment = require('moment');
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import {
  ClientRegistrationRequestModel,
  InvoiceRequestModel, InvoiceResponseModel,
  InvoiceService,
  ProductsService,
  QuotationResponseModel,
  QuotationService
} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";


@Component({
  selector: 'app-view-invoice-pdf',
  templateUrl: './view-invoice-pdf.component.html',
  styleUrls: ['./view-invoice-pdf.component.scss']
})
export class ViewInvoicePdfComponent implements OnInit {

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  isLoading = new Subject<boolean>();
  invoice: InvoiceResponseModel = <InvoiceResponseModel>'';
  quotation: QuotationResponseModel = <QuotationResponseModel>'';
  private userInformation : ClientRegistrationRequestModel =  <ClientRegistrationRequestModel>'' ;
  private showModal: boolean;


  constructor(private quotationService: QuotationService,
              private productsService: ProductsService,
              private router: Router,
              private toastr: ToastrService,
              private invoiceService: InvoiceService) {

      this.invoice = JSON.parse(sessionStorage.getItem("viewInvoice"));
      console.log('invoice: ', this.invoice);

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

      this.isLoading.next(false);
    });
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
