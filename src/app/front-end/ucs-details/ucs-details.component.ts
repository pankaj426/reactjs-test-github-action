import { SharedVarService } from './../../shared/services/shared-var.service';
import { ToastrService } from 'ngx-toastr';
import { RouterService } from 'src/app/shared/services/router.service';
import { AuthService } from './../../shared/services/auth.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { AuthenticationService } from './../../authentication/services/authentication.service';
import { FrontEndService } from './../services/front-end.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { userRoles, redirectSessions } from '../../shared/constants/enum';
import { environment } from "../../../environments/environment";
//import { SharedVarService } from 'src/app/shared/services/shared-var.service';
import * as Editor from '../../../assets/js/plugins/ckeditor5-baloon-block/ckeditor';

@Component({
  selector: 'app-ucs-details',
  templateUrl: './ucs-details.component.html',
  styleUrls: ['./ucs-details.component.scss']
})
export class UcsDetailsComponent implements OnInit, OnDestroy {
  viewUcsSession: any = redirectSessions.viewUcsSession
  mainUcsId: any = ""
  public Editor = Editor;
  ckEditorConfig: any = environment.EditorConfig;
  overViewLoader: boolean = false
  //overViewDetails: any;
  ucsDetails: any = "";
  ucsId = "";
  resourseLoader = true;
  resourceList = [];
  techlogies: any = []
  donwnloadPath = environment.services.files.downloadAttachments;
  constructor(public VarService: SharedVarService, private toaster: ToastrService, private frontEndService: FrontEndService, private routerService: RouterService, private authService: AuthService, private localStorageService: LocalStorageService, private route: ActivatedRoute, private authenticationService: AuthenticationService) { }
  ngOnDestroy() {
    if (localStorage.getItem("mainUcsId")) {
      //sessionStorage.removeItem("mainUcsId");
    }
  }
  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/resource/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  redirectoEditditUcs() {
    localStorage.setItem(this.viewUcsSession, 'true');
    this.VarService.setValue(true);
    setTimeout(() => {
      this.routerService.redirectoEditditUcs("tittlecvcxv",this.mainUcsId);
    }, 1)

  }

  


  addToPipeline() {

    let errorMessage = "";
    let data = {
      "ucs_id_1": this.mainUcsId,
      "ucs_id_2": this.ucsId,
    };
    this.frontEndService
      .applyToPipline(data)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.toaster.success("Added to pipeline successfully!", "", {
              timeOut: 2000,
            });
            //this.overViewDetails["is_pipeline"] = true;
            this.ucsDetails["is_pipeline"] = true;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.toaster.error(error.error.message, "", {
              timeOut: 3000,
            });
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }
  getResourses() {
    this.resourseLoader = true;
    this.resourceList = [];
    let errorMessage = ""
    let data = {
      ucsId: this.ucsId,
      org_id: this.ucsDetails.org_id
    }
    this.frontEndService
      .getDetailsResources(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.resourseLoader = false;
          if (result.statusCode == 200) {
            this.resourceList = result.body;
          } else {
            this.resourceList = [];
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.resourseLoader = false;

          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
          this.resourceList = [];
        }
      );
  }
  yourFn($event) {
    if ($event.index == 0) {
      // this.getUcsDetail();
    }
    if ($event.index == 1) {
      //this.getResourses();
    }
  }
  ngOnInit(): void {
    alert(this.overViewLoader);
    if (localStorage.getItem("mainUcsId")) {
      this.mainUcsId = localStorage.getItem("mainUcsId");
      // sessionStorage.removeItem("mainUcsId");
    }
    this.ucsId = "";
    this.route.params.subscribe((params) => {
      this.ucsId =
        params.id != null && params.id !== undefined ? params.id : "";
      if (this.ucsId != "" && this.mainUcsId != "") {
        this.getUcsOverviewDetail()
        this.getUcsDetail();
      } else {
        this.ucsId = "";
        this.redirectUser();
      }
    });
  }
  redirectUser() {
    if (this.authService.isAuthenticated()) {
      if (
        this.localStorageService.userDetails.roles == userRoles.startupAdmin ||
        this.localStorageService.userDetails.roles == userRoles.startupUser
      ) {
        this.redirectToStartupDashboard();
      } else if (
        this.localStorageService.userDetails.roles ==
        userRoles.corporateAdmin ||
        this.localStorageService.userDetails.roles == userRoles.corporateUser
      ) {
        this.redirectToCorpDashboard();
      }
    }
  }


  getUcsDetail() {
    this.techlogies = [];
    this.overViewLoader = true;
    this.ucsDetails = "";
    let errorMessage = "";
    this.frontEndService
      .ucsDetailsPage(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.message == "success") {
            this.ucsDetails = result.body[0];
            this.getResourses();
            /* this.ucsDetails.tags = this.ucsDetails.tags.join(", ");
            this.ucsDetails.industries = this.ucsDetails.industries.join(", ");
            this.ucsDetails.functions = this.ucsDetails.functions.join(", "); */
            let techlogies: any = [];
            for (let i = 0; i < this.ucsDetails.technologies.length; i++) {
              techlogies.push(this.ucsDetails.technologies[i]);
            }
            this.techlogies = techlogies
          } else {
            this.overViewLoader = false;
            this.ucsDetails = "";
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.overViewLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.ucsDetails = "";
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
            this.ucsDetails = "";
          }
        }
      );
  }

  getUcsOverviewDetail() {
    this.techlogies = [];
    this.overViewLoader = true;
    this.ucsDetails = "";
    let errorMessage = "";
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.message == "success") {
            this.ucsDetails = result.body[0];
            this.getResourses();
            let techlogies: any = [];
            for (let i = 0; i < this.ucsDetails.technologies.length; i++) {
              techlogies.push(this.ucsDetails.technologies[i]);
            }
            this.techlogies = techlogies
          } else {
            this.overViewLoader = false;
            this.ucsDetails = "";
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.overViewLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.ucsDetails = "";
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
            this.ucsDetails = "";
          }
        }
      );
  }


  RedirectDashboard() {
    this.routerService.redirectToCorpApplication();
  }
  redirectToStartupDashboard() {
    this.routerService.RedirectToStartupDashboard();
  }
  redirectToCorpDashboard() {
    this.routerService.RedirectToCorpDashboard();
  }
}
