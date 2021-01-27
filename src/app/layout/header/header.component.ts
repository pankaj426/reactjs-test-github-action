import { SupportComponent } from './../../front-end/support/support.component';
import { ChangePasswordComponent } from './../../front-end/org-profile/change-password/change-password.component';
import { UserProfileComponent } from './../../front-end/user-profile/user-profile.component';
import { environment } from 'src/environments/environment';
import { AuthService } from './../../shared/services/auth.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from "@angular/router";
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import {AppComponent} from '../../app.component';
import { SolutionEmitterService } from './solutionAddEvent';

import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { RightSidebarService } from '../../shared/services/rightsidebar.service';
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { RouterService } from 'src/app/shared/services/router.service';
import { FrontEndService } from '../../front-end/services/front-end.service';
import { userRoles, UsecaseSolutoinTypes } from '../../shared/constants/enum';
import { SharedVarService } from 'src/app/shared/services/shared-var.service';
import { ToastrService } from "ngx-toastr";
import { MatDialog } from '@angular/material/dialog';

//import { FrontendDashboardComponent } from 'src/app/front-end/frontend-dashboard/frontend-dashboard.component';
declare var $: any;
const document: any = window.document;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],

})
export class HeaderComponent implements OnInit {
  isGuest = false;
  static authenticated = false;
  isStartup = 0;
  uscTypes: any = UsecaseSolutoinTypes;
  saveLoader: boolean = true;
  ucsForm: FormGroup;
  uscFormFieldData = {
    title: [{ value: '', disabled: true }]
  };
  ucsId: any = "";
  userId: any = "";
  shortDesc: any = "";
  tags: any = "";
  uscStatus: any = "";
  longDesc: any = "";
  showEditUscHeader: boolean = false;
  public userRoles = userRoles;
  pageTitle = localStorage.getItem('companyname');
  fullname = localStorage.getItem('fullname');
  profileLinkTitle = '';
  userUcsType = "";
  buttonTitle = "";
  public classReference = HeaderComponent;
  

