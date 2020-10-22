import { Component } from '@angular/core';
import {MessageService} from "../../message.service";
import {EmployeeRequestModel} from "../../services";

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent {
  user: string;
  message: string;
  private employeeInformation : EmployeeRequestModel;


  constructor(private messageService: MessageService) {
    this.employeeInformation  = JSON.parse(sessionStorage.getItem("userInformation"));

  }

  newMessage(text: string): void {
    const user = this.employeeInformation.surname +" "+this.employeeInformation.name;

    this.messageService.send({text: text, user: user});
    this.message = '';
  }

}
