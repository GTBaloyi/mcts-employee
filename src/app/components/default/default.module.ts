import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {DashboardService} from "../../services/dashboard.service";
import {ClientsComponent} from "../clients/clients.component";
import {UserDialogComponent, UserLoginComponent} from "../user-login/user-login.component";
import {ClientRegistrationComponent} from "../client-registration/client-registration.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PasswordResetComponent} from "../password-reset/password-reset.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {SidebarComponent} from "../../shared/sidebar/sidebar.component";
import {SpinnerComponent} from "../../shared/spinner/spinner.component";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../../app-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ChartsModule} from "ng2-charts";
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {ToastModule} from "ng-uikit-pro-standard";


@NgModule({
  declarations: [
      DefaultComponent,
      DashboardComponent,
      UserLoginComponent,
      UserDialogComponent,
      ClientRegistrationComponent,
      PasswordResetComponent,
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
      ToastModule

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
      ToastModule

  ],
  providers: [
      DashboardService
  ]
})
export class DefaultModule { }
