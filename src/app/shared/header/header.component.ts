import {Component, HostBinding, HostListener} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ThemeOptions} from "../../theme-options";
import {ActivatedRoute} from "@angular/router";
import {EmployeeRequestModel, EmployeesService} from "../../services";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public extraParameter: any;

  constructor(public globals: ThemeOptions, private activatedRoute: ActivatedRoute, private employeesService: EmployeesService) {
  }

  @HostBinding('class.isActive')
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;

  @select('config') public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 'dashboardsMenu';
  private email: string;
  private employeeInformation : EmployeeRequestModel= <EmployeeRequestModel> {};

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  ngOnInit() {
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });

    this.extraParameter = this.activatedRoute.snapshot.firstChild.data.extraParameter;

    this.email  = JSON.parse(sessionStorage.getItem("username"));

    if(this.email != null) {
      this.getEmployeeInformation(this.email);
    }
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }

  }


  showManagerMenu(): boolean{
    if(this.employeeInformation.position === 'Manager'){
      return true;
    } else{
      return false;
    }
  }
}
