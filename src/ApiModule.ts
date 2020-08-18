import {InjectionToken, Injector, NgModule} from "@angular/core";
import {environment} from "./environments/environment";

export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL');



const injector = Injector.create({providers: [{provide: BASE_API_URL, useValue: environment.BASE_API_URL}]});
injector.get(BASE_API_URL);







