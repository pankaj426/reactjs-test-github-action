import { LocalStorageService } from './../../shared/services/local-storage.service';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { RouterService } from '../../shared/services/router.service';
import { OrgTypesEnum, userRoles } from '../../shared/constants/enum';

@Component({
  selector: 'app-signinn',
  templateUrl: '../../view/signin/signin.component.html',
  styleUrls: ['../../view/signin/signin.component.scss']
})
export class SigninnComponent implements OnInit {

  public errorMessage: string = '';
  public loginLoader: boolean = false;
  public orgTypes: any = OrgTypesEnum;

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,

    private authenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }
  ngOnInit() {
    if (this.authService.isAuthenticated()) {


      if (this.localStorageService.userDetails.roles == userRoles.cgAdmin) {

        this.RedirectDashboard();
      } else if (this.localStorageService.userDetails.roles == userRoles.startupAdmin) {
        if (this.localStorageService.userDetails.redirect == true) {
          this.routerService.redirectToStartupProfile();
        } else {
          this.redirectToStartupDashboard();
        }
      } else if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser || this.localStorageService.userDetails.roles == userRoles.startupUser){
        this.redirectToStartupDashboard();
      } else if (this.localStorageService.userDetails.roles == userRoles.corporateGuestUser || this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
        this.redirectToCorpDashboard();
      }

    }

    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.loginForm.controls;
  }

  convertToSlug(Text) {
    return Text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      ;
  }
  
  onSubmit() {
    this.submitted = true;
    this.loginLoader = true;
    this.authenticationService.makeFormTouched(this.loginForm);
    if (this.loginForm.invalid) {
      this.loginLoader = false;
      return;
    } else {
      this.errorMessage = '';
      this.authenticationService.login(this.loginForm.value).pipe().subscribe((result) => {
        this.loginLoader = false;
        if (result != null) {
          localStorage.setItem("company", this.convertToSlug(result.body.org_name));
          localStorage.setItem("companyname", result.body.org_name);
          localStorage.setItem("fullname", result.body.fullname);
          this.sessionStorageService.setUserAuthDetails(result.body);
          this.sessionStorageService.setUserDetails(result.body);
          if(result.body.organization[0] != undefined){
            localStorage.setItem("totalCustomers", result.body.organization[0].additional_fields.totalCustomers);
          }
          if(result.body.additional_fields){
            if(Object.keys(result.body.additional_fields).length !== 0){
            
              localStorage.setItem("discussion_drafts", JSON.stringify(result.body.additional_fields.discussion_drafts));
              localStorage.setItem("pipeline_drafts", JSON.stringify(result.body.additional_fields.pipeline_drafts));
              localStorage.setItem("evaluate_drafts", JSON.stringify(result.body.additional_fields.evaluate_drafts));
            }
          }
          window.location.reload();

        } else {
          this.errorMessage = 'Something went wrong. Please try after sometime.';
        }
      }, (error: any) => {
        this.loginLoader = false;
        if (error.error.message != null && error.error.message != '') {
          this.errorMessage = error.error.message;
        }
        else {
          this.errorMessage = 'Something went wrong. Please try after sometime.';
        }
      }
      );
    }
  }
  RedirectDashboard() {
    //  this.routerService.RedirectAdminDashboard()
    this.routerService.redirectToCorpApplication();
  }
  redirectToStartupDashboard() {
    this.routerService.RedirectToStartupDashboard();
  }
  redirectToCorpDashboard() {
    this.routerService.RedirectToCorpDashboard();
  }
  redirectToCorpApplicationAppy() {
    this.routerService.redirectToCorpApplicationAppy();
  }
  redirectToStartUpApplicationAppy() {
    this.routerService.redirectToStartUpApplicationAppy();
  }
  goToApply(redirectValue) {
    if (redirectValue == this.orgTypes.corporate) {
      this.redirectToCorpApplicationAppy();
    } else {
      this.redirectToStartUpApplicationAppy();
    }

  }

}
