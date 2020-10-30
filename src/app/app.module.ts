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
import { ReportsComponent } from './components/reports/reports.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { PaymentComponent } from './components/payment/payment.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ViewQuotationComponent } from './components/view-quotation/view-quotation.component';
import { AddQuotationComponent } from './components/add-quotation/add-quotation.component'
import {ViewInvoicePdfComponent} from "./components/view-invoice-pdf/view-invoice-pdf.component";
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {ChartsModule, ThemeService} from "ng2-charts";
import {ConfigActions} from "./ThemeOptions/store/config.actions";
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {NgxDocViewerModule} from "ngx-doc-viewer";
import { MCTSKIPReportComponent } from './components/mcts-kip-report/mcts-kip-report.component';
import {ProgressBars} from "ng-uikit-pro-standard";
import { QuarterSettingsComponent } from './components/quarter-settings/quarter-settings.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import {MyAccountComponent} from "./components/my-account/my-account.component";
import {UpdatePasswordComponent} from "./components/update-password/update-password.component";
import { TargetSettingsComponent } from './components/target-settings/target-settings.component';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        DefaultModule,
        ReactiveFormsModule,
        HttpClientModule,
        AutocompleteLibModule,
        ChartsModule,
        PdfViewerModule,
        NgxDocViewerModule,
        ProgressBars
    ],
    declarations: [
        AppComponent,
        LandingPageComponent,
        ContentAnimateDirective,
        ReportsComponent,
        ProjectsComponent,
        InvoicesComponent,
        QuotationComponent,
        PaymentComponent,
        EmployeesComponent,
        ViewQuotationComponent,
        AddQuotationComponent,
        ViewInvoicePdfComponent,
        ProjectDetailsComponent,
        PaymentDetailsComponent,
        MCTSKIPReportComponent,
        QuarterSettingsComponent,
        ManageProductsComponent,
        MyAccountComponent,
        UpdatePasswordComponent,
        TargetSettingsComponent
    ],
    providers: [
        {provide: BASE_API_URL, useValue: environment.BASE_API_URL},
        ConfigActions,
        ThemeService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
