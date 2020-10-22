import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { ClientsService } from './api/clients.service';
import { ClientsReportsService } from './api/clientsReports.service';
import { EmployeesService } from './api/employees.service';
import { EmployeesReportsService } from './api/employeesReports.service';
import { EnquiryService } from './api/enquiry.service';
import { GenericServicesService } from './api/genericServices.service';
import { InvoiceService } from './api/invoice.service';
import { MctsKpiReportsService } from './api/mctsKpiReports.service';
import { PaymentService } from './api/payment.service';
import { ProductsService } from './api/products.service';
import { ProjectExpenditureService } from './api/projectExpenditure.service';
import { ProjectProgressService } from './api/projectProgress.service';
import { ProjectTodosService } from './api/projectTodos.service';
import { ProjectsService } from './api/projects.service';
import { QuartersService } from './api/quarters.service';
import { QuotationService } from './api/quotation.service';
import { UsersService } from './api/users.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
