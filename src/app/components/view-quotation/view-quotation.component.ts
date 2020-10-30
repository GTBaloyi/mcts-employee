import {Component, OnInit,} from '@angular/core';
import {ClientsService, EmployeeRequestModel, ProductsService, QuotationItemEntity, QuotationResponseModel, QuotationService} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subject} from "rxjs";

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrls: ['./view-quotation.component.scss']
})
export class ViewQuotationComponent implements OnInit {
    heading = 'Quotation';
    subheading = 'Create and view all client quotations';
    icon = 'pe-7s-calculator icon-gradient bg-tempting-azure';


    public selectedProduct: string;
    public selectedQuantity: number;
    public selectedFocusArea: string;
    public selectedNumberOfTest: number = 0;
    public selectedUnitPrice: number = 0;
    public selectedProductTotal: number = 0;
    public selectedReference: string;
    public selectedTotal: number = 0;
    public products: Array<QuotationItemEntity> = [];
    public focusAreas: Array<any> = [];
    public isLoading = new Subject<boolean>();
    public newProduct: QuotationItemEntity  = {};
    public employeeInformation : EmployeeRequestModel;
    public quotation: QuotationResponseModel = <QuotationResponseModel>'';

    constructor(public quotationService: QuotationService,
                public productsService: ProductsService,
                public router: Router,
                public toastr: ToastrService,
                public clientService: ClientsService) {

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

        this.quotationService.apiQuotationQuoteReferenceQuoteReferenceGet(this.quotation.quote_reference).subscribe(
            (data: any) => {
                quotation = data

                if(this.employeeInformation.position == 'General Staff'){
                    quotation.status = 'Pending Manager Approval';
                    quotation.generatedBy = this.employeeInformation.email
                }else{
                    quotation.status = 'Pending Client Approval';
                    quotation.approvedBy = this.employeeInformation.email
                }

                if(quotation.generatedBy == null){
                    quotation.generatedBy = '';
                }
                if(quotation.approvedBy == null){
                    quotation.approvedBy = '';
                }

                quotation.items = this.quotation.items;
                quotation.discount = this.quotation.discount/100;
            },
            error => {
                console.log(error);
                this.isLoading.next(false);
                this.showError();
            },
            () => {
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
                );
            }
        );

    }

    regenerate(quotation){
        this.isLoading.next(true);

        this.quotationService.apiQuotationGenerateQuotePut(quotation).subscribe (
            (data: any) => {
            },
            error => {
                console.log(error);
                this.isLoading.next(false);
                this.showError();
            },
            () => {
                this.getQuotation()
                this.isLoading.next(false);
                this.showSuccess();
            }
        );
    }

    rejectQuotation(quotation){
        this.isLoading.next(true);
        quotation.status = 'Pending';

        this.quotationService.apiQuotationUpdateQuotePut(quotation).subscribe (
            (data: any) => {
            },
            error => {
                console.log(error);
                this.isLoading.next(false);
                this.showError();
            },
            () => {
                this.getQuotation()
                this.isLoading.next(false);
                this.showSuccess();
                this.router.navigateByUrl('/quotation');
            }
        );
    }

    getQuotation(){
        this.isLoading.next(true);
        this.quotationService.apiQuotationQuoteIdGet(this.quotation.quote_id).subscribe (
            (data: any) => {
                this.quotation = data;
            },
            error => {
                console.log(error);
                this.isLoading.next(false);
                this.showError();
            },
            () => {
                sessionStorage.setItem('viewQuotation', JSON.stringify(this.quotation));

                this.isLoading.next(false);
                this.showSuccess();
            }
        );
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

        this.newProduct = {
            id:0,
            focusArea: this.selectedFocusArea,
            item: this.selectedProduct,
            numberOfTests: this.selectedNumberOfTest,
            unit_Price: this.selectedUnitPrice,
            quantity: this.selectedQuantity,
            total: this.selectedProductTotal,
            quote_reference: this.quotation.quote_reference};
        this.quotation.items.push(this.newProduct);
        this.toastr.success('New row added successfully', 'New product');
        return true;
    }

    showManagerMenu(): boolean{
        if(this.employeeInformation.position === 'Manager'){
            return true;
        } else{
            return false;
        }
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
