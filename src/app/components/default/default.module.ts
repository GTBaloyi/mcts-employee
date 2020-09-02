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
import {SpinnerComponent} from "../../shared/spinner/spinner.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ChartsModule} from "ng2-charts";
import {ToastrModule } from 'ngx-toastr';
import {NgxPaginationModule} from "ngx-pagination";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {HttpClientModule} from "@angular/common/http";
import {AngularFontAwesomeModule} from "angular-font-awesome";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {LoadingBarRouterModule} from "@ngx-loading-bar/router";
import {NgReduxModule} from "@angular-redux/store";
import {PageTitleComponent} from "../../shared/page-title/page-title.component";
import {HeaderComponent} from "../../shared/header/header.component";
import {UserBoxComponent} from "../../shared/header/elements/user-box/user-box.component";
import {ConfigActions} from "../../ThemeOptions/store/config.actions";


@NgModule({
  declarations: [
      DefaultComponent,
      DashboardComponent,
      FooterComponent,
      DashboardComponent,
      SpinnerComponent,
      ClientsComponent,
      PageTitleComponent,
      HeaderComponent,
      UserBoxComponent
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
      Ng2SearchPipeModule,
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      NgReduxModule,
      LoadingBarRouterModule,
      PerfectScrollbarModule,
      AngularFontAwesomeModule,
      HttpClientModule,
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
        Ng2SearchPipeModule,
        PageTitleComponent

    ],
  providers: [
      ConfigActions,
      DashboardService
  ]
})
export class DefaultModule { }
