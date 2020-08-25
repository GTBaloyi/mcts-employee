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
            {path: 'dashboard', component: DashboardComponent},
            {path: 'clients', component: ClientsComponent},
            {path: 'invoices', component: InvoicesComponent},
            {path: 'quotation', component: QuotationComponent},
            {path: 'payments', component: PaymentComponent},
            {path: 'projects', component: ProjectsComponent},
            {path: 'productManagement', component: ProductManagementComponent},
            {path: 'reports', component: ReportsComponent},
            {path: 'virtualOffice', component: VirtualOfficeComponent},
            {path: 'employees', component: EmployeesComponent},
            {path: 'view-quotation', component: ViewQuotationComponent},
            {path: 'add-quotation', component: AddQuotationComponent},
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
