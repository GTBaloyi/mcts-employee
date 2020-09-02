import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ClientsComponent} from "./components/clients/clients.component";
import {AuthGuard} from "./services/auth.guard";
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {ProductManagementComponent} from "./components/product-management/product-management.component";
import {ReportsComponent} from "./components/reports/reports.component";
import {VirtualOfficeComponent} from "./components/virtual-office/virtual-office.component";
import {InvoicesComponent} from "./components/invoices/invoices.component";
import {QuotationComponent} from "./components/quotation/quotation.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {EmployeesComponent} from "./components/employees/employees.component";
import {ViewQuotationComponent} from "./components/view-quotation/view-quotation.component";
import {AddQuotationComponent} from "./components/add-quotation/add-quotation.component";
import {ViewInvoicePdfComponent} from "./components/view-invoice-pdf/view-invoice-pdf.component";

const routes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {path: 'dashboard', component: DashboardComponent, data: {extraParameter: 'Dashboard'}},
            {path: 'clients', component: ClientsComponent, data: {extraParameter: 'Clients'}},
            {path: 'invoices', component: InvoicesComponent, data: {extraParameter: 'Invoice'}},
            {path: 'quotation', component: QuotationComponent, data: {extraParameter: 'Quotation'}},
            {path: 'payments', component: PaymentComponent, data: {extraParameter: 'Payments'}},
            {path: 'projects', component: ProjectsComponent, data: {extraParameter: 'Projects'}},
            {path: 'productManagement', component: ProductManagementComponent, data: {extraParameter: 'Product Management'}},
            {path: 'reports', component: ReportsComponent, data: {extraParameter: 'Reports'}},
            {path: 'virtualOffice', component: VirtualOfficeComponent, data: {extraParameter: 'Virtual office'}},
            {path: 'employees', component: EmployeesComponent, data: {extraParameter: 'Employees'}},
            {path: 'view-quotation', component: ViewQuotationComponent, data: {extraParameter: 'Quotation'}},
            {path: 'add-quotation', component: AddQuotationComponent, data: {extraParameter: 'Quotation'}},
            {path: 'view-invoice-pdf', component: ViewInvoicePdfComponent, data: {extraParameter: 'Invoice'}},

        ],
        canActivate: [AuthGuard]
    }
    ,{
        path: 'landing-page',
        component: LandingPageComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
