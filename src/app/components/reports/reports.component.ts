import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = new Subject<boolean>();

  heading = 'Reports';
  subheading = 'View and generate reports';
  icon = 'pe-7s-home icon-gradient bg-tempting-azure';

  constructor() { }

  ngOnInit() {
  }

}
