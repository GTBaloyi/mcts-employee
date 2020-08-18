import { Component, OnInit } from '@angular/core';
import {ClientRegistrationRequestModel, ClientRegistrationResponseModel, ClientsService} from "../../services";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: ClientRegistrationRequestModel[] = [];
  constructor(private clientService: ClientsService, private modalService: NgbModal) { }

  ngOnInit() {
    this.clientService.apiClientsGet().subscribe((data:[] )=>{
          for(let i =0; i < data.length; i++) {
            this.clients.push(data[i])
          }
        },
        err =>{
          console.log(err);
        },
        ()=>{

          console.log("hiii: "+this.clients)
        }
    );

  }

  openModal(exampleModalContent: any) {
      this.modalService.open( exampleModalContent);
  }
}
