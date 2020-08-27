import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.component.html',
  styleUrls: ['./virtual-office.component.scss']
})
export class VirtualOfficeComponent implements OnInit {
  isLoading = new Subject<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
