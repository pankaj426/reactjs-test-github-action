import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { userRoles } from "../constants/enum";
import { RouterService } from "../services/router.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private routerServices: RouterService
  ) {}
  private roleType = userRoles;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.isAuthenticated()) {

      let curl = state.url; 
      let urserDt = this._authService.getUserDetails();
      if (
        curl == "/user/dashboard" &&
        urserDt.role_type == this.roleType.corporateUser

      ) {
        this.routerServices.redirectToCorpApplication();
      }
      
      /*else if (
        curl == "/user/dashboard" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProDashboard();
      } else if (
        curl == "/professional/professional-dashboard" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/professional/professional-dashboard" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/partner/partner-dashboard" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProDashboard();
      } else if (
        curl == "/partner/partner-dashboard" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/user/profile" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProProfile();
      } else if (
        curl == "/user/profile" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerProfile();
      } else if (
        curl == "/professional/profile" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectProfile();
      } else if (
        curl == "/professional/profile" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerProfile();
      } else if (
        curl == "/partner/profile" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectProfile();
      } else if (
        curl == "/partner/profile" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProProfile();
      } else if (
        curl == "/user/change-password" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProChangePassword();
      } else if (
        curl == "/user/change-password" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerChangePassword();
      } else if (
        curl == "/professional/change-password" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectChangePassword();
      } else if (
        curl == "/professional/change-password" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerChangePassword();
      } else if (
        curl == "/partner/change-password" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProChangePassword();
      } else if (
        curl == "/partner/change-password" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectChangePassword();
      } else if (
        curl == "/user/invoice" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProDashboard();
      } else if (
        curl == "/user/invoice" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/user/defaulter" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProDefaulter();
      } else if (
        curl == "/user/defaulter" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/professional-users/defaulters" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/professional-users/defaulters" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDefaulter();
      } else if (
        curl == "/user/upload-defaulter" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectToProUploadDefauters();
      } else if (
        curl == "/user/upload-defaulter" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/upload-defaulter" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/upload-defaulter" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectUploadDefaulter();
      } else if (
        curl == "/user/settlements" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProDashboard();
      } else if (
        curl == "/user/settlements" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/user/pending-settlement" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/user/pending-settlement" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectProDashboard();
      } else if (
        curl == "/user/cir-report" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.redirectToProCIReport();
      } else if (
        curl == "/user/cir-report" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/professional/professional-users/cir-reports" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectCQEReport();
      } else if (
        curl == "/professional/professional-users/cir-reports" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/user/cir-request" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectRequestProCQEReport();
      } else if (
        curl == "/user/cir-request" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/professional/professional-users/request-cir-reports" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectRequestCQEReport();
      } else if (
        curl == "/professional/professional-users/request-cir-reports" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectPartnerDashboard();
      } else if (
        curl == "/professional/professional-users" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/professional/professional-users" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/professional-new-users" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/professional-new-users" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/professional/add-existing-member" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/professional/add-existing-member" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToPartnerProfessionals();
      } else if (
        curl == "/professional/members-history" &&
        urserDt.role_type == this.roleType.channel_partner
      ) {
        this.routerServices.RedirectToDisconnectedProfessionals();
      } else if (
        curl == "/partner/professionals-history" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/partner/professionals-history" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.RedirectToDisconnectedMembers();
      } else if (
        curl == "/partner/partner-professionals" &&
        urserDt.role_type == this.roleType.users
      ) {
        this.routerServices.RedirectDashboard();
      } else if (
        curl == "/partner/partner-professionals" &&
        urserDt.role_type == this.roleType.professional
      ) {
        this.routerServices.members();
      } */
      return true;
    } else {
     // this._router.navigate(["/"]);
      // navigate to login page
      this.routerServices.RedirectToLogin();
      //this._router.navigate(["/"]);
      // you can save redirect url so after authing we can move them back to the page they requested
      return false;
    }
  }
}
