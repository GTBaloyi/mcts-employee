import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  isLoading = new Subject<boolean>();

  heading = 'Products';
  subheading = 'View and manage product';
  icon = 'pe-7s-home icon-gradient bg-tempting-azure';

  constructor() { }

  ngOnInit() {
  }

}
