import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {DashboardService} from "../../services/dashboard.service";
import {ClientsComponent} from "../clients/clients.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FooterComponent} from "../../shared/footer/footer.component";
import {SidebarComponent} from "../../shared/sidebar/sidebar.component";
import {SpinnerComponent} from "../../shared/spinner/spinner.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ChartsModule} from "ng2-charts";
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {ToastrModule } from 'ngx-toastr';
import {NgxPaginationModule} from "ngx-pagination";
import {Ng2SearchPipeModule} from "ng2-search-filter";


@NgModule({
  declarations: [
      DefaultComponent,
      DashboardComponent,
      NavbarComponent,
      SidebarComponent,
      FooterComponent,
      DashboardComponent,
      SpinnerComponent,
      ClientsComponent
  ],
  imports: [

      CommonModule,
      RouterModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      BrowserModule,
      AppRoutingModule,
      NgbModule,
      ChartsModule,
      ToastrModule.forRoot(),
      NgxPaginationModule,
      Ng2SearchPipeModule

  ],
  exports: [

      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      RouterModule,
      SharedModule,
      BrowserAnimationsModule,
      BrowserModule,
      AppRoutingModule,
      NgbModule,
      ChartsModule,
      ToastrModule,
      NgxPaginationModule,
      Ng2SearchPipeModule

  ],
  providers: [
      DashboardService
  ]
})
export class DefaultModule { }
