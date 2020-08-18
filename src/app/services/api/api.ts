export * from './clients.service';
import { ClientsService } from './clients.service';
export * from './employees.service';
import { EmployeesService } from './employees.service';
export * from './enquiry.service';
import { EnquiryService } from './enquiry.service';
export * from './invoice.service';
import { InvoiceService } from './invoice.service';
export * from './products.service';
import { ProductsService } from './products.service';
export * from './projects.service';
import { ProjectsService } from './projects.service';
export * from './quotation.service';
import { QuotationService } from './quotation.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [ClientsService, EmployeesService, EnquiryService, InvoiceService, ProductsService, ProjectsService, QuotationService, UsersService];