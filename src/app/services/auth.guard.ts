import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {LoginResponseModel} from "./index";


@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    private loggedIn: boolean;
    private userStatus: number;
    private loginInfo: LoginResponseModel = null;
    private password: string;
    private username: string;
    private accessLevel: number;

    constructor(private router: Router) {

    }


    userValidation(user: LoginResponseModel, password: string, username: string){
        this.loggedIn = user.loggedIn;
        this.password = password;
        this.username =  username;
        this.userStatus = user.userStatus;
        this.accessLevel = user.accessLevel;
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

        if(this.loginInfo != null) {

            if(this.userStatus == null){
                this.userStatus = this.loginInfo.userStatus;
            }

            if(this.loggedIn == null){
                this.loggedIn = this.loginInfo.loggedIn;
            }

            if (this.loggedIn) {
                    return true;
            }else {
                this.router.navigate(['/landing-page']);
                return false;
            }
        }else {
            this.router.navigate(['/landing-page']);
            return false;
        }
    }
}