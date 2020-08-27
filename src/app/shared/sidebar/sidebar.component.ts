import { Component, OnInit } from '@angular/core';
import {EmployeeRequestModel, EmployeesService, LoginResponseModel, QuotationModel} from "../../services";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public systemManagement = false;
  public financesCollapsed = false;
  public samplePagesCollapsed = false;
  private email: string;
  private employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};


  constructor(private employeesService: EmployeesService) {
  }

  ngOnInit() {

    this.email  = JSON.parse(sessionStorage.getItem("username"));

    if(this.email != null) {
      this.getEmployeeInformation(this.email);
    }

    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

  public getEmployeeInformation(employeeID: string) {
    this.employeesService.apiEmployeesEmployeeNumberGet(employeeID).subscribe(
        (data: EmployeeRequestModel) => {
          this.employeeInformation = data;
          sessionStorage.setItem('userInformation', JSON.stringify(this.employeeInformation));
        },
        error => {

        },
        () => {
        }
    );
  }
}
