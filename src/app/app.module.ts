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
import {ContentAnimateDirective} from './shared/directives/content-animate.directive'

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
        ContentAnimateDirective
    ],
    providers: [
        {provide: BASE_API_URL, useValue: environment.BASE_API_URL},

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
