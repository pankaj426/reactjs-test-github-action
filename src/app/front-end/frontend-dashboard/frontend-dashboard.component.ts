import { Router } from '@angular/router';
import { SharePopupComponent } from './share-popup/share-popup.component';
import { UserListPopupComponent } from './user-list-popup/user-list-popup.component';
import { RouterService } from 'src/app/shared/services/router.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { FrontEndService } from './../services/front-end.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { userRoles, redirectSessions } from '../../shared/constants/enum';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatService } from "../../shared/services/date-format.service";
import { MatMenuTrigger } from '@angular/material/menu';
import { UserAddRemoveEmitterService } from './user-add-remove.service';

import { SolutionEmitterService } from '../../layout/header/solutionAddEvent';
@Component({
  selector: 'app-frontend-dashboard',
  templateUrl: './frontend-dashboard.component.html',
  styleUrls: ['./frontend-dashboard.component.sass']
})
export class FrontendDashboardComponent implements OnInit {
  isStartup: boolean = false;
  userId = "";
  viewNotifiSession: any = redirectSessions.viewNotifiSession;
  viewDisucss: any = redirectSessions.viewDisucss;
  showInputBox: any = 'hideBox';
  saveLoader: boolean = false;
  userRole: any = ""
  userRoles: any = userRoles;
  errorMessage: any = "";
  cardTitle = "";
  usecaseSolutions = [];
  loader: boolean = false;
  ucsType: any = "";
  buttonTitle = "";
  findText = "";
  fullname = "";
  constructor(
    private userAddRemoveEmitterService: UserAddRemoveEmitterService,
    public frontServices: FrontEndService,
    private routingService: RouterService,
    private toastr: ToastrService,
    public localStorageService: LocalStorageService,
    public dialog: MatDialog,
    public dateFormat: DateFormatService,
    private router: Router,
    private solutionEmitter: SolutionEmitterService
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }
  getShortName(orgName) {
    return this.frontServices.getshorOrgName(orgName);
  }
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  getList() {
    this.loader = true;
    this.frontServices
      .getDashboardSolutions()
      .pipe()
      .subscribe(
        (result: any) => {
          this.loader = false;
          if (result.message == "success") {
            this.usecaseSolutions = [];
            this.usecaseSolutions = result.body;
            // if (result.body[0].role == 'corporateUser') {
            //   document.getElementById("headename").innerHTML = result.body[0].data[0].fullname;
            //   document.getElementById("fsplitname").innerHTML = result.body[0].data[0].fullname.split(' ')[0].substr(0, 1);
            //   if (result.body[0].data[0].fullname.split(' ')[1] == undefined) {
            //     document.getElementById("lsplitname").innerHTML = '';
            //   }
            //   if (result.body[0].data[0].fullname.split(' ')[1] != undefined) {
            //     document.getElementById("lsplitname").innerHTML = result.body[0].data[0].fullname.split(' ')[1].substr(0, 1);
            //   }
            // }
            // if (result.body[0].role == 'startupAdmin') {
            //   document.getElementById("headename").innerHTML = result.body[0].data[0].fullname;
            //   document.getElementById("fsplitname").innerHTML = result.body[0].data[0].fullname.split(' ')[0].substr(0, 1);
            //   if (result.body[0].data[0].fullname.split(' ')[1] == undefined) {
            //     document.getElementById("lsplitname").innerHTML = '';
            //   }
            //   if (result.body[0].data[0].fullname.split(' ')[1] != undefined) {
            //     document.getElementById("lsplitname").innerHTML = result.body[0].data[0].fullname.split(' ')[1].substr(0, 1);

            //   }
          //  }
            for (let i = 0; i < this.usecaseSolutions.length; i++) {
              if (this.usecaseSolutions[i]["org_name"]) {
                this.usecaseSolutions[i]["orgShortName"] = this.getShortName(this.usecaseSolutions[i]["org_name"]);
              }

              /* this.usecaseSolutions[i]["notification"]=5;
              this.usecaseSolutions[i]["org_name"]="WeDigTechSolutions P. Ltd.";
               */
              this.usecaseSolutions[i]["publishClass"] = 'bg-cyan';
              /* if( i == 2){
                this.usecaseSolutions[i]['status'] = "published";
              } */
              if (this.usecaseSolutions[i]['status'] == "unpublished") {
                this.usecaseSolutions[i]["publishClass"] = 'bg-gray';
              }
            }
            
          } else {
            this.usecaseSolutions = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.loader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.usecaseSolutions = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.usecaseSolutions = [];
          }
        }
      );
  }
  ngOnInit(): void {
    this.cardTitle = "";
    this.initDashboard();
    if (localStorage.getItem('viewNotifi')) {
      sessionStorage.removeItem('viewNotifi');
    }
    localStorage.removeItem('ucs_id');
    localStorage.removeItem('ucs_type');
    localStorage.removeItem('ucs_user_role');

    //this will add the solution to the dashboard, no need to reload the page.
    this.solutionEmitter.subsVar = this.solutionEmitter.solutionEmitter.subscribe((value) => {
      this.getList();
    })


    if (this.userAddRemoveEmitterService.subsVar == undefined) {
      this.userAddRemoveEmitterService.subsVar = this.userAddRemoveEmitterService.userAddEmitter.subscribe((value) => {
        this.userAddRemoveEmitterService.subsVar = undefined;
        this.usecaseSolutions[value.parentIndex].data[value.index].sharedUsers = value.value;

      })

      this.userAddRemoveEmitterService.subsVar = this.userAddRemoveEmitterService.userRemoveEmitter.subscribe((value) => {
        this.userAddRemoveEmitterService.subsVar = undefined;
        this.usecaseSolutions[value.parentIndex].data[value.index].sharedUsers.splice(value.userIndex, 1);

      })

    }

    this.userAddRemoveEmitterService.subsVar = undefined;

  }
  initDashboard() {
    this.userRole = this.localStorageService.userDetails.roles;
    this.userId = this.localStorageService.userDetails._id;
    if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser || this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.buttonTitle = "Solution"
      this.isStartup = true;
      this.findText = "use cases";
    } else if (this.localStorageService.userDetails.roles == userRoles.corporateGuestUser || this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
      this.buttonTitle = "Use Case"
      this.isStartup = false;
      this.findText = "solutions";
    }
    this.fullname = this.localStorageService.userDetails.fullname;
    this.ucsType = this.frontServices.getUserRoleType();
    this.loader = true;
    setTimeout(() => {
      this.getList()
    }, 1)
  }
  ucstitleMinLength = 5
  saveCard() {
    let cardTitle = this.cardTitle.trim()
    if (cardTitle != "" && cardTitle != null) {
      if (cardTitle.length >= this.ucstitleMinLength) {
        this.saveLoader = true;
        let data = {
          "type": this.ucsType,
          "title": cardTitle
        }
        this.frontServices.saveCardTitle(data).pipe().subscribe((result: any) => {
          this.saveLoader = false;
          if (result.statusCode == 200) {
            cardTitle = "";
            this.showHideInputBox('hideBox');
            this.getList();
          } else {
            this.errorMessage = 'Something went wrong. Please try after sometime.';
          }
        }, (error: any) => {
          this.saveLoader = false;
          if (error.error.message != null && error.error.message != '') {
            this.errorMessage = error.error.message;
            this.toastr.error(error.error.message, '', {
              timeOut: 3000
            });
          }
          else {
            this.errorMessage = 'Something went wrong. Please try after sometime.';
          }
        });
      } else {
        this.toastr.error('Title must be at least ' + this.ucstitleMinLength + ' characters long.', '', {
          timeOut: 3000
        });
      }
    } else {
      this.toastr.error('Please provide ' + this.buttonTitle + ' title', '', {
        timeOut: 3000
      });
    }
  }
  showHideInputBox(showInputBox) {
    this.showInputBox = showInputBox;
  }
  openSharePopup(id, created_by, type = "invite", isSample) {
    var isEditable = true;
    if (isSample == true) {
      if (this.userId == created_by) {
        isEditable = true;
      } else {
        isEditable = false;
      }
    } else {
      isEditable = true
    }

    if (isEditable != true) {
      return false;
    }

    let uscId = id
    let DialogConfig = {
      data: {
        ucsId: uscId,
        created_by: created_by,
        type: type
      },
      width: '450px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(SharePopupComponent, DialogConfig);

    /*   dialogRef.afterClosed().subscribe(
     (data: any) => {
      if (data.length > 0) {
         } 
  });*/
  }

  openUserListPopup(id, created_by, type = "invite", role, name, parentIndex, index, isSample) {
    var isEditable = true;
    if (isSample == true) {
      if (this.userId == created_by) {
        isEditable = true;
      } else {
        isEditable = false;
      }
    } else {
      isEditable = true
    }
    let uscId = id
    let DialogConfig = {
      data: {
        ucsId: uscId,
        created_by: created_by,
        type: type,
        role: role,
        name: name,
        index: index,
        parentIndex: parentIndex,
        isSampleEditable: isEditable
      },
      width: '450px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(UserListPopupComponent, DialogConfig);
    const sub = dialogRef.componentInstance.onParticipantRemove.subscribe(() => {
      // do something
      this.getListForUpdateCount()

    });
    /*   dialogRef.afterClosed().subscribe(
     (data: any) => {
      if (data.length > 0) {
         } 
  });*/
  }

  convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      ;
  }
  redirectoEditditUcs(id, title, viewNotifi = '', tab = "", type, role, url = "redirectoEditditUcs") {
    localStorage.setItem('ucs_id', id);
    localStorage.setItem('ucs_type', type);
    localStorage.setItem('ucs_user_role', role);
    if (viewNotifi !== '') {
      if (tab == "pipline") {
        localStorage.setItem(this.viewNotifiSession, 'true');
        localStorage.setItem(this.viewDisucss, 'false');
      } else if (tab == "discussion") {
        localStorage.setItem(this.viewDisucss, 'true');
        localStorage.setItem(this.viewNotifiSession, 'false');
      } else {
        localStorage.setItem(this.viewDisucss, 'false');
        localStorage.setItem(this.viewNotifiSession, 'false');
      }
    } else {
      localStorage.setItem(this.viewDisucss, 'false');
      localStorage.setItem(this.viewNotifiSession, 'false');
    }
    setTimeout(() => {
      url == "redirectoEditditUcs" ? this.routingService.redirectoEditditUcs(this.convertToSlug(title), id) : this.routingService.redirectoEditditUcsOnNewPage(this.convertToSlug(title), id);
    }, 1)
  }


  getListForUpdateCount() {
    this.frontServices
      .getDashboardSolutions()
      .pipe()
      .subscribe(
        (result: any) => {
          this.loader = false;
          if (result.message == "success") {
            this.usecaseSolutions = result.body;
            for (let i = 0; i < this.usecaseSolutions.length; i++) {
              if (this.usecaseSolutions[i]["org_name"]) {
                this.usecaseSolutions[i]["orgShortName"] = this.getShortName(this.usecaseSolutions[i]["org_name"]);
              }

              /* this.usecaseSolutions[i]["notification"]=5;
              this.usecaseSolutions[i]["org_name"]="WeDigTechSolutions P. Ltd.";
               */
              this.usecaseSolutions[i]["publishClass"] = 'bg-cyan';
              /* if( i == 2){
                this.usecaseSolutions[i]['status'] = "published";
              } */
              if (this.usecaseSolutions[i]['status'] == "unpublished") {
                this.usecaseSolutions[i]["publishClass"] = 'bg-gray';
              }
            }
          } else {
            this.usecaseSolutions = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.loader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.usecaseSolutions = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.usecaseSolutions = [];
          }
        }
      );
  }

}
