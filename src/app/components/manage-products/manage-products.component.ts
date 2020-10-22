import { Component, OnInit } from '@angular/core';
import {AllProductsResponseModel, FocusAreaModel, ProductsService, QuartersService} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {

  heading = 'Products';
  subheading = 'View and manage products and focus areas';
  icon = 'pe-7s-settings icon-gradient bg-tempting-azure';

  isLoading = false;

  private config: any;
  private filter : string;
  private product: AllProductsResponseModel;
  private selectedFocusArea: string = "None";
  private focusArea: FocusAreaModel;
  private products: Array<AllProductsResponseModel> = [];
  private focusAreas: Array<FocusAreaModel> = [];

  constructor(private quartersService: QuartersService,
              private productsService: ProductsService,
              private router: Router,
              private toastr: ToastrService,
              private modalService: NgbModal) {

  }

  ngOnInit() {

    this.getFocusArea();

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.focusAreas.length
    };
  }

  getFocusArea(){
    this.productsService.apiProductsFocusAreasGet().subscribe (
        (data: any) => {
          this.focusAreas = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.showSuccess();
        }
    )
  }

  getProducts(focusArea: any){
    this.isLoading = true;
    this.selectedFocusArea = focusArea
    this.products = [];

    this.productsService.apiProductsProductsFocusAreaGet(focusArea).subscribe (
        (data: any ) => {
          this.products = data
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.showSuccess();
        }
    )
  }

  openModal(value: any, data: any) {
    this.product = data;
    this.modalService.open( value);
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

}
