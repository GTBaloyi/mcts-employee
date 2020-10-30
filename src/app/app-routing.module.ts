import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ClientsComponent} from "./components/clients/clients.component";
import {AuthGuard} from "./services/auth.guard";
import {LandingPageComponent} from "./components/landing-page/landing-page.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {ReportsComponent} from "./components/reports/reports.component";
import {InvoicesComponent} from "./components/invoices/invoices.component";
import {QuotationComponent} from "./components/quotation/quotation.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {EmployeesComponent} from "./components/employees/employees.component";
import {ViewQuotationComponent} from "./components/view-quotation/view-quotation.component";
import {AddQuotationComponent} from "./components/add-quotation/add-quotation.component";
import {ViewInvoicePdfComponent} from "./components/view-invoice-pdf/view-invoice-pdf.component";
import {ProjectDetailsComponent} from "./components/project-details/project-details.component";
import {PaymentDetailsComponent} from "./components/payment-details/payment-details.component";
import {MCTSKIPReportComponent} from "./components/mcts-kip-report/mcts-kip-report.component";
import {QuarterSettingsComponent} from "./components/quarter-settings/quarter-settings.component";
import {ManageProductsComponent} from "./components/manage-products/manage-products.component";
import {MyAccountComponent} from "./components/my-account/my-account.component";
import {UpdatePasswordComponent} from "./components/update-password/update-password.component";
import {TargetSettingsComponent} from "./components/target-settings/target-settings.component";

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
            {path: 'reports', component: ReportsComponent, data: {extraParameter: 'Reports'}},
            {path: 'employees', component: EmployeesComponent, data: {extraParameter: 'Employees'}},
            {path: 'view-quotation', component: ViewQuotationComponent, data: {extraParameter: 'Quotation'}},
            {path: 'add-quotation', component: AddQuotationComponent, data: {extraParameter: 'Quotation'}},
            {path: 'view-invoice-pdf', component: ViewInvoicePdfComponent, data: {extraParameter: 'Invoice'}},
            {path: 'project-details', component: ProjectDetailsComponent, data: {extraParameter: 'Project Details'}},
            {path: 'payment-details', component: PaymentDetailsComponent},
            {path: 'mcts-kip-report', component: MCTSKIPReportComponent},
            {path: 'quarters', component: QuarterSettingsComponent},
            {path: 'products', component: ManageProductsComponent},
            {path: 'account', component: MyAccountComponent},
            {path: 'updatePassword', component: UpdatePasswordComponent},
            {path: 'targets', component: TargetSettingsComponent}

        ],
        canActivate: [AuthGuard]
    },
    {path: 'landing-page', component: LandingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