  showActionIcon:boolean = true;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private dataService: RightSidebarService,
    private sessionStorageService: SessionStorageService,
    public routerServices: RouterService,
    public localStorageService: LocalStorageService,
    public authService: AuthService,
    public frontendService: FrontEndService,
    private fb: FormBuilder,
    private router: Router,
    private VarService: SharedVarService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public solutionEmitter : SolutionEmitterService,
    //private storageSub= new Subject<string>(),
  ) {
    
    
    if(localStorage.getItem('fullname')!=undefined)
    {
      this.fullname = localStorage.getItem('fullname');
     if(this.fullname.charAt(0) == '"'){
      this.fullname = JSON.parse(localStorage.getItem('fullname'));
     }
    
  
    }
    
    // if(JSON.parse(localStorage.getItem('fullname'))!=undefined)
    // {
    //  this.fullname = localStorage.getItem('fullname');
    // /// this.storageSub.next('added');
    // }
  }
  get f() {
    return this.ucsForm.controls;
  }

  // watchStorage(): Observable<any> {
  //   return this.storageSub.asObservable();
  // }
  // removeItem(key) {
  //   localStorage.removeItem(key);
  //   this.storageSub.next('removed');
  // }
  resetFormFields() {
    this.uscFormFieldData = {
      title: [{ value: '', disabled: true }]
    };
  }

  makeEabelDisableForm(name, flag) {
    if(this.localStorageService.userDetails.roles == userRoles.corporateGuestUser){
      this.isGuest = true;
      this.sessionStorageService.flushOnLogout();
      this.routerServices.redirectToCorpApplicationAppy();
    }else if(this.localStorageService.userDetails.roles == userRoles.startupGuestUser){
      this.isGuest = true;
      this.sessionStorageService.flushOnLogout();
      this.routerServices.redirectToStartUpApplicationAppy();
    }else{
      if (flag == "enable") {
        this.ucsForm.controls[name].enable();
        $('#' + name).focus();
      } else if (flag == "disable") {
        this.ucsForm.controls[name].markAsPristine();
        this.ucsForm.controls[name].disable();
        this.resetFormFields()
        this.initUscForm(this.uscFormFieldData);
      }
    }
    
  }
  errorMessage: any = "";
  ngOnInit() {
   this.isAuthenticated();
    if (this.authService.isAuthenticated && this.localStorageService.userDetails != null) {
      this.initUscForm(this.uscFormFieldData)
      setTimeout(() => {
        this.userUcsType = this.frontendService.getUserRoleType();
        if ( this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
          this.profileLinkTitle = 'Company Profile';
          this.buttonTitle = "Post a Use Case";
          this.isStartup = 1;
        }
        if ( this.localStorageService.userDetails.roles == userRoles.corporateGuestUser) {
          this.profileLinkTitle = 'Company Profile';
          this.buttonTitle = "Post a Use Case";
          this.isGuest = true;
        }
        if (this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
          this.profileLinkTitle = 'Statup Profile';
          this.buttonTitle = "Post a Solution";
          this.isStartup = 2;
        }
        if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser) {
          this.profileLinkTitle = 'Statup Profile';
          this.buttonTitle = "Post a Solution";
          this.isGuest = true;
        }
        if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser || this.localStorageService.userDetails.roles == userRoles.corporateGuestUser) {
          this.isStartup = 3;
        }
        this.makeTitleEditable();
      }, 1);
    }
    this.setStartupStyles();
  }
  openProfilePopup(modalToOpen = 'userprofile') {
    if (modalToOpen == 'userprofile') {
      let DialogConfig = {
        data: "",
        width: '544px',
        panelClass: 'cust-share-modal'
      };
      const dialogRef = this.dialog.open(UserProfileComponent, DialogConfig);
    }
    if (modalToOpen == 'changePassword') {
      let DialogConfig = {
        data: "",
        width: '544px',
        panelClass: 'cust-share-modal'
      };
      const dialogRef = this.dialog.open(ChangePasswordComponent, DialogConfig);
    }
    if (modalToOpen == 'support') {
      let DialogConfig = {
        data: "",
        width: '544px',
        panelClass: 'cust-share-modal'
      };
      const dialogRef = this.dialog.open(SupportComponent, DialogConfig);
    }
  }
  OnDestroy() {
    this.VarService.setValue(false);
    this.makeEabelDisableForm('title', 'disable');
  }

  isAuthenticated() {
  
    HeaderComponent.authenticated = this.authService.isAuthenticated();
  }
  setPath(urlPath) {
    this.VarService.getValue().subscribe((value) => {
      this.showEditUscHeader = value;
    });
    let urlArr = urlPath.split("/");
    const matchPathEditUcs = environment.frontend.editUcs.replace(":id", "");
    const matchPathDetaisUcs = environment.frontend.ucsDetail.replace(":id", "");
    
    if (urlPath.includes(matchPathEditUcs)) {
      this.pageTitle = "Overview";
      this.userId = this.localStorageService.userDetails._id;
      this.VarService.setValue(true);
      this.uscTypes = this.frontendService.getUserRoleType();
      let id = urlArr[urlArr.length - 1];
      this.ucsId = id != null && id !== undefined ? id : "";
      if (this.ucsId) {
        /*    this.resetFormFields();
           this.initUscForm(this.uscFormFieldData)
           this.getUcsDetail(); */
      } else {
        this.ucsId = "";
      }
    } else if (urlPath.includes(matchPathDetaisUcs)) {
      this.showEditUscHeader = true
      this.VarService.setValue(true);
      let id = urlArr[urlArr.length - 1];
      this.ucsId = id != null && id !== undefined ? id : "";
      if (this.ucsId) {
        /* this.ucsDetailsPage(); */
      } else {
        this.ucsId = "";
      }
    } else {
      const satartupDashboard = environment.frontend.startup.dashboard;
      const corporateDashboard = environment.frontend.corporate.dashboard;
      const corporateProfile = environment.frontend.corporate.profile;
      const corporateUserProfile = environment.frontend.corporate.userProfile;
      const starupProfile = environment.frontend.startup.profile;
      const startupUserProfile = environment.frontend.startup.userProfile;
      const startupChangePass = environment.frontend.startup.changePass;
      const corpChangePass = environment.frontend.corporate.changePass;
      const startupSupport = environment.frontend.startup.support;
      const corpSupport = environment.frontend.corporate.support;
      const detailPath = environment.public.details;
      let mathcUrl = urlArr[3];
      if (mathcUrl == startupUserProfile || mathcUrl == corporateUserProfile) {
        this.pageTitle = localStorage.getItem('company');
      }
      if (mathcUrl == satartupDashboard || mathcUrl == corporateDashboard) {
        this.pageTitle = localStorage.getItem('company');
      }
      if (mathcUrl == startupChangePass || mathcUrl == corpChangePass) {
        this.pageTitle = localStorage.getItem('company');
      }
      if (mathcUrl == undefined) {
        this.pageTitle = localStorage.getItem('companyname');
      }
      if (mathcUrl == corporateProfile && (this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser)) {
       
        if(localStorage.getItem('companyname')!=undefined)
        {
          this.pageTitle = localStorage.getItem('companyname');
         if(this.pageTitle.charAt(0) == '"'){
          this.pageTitle = JSON.parse(localStorage.getItem('companyname'));
         }
        }
      
      }
      if (mathcUrl == starupProfile && (this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser)) {
        this.pageTitle = localStorage.getItem('companyname');
      }
      if (mathcUrl == startupSupport || mathcUrl == corpSupport) {
        this.pageTitle = localStorage.getItem('company');
      }
      this.VarService.setValue(false);
    }
  }
  makeTitleEditable() {
    if (this.authService.isAuthenticated && this.localStorageService.userDetails != null) {
      let curl = window.location.pathname;
      if (curl != "/") {
        this.setPath(curl);
      }
      this.router.events.subscribe((result: any) => {
        if (result instanceof NavigationEnd) {
          this.setPath(result.url);
        }
      })
    }

  }
  ucstitleMinLength = 5;
  titleMaxLength = 100;
  saveTitle() {
    return new Promise((resolve, reject) => {
      this.showActionIcon = false;
      let cardTitle = this.ucsForm.controls["title"].value.trim();
      if (cardTitle != "" && cardTitle != null) {
        if (cardTitle.length >= this.ucstitleMinLength) {
          this.saveLoader = true;
          let data = {
            "type": this.userUcsType,
            "title": cardTitle
          }
          this.frontendService.saveCardTitle(data).pipe().subscribe((result: any) => {
            this.saveLoader = false;
            this.showActionIcon = true;
            if (result.statusCode == 200) {
              cardTitle = "";
              this.makeEabelDisableForm('title', 'disable');
              this.toastr.success(result.message, '', {
                timeOut: 3000
              });

              this.solutionEmitter.addSolution(result.body);
              this.toastr.success(result.message, '', {
                timeOut: 3000
              });
              // if (this.pageTitle == "Dashboard") {
              //   this.toastr.success(result.message, '', {
              //     timeOut: 3000
              //   });
              //   window.location.reload();
              //   //this.frontEndFuntion.initDashboard();
              // } else {
              //   this.redirectToDashboard();
              // }


            } else {
              this.errorMessage = 'Something went wrong. Please try after sometime.';
            }
          }, (error: any) => {
            this.saveLoader = false;
            this.showActionIcon = true;
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
          this.showActionIcon = true;
          this.toastr.error('Title must be at least ' + this.ucstitleMinLength + ' characters long.', '', {
            timeOut: 3000
          });
        }
      } else {
        this.showActionIcon = true;
        this.toastr.error('Please provide title', '', {
          timeOut: 3000
        });
      }
    })

  }

  redirectToDashboard() {
    if (this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser || this.localStorageService.userDetails.roles == userRoles.startupGuestUser  ) {
      this.redirectToStartupDashboard();
    } else if (this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser || this.localStorageService.userDetails.roles == userRoles.corporateGuestUser ) {
      this.redirectToCorpDashboard();
    }
  }

  redirectToStartupDashboard() {
    this.routerServices.RedirectToStartupDashboard();
  }
  redirectToCorpDashboard() {
    this.routerServices.RedirectToCorpDashboard();
  }
  initUscForm(uscFormFieldData) {
    this.ucsForm = this.fb.group(uscFormFieldData);
  }
  getUcsDetail() {
    this.frontendService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {
            let data = result.body[0];
            this.shortDesc = data.short_description;
            this.longDesc = data.long_description;
            this.uscTypes = data.type;
            this.tags = data.tags;
            this.uscStatus = data.status;
            this.ucsId = data._id;
            this.userId = data.created_by;
            let uscFrmTitle = {
              title: [{ value: data.title, disabled: true }],
            };
            this.pageTitle = data.title;
            this.initUscForm(uscFrmTitle)
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {

          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;

          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }
  ucsDetailsPage() {
    this.frontendService
      .ucsDetailsPage(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {
            let data = result.body[0];
            this.shortDesc = data.short_description;
            this.longDesc = data.long_description;
            this.uscTypes = data.type;
            this.tags = data.tags;
            this.uscStatus = data.status;
            this.ucsId = data._id;
            this.userId = data.created_by;
            let uscFrmTitle = {
              title: [{ value: data.title, disabled: true }],
            };
            this.pageTitle = data.title;
            this.initUscForm(uscFrmTitle)
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {

          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;

          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }
  logout() {

    this.frontendService
      .saveDrafts()
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            RightSidebarComponent.authenticated = false;
            HeaderComponent.authenticated = false;
            AppComponent.authenticated = false;
            this.sessionStorageService.flushOnLogout();
            localStorage.clear();
            this.routerServices.RedirectHome();
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
        }
      );
    // RightSidebarComponent.authenticated = false;
    // HeaderComponent.authenticated = false;
    // AppComponent.authenticated = false;
    // this.sessionStorageService.flushOnLogout();
    // localStorage.clear();
    // this.routerServices.RedirectHome();
  }

  
  redirectToChangePass() {
    if (this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
      this.routerServices.redirectTocorpChangePass();
    }
    if (this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.routerServices.redirectTostartupChangePass();
    }
  }
  redirectToOrgProfile() {
    if (this.localStorageService.userDetails.roles == userRoles.corporateGuestUser ||this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {

      this.redirectToCorpProfile();
    }
    if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser ||this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.redirectToStartupProfile();
    }
  }
  redirectToUserProfile() {
    if (this.localStorageService.userDetails.roles == userRoles.corporateGuestUser || this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
      this.redirectToCorpUserProfile();
    }
    if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser || this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.redirectToStartupUserProfile();
    }
  }
  public redirectToCorpProfile() {
    this.routerServices.redirectToCorpProfile()
  }
  public redirectToCorpUserProfile() {
    this.routerServices.redirectToCorpUserProfile()
  }
  public redirectToStartupProfile() {
    this.routerServices.redirectToStartupProfile()
  }
  public redirectToStartupUserProfile() {
    this.routerServices.redirectToStartupUserProfile()
  }

  setStartupStyles() {
    // set theme on startup
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, 'dark');
      this.renderer.removeClass(this.document.body, 'light');
      this.renderer.addClass(this.document.body, localStorage.getItem('theme'));
    } else {
      this.renderer.addClass(this.document.body, 'light');
    }
    // set light sidebar menu on startup
    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption')
      );
    } else {
      this.renderer.addClass(this.document.body, 'menu_light');
    }
    // set logo color on startup
    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader')
      );
    } else {
      this.renderer.addClass(this.document.body, 'logo-white');
    }
  }
  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  public toggleRightSidebar(): void {
    this.dataService.changeMsg(
      (this.dataService.currentStatus._isScalar = !this.dataService
        .currentStatus._isScalar)
    );
  }
  public redirectToSupport() {
    if (this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {

      this.RedirectCorpSupport()
    }
    if (this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.RedirectStartupSupport();
    }
  }
  RedirectStartupSupport() {
    this.routerServices.RedirectStartupSupport()
  }
  RedirectCorpSupport() {
    this.routerServices.RedirectCorpSupport();
  }
  notifications: any[] = [
    {
      userImg: 'assets/images/user/user1.jpg',
      userName: 'Sarah Smith',
      time: '14 mins ago',
      message: 'Please check your mail',
    },
    {
      userImg: 'assets/images/user/user2.jpg',
      userName: 'Airi Satou',
      time: '22 mins ago',
      message: 'Work Completed !!!',
    },
    {
      userImg: 'assets/images/user/user3.jpg',
      userName: 'John Doe',
      time: '3 hours ago',
      message: 'kindly help me for code.',
    },
    {
      userImg: 'assets/images/user/user4.jpg',
      userName: 'Ashton Cox',
      time: '5 hours ago',
      message: 'Lets break for lunch...',
    },
    {
      userImg: 'assets/images/user/user5.jpg',
      userName: 'Sarah Smith',
      time: '14 mins ago',
      message: 'Please check your mail',
    },
    {
      userImg: 'assets/images/user/user6.jpg',
      userName: 'Airi Satou',
      time: '22 mins ago',
      message: 'Work Completed !!!',
    },
    {
      userImg: 'assets/images/user/user7.jpg',
      userName: 'John Doe',
      time: '3 hours ago',
      message: 'kindly help me for code.',
    },
  ];
}
