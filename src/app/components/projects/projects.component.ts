import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {ClientRegistrationRequestModel, ProjectInformationResponseModel, ProjectsService} from "../../services";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
    isLoading = new Subject<boolean>();

    private projects: Array<ProjectInformationResponseModel> = [];
    private userInformation : ClientRegistrationRequestModel =  <ClientRegistrationRequestModel>'' ;


    constructor(private projectsService: ProjectsService,
                private router: Router,
                private toastr: ToastrService) {
      this.userInformation  = JSON.parse(sessionStorage.getItem("userInformation"));
    }

    ngOnInit() {
      this.getProjects();
    }

    getProjects(){
        this.projectsService.apiProjectsAllProjectsGet().subscribe (
            (data: any) => {
              this.projects = data
            },
            error => {
              console.log(error);
              this.showError();
            },
            () => {
              this.showSuccess();
            }
        );
    }

    showSuccess() {
      this.toastr.success('Process successfully completed', 'Success', {
        timeOut: 3000,
      });
    }

    showError() {
      this.toastr.error('Ops, an error occurred. Please try again.', 'Error!!!', {
        timeOut: 3000,
      });
    }
}
