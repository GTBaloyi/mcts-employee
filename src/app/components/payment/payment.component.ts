import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  isLoading = new Subject<boolean>();
  heading = 'Payments';
  subheading = 'View and manage payments';
  icon = 'pe-7s-home icon-gradient bg-tempting-azure';

  constructor() { }

  ngOnInit() {
  }

}
