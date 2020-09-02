import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.component.html',
  styleUrls: ['./enquiries.component.scss']
})
export class EnquiriesComponent implements OnInit {
  heading = 'Enquiries';
  subheading = 'View and respond to customer enquiries';
  icon = 'pe-7s-home icon-gradient bg-tempting-azure';

  isLoading = new Subject<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
