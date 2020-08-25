import {Component, OnInit,} from '@angular/core';
import {EmployeeRequestModel, ProductsService, QuotationItemEntity, QuotationResponseModel, QuotationService} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrls: ['./view-quotation.component.scss']
})
export class ViewQuotationComponent implements OnInit {

    private selectedProduct: string;
    private selectedQuantity: number;
    private selectedFocusArea: string;
    private selectedTotal: number = 0;
    private products: Array<any> = [];
    private focusAreas: Array<any> = [];
    private isLoading = new Subject<boolean>();
    private newProduct: QuotationItemEntity  = {};
    private employeeInformation : EmployeeRequestModel;
    private quotation: QuotationResponseModel = <QuotationResponseModel>'';

    constructor(private quotationService: QuotationService,
                private productsService: ProductsService,
                private router: Router,
                private toastr: ToastrService) {

        this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
        this.quotation = JSON.parse(sessionStorage.getItem("viewQuotation"))
    }

    ngOnInit() {
        this.selectedFocusArea = 'Physical Metallurgy';
        this.selectedProduct = 'Non Testing Act (Phys)';
        this.selectedQuantity = 1;
        this.getFocusArea();
        this.getProducts(this.selectedFocusArea)
    }

    updateQuotation(quotation){
        this.isLoading.next(true);

        if(this.employeeInformation.position == 'General Staff'){
            quotation.status = 'Pending Manager Approval';
            quotation.generatedBy = this.employeeInformation.surname +' '+ this.employeeInformation.name +' '+ ' ( ' + this.employeeInformation.email+ ')'
        }else{
            quotation.status = 'Pending Client Approval';
            quotation.approvedBy = this.employeeInformation.surname +' '+ this.employeeInformation.name +' '+ ' ( ' + this.employeeInformation.email+ ')'

        }

        this.quotationService.apiQuotationGenerateQuotePut(quotation).subscribe (
            (data: any) => {
            },
            error => {
                console.log(error);
                this.isLoading.next(false);
                this.showError();
            },
            () => {
                this.isLoading.next(false);
                this.showSuccess();
                this.router.navigateByUrl('/quotation');

            }
        )
    }

    getFocusArea(){
        this.productsService.apiProductsFocusAreasGet().subscribe (
            (data: any) => {
              this.focusAreas = data
            },
            error => {
              console.log(error);
            },
            () => {
            }
        )
    }

    getProducts(focusArea: any){

        this.selectedFocusArea = focusArea;
        this.products = [];

        this.productsService.apiProductsProductsFocusAreaGet(focusArea).subscribe (
            (data: any ) => {
              this.products = data
            },
            error => {
              console.log(error);
            },
            () => {
            }
        )
    }

    addItem() {
        this.newProduct = {id:0, focusArea: this.selectedFocusArea, item: this.selectedProduct, quantity: this.selectedQuantity, total: this.selectedTotal};
        this.quotation.items.push(this.newProduct);
        this.toastr.success('New row added successfully', 'New product');
        return true;
    }

    deleteItem(index) {
        this.quotation.items.splice(index, 1);
        this.toastr.warning('Product deleted successfully', 'Delete product');
        return true;
    }

    showSuccess() {
        this.toastr.success('Process successfully completed', 'Success', {
          timeOut: 3000,
        });
    }

    showError() {
        this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
          timeOut: 3000,
        });
    }
}
