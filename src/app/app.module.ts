import {NgModule } from '@angular/core';
import {BrowserModule } from '@angular/platform-browser';
import {AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {DefaultModule} from "./components/default/default.module";
import {BASE_API_URL} from "../ApiModule";
import {environment} from "../environments/environment.prod";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LandingPageComponent } from './components/landing-page/landing-page.component';
import {ContentAnimateDirective} from './shared/directives/content-animate.directive';
import { EnquiriesComponent } from './components/enquiries/enquiries.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ReportsComponent } from './components/reports/reports.component';
import { VirtualOfficeComponent } from './components/virtual-office/virtual-office.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { PaymentComponent } from './components/payment/payment.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ViewQuotationComponent } from './components/view-quotation/view-quotation.component';
import { AddQuotationComponent } from './components/add-quotation/add-quotation.component'

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        DefaultModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        LandingPageComponent,
        ContentAnimateDirective,
        EnquiriesComponent,
        ProductManagementComponent,
        ReportsComponent,
        VirtualOfficeComponent,
        ProjectsComponent,
        InvoicesComponent,
        QuotationComponent,
        PaymentComponent,
        EmployeesComponent,
        ViewQuotationComponent,
        AddQuotationComponent
    ],
    providers: [
        {provide: BASE_API_URL, useValue: environment.BASE_API_URL},

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
