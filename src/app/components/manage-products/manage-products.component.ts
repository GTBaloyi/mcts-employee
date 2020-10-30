import { Component, OnInit } from '@angular/core';
import {
  AllProductsResponseModel,
  FocusAreaModel,
  ProductRequestModel,
  ProductsService,
  QuartersService
} from "../../services";
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

  public config: any;
  public filter : string;
  public item: any;
  public selectedFocusArea: string = "Empty";
  public focusAreaId: number;
  public newFocusArea: string;
  public products: Array<AllProductsResponseModel> = [];
  public product: string;
  public ratePerHour: number;
  public timeStudyPerTest: number;
  public newProduct: ProductRequestModel = {};
  public focusAreas: Array<FocusAreaModel> = [];

  constructor(public quartersService: QuartersService,
              public productsService: ProductsService,
              public router: Router,
              public toastr: ToastrService,
              public modalService: NgbModal) {
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
    this.selectedFocusArea = focusArea.name;
    this.focusAreaId = focusArea.id
    this.products = [];

    this.productsService.apiProductsProductsFocusAreaGet(focusArea.name).subscribe (
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

  addFocusArea(focusArea: string){
    this.isLoading = true;

    this.productsService.apiProductsProductsFocusAreaNamePost(focusArea).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.modalService.dismissAll();
          this.getFocusArea();
        }
    )
  }

  editFocusAreaItem(focusArea: FocusAreaModel){
    this.isLoading = true;

    this.productsService.apiProductsFocusAreaPut(focusArea).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.modalService.dismissAll();
          this.getFocusArea();
        }
    )
  }

  deleteFocusAreaItem(focusArea: string){
    this.isLoading = true;

    this.productsService.apiProductsProductsFocusAreaDelete(focusArea).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.modalService.dismissAll();
          this.getFocusArea();
        }
    )
  }

  addProductItem(){
    this.isLoading = true;

    this.newProduct.id = 0;
    this.newProduct.name = this.product;
    this.newProduct.focusArea = this.focusAreaId;
    this.newProduct.ratePerHour = this.ratePerHour;
    this.newProduct.timeStudyPerTest = this.timeStudyPerTest;

    const focusArea = {
      'name': this.selectedFocusArea,
      'id': this.focusAreaId
    }

    this.productsService.apiProductsProductsPost(this.newProduct).subscribe (
        () => {
        },
        error => {
          this.showError();
          console.log(error);
        },
        () => {
          this.getProducts(focusArea);
          this.modalService.dismissAll();
        }
    )
  }

  editProductItem(value : any){
    this.isLoading = true;
    const product: ProductRequestModel = {};

    product.name = value.item;
    product.id = value.productId;
    product.focusArea = value.focusAreaId;
    product.ratePerHour = value.ratePerHour;
    product.timeStudyPerTest = value.timeStudyPerTest;


    this.productsService.apiProductsProductsPut(product).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.modalService.dismissAll();
          this.getFocusArea();
        }
    )
  }

  deleteProductItem(value: any){
    this.isLoading = true;

    const focusArea = {
      'name': this.selectedFocusArea,
      'id': this.focusAreaId
    }


    this.productsService.apiProductsProductsProductIDDelete(value.productId).subscribe (
        () => {
        },
        error => {
          console.log(error);
          this.showError();
        },
        () => {
          this.modalService.dismissAll();
          this.getProducts(focusArea);
        }
    )
  }

  openModal(value: any, data: any) {
    this.item = data;
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
