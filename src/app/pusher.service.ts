import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {EmployeeRequestModel} from "./services";
declare const Pusher: any;

@Injectable()
export class PusherService {
  pusher: any;
  messagesChannel: any;
  private employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};


  constructor() {
    this.initializePusher();
    this.employeeInformation = JSON.parse(sessionStorage.getItem('userInformation'));

  }

  initializePusher(): void {
    const channel = this.employeeInformation.surname+" "+this.employeeInformation.name;
    this.pusher = new Pusher(environment.pusher.key, { authEndpoint: 'http://localhost:3000/pusher/auth' });
    this.messagesChannel = this.pusher.subscribe(channel);
  }
}
