import { Component, OnInit } from '@angular/core';
import {Message, MessageService} from "../../message.service";
import {ClientRegistrationRequestModel, ClientsService, EmployeeRequestModel, EmployeeResponseModel, EmployeesService} from "../../services";

export interface Users {
  name?: string | null;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Array<Message>;
  heading = '';
  subheading = '';
  icon = '';
  sendTo: string = '';
  user: string;
  private employeeInformation : EmployeeRequestModel;
  private sendToArray: Array<Users> = [];
  name = 'name';


  constructor( private messageService: MessageService,
               private clientService: ClientsService,
               private employeesService: EmployeesService) {
    this.messages = [];
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
  }

  ngOnInit() {
    this.user = this.employeeInformation.surname +" "+this.employeeInformation.name;
    this.messageService.messagesStream.subscribe(this.newMessageEventHandler.bind(this));
    this.getUsers();
  }

  private newMessageEventHandler(event: Message): void {
    this.messages.push(event);
  }

  getUsers() {
      this.employeesService.apiEmployeesGet().subscribe(
          (data: any) => {
              for (let value of data) {
                  this.sendToArray.push({'name': value.surname + " " + value.name});
              }
          },
          error => {
            console.log(error);
          }, () => {
              this.clientService.apiClientsGet().subscribe(
                  (data: ClientRegistrationRequestModel[]) => {
                      for (let value of data) {
                        this.sendToArray.push({'name':value.contactSurname + " " + value.contactName});
                      }
                  }
              );
          }
      );

    console.log('value: ', this.sendToArray);
  }

  changeUsers(value) {
      this.sendTo = value.name;
  }

}
