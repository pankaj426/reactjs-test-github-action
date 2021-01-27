import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpService } from "../../shared/services/http.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs";
import { map, filter, scan } from 'rxjs/operators';
import { Response } from "../../shared/models/response";
import { RoleType, deviceType } from "../../shared/constants/enum";
import { CommonService } from "../../shared/services/common.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private readonly apiMastersBaseUrl =
    environment.services.gatewayUrl + environment.services.master.baseUrl;
  private readonly apiFrontEndBaseUrl =
    environment.services.gatewayUrl +
    environment.services.frontEnd.baseUrl;
  private readonly apiUsersBaseUrl =
    environment.services.gatewayUrl + environment.services.users.baseUrl;
  private readonly apiOrganisationBaseUrl =
    environment.services.gatewayUrl +
    environment.services.organizations.baseUrl;
  constructor(
    private httpService: HttpService,
    private common: CommonService,
    private httpClient: HttpClient
  ) { }
  public login(loginDetails): Observable<Response> {
    const url = environment.services.users.api.postLogin;
    return this.httpService.post<Response>(
      this.apiUsersBaseUrl,
      url,
      loginDetails
    );
  }
  public forgotPassword(data): Observable<Response> {
    const url = environment.services.users.api.postForgotPassword;
    return this.httpService.post<Response>(this.apiUsersBaseUrl, url, data);
  }
  public ucsDetailsPage(ucsId): Observable<Response> {
    const url =
      environment.services.frontEnd.api.getDetails.replace(":id", ucsId);
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }
  public changePasswordAPI(data): Observable<Response> {
    const url = environment.services.users.api.resetPassword;
    return this.httpService.post<Response>(this.apiUsersBaseUrl, url, data);
  }
  public corporateApplicationForm(data) { }
  
  makeFormTouched(formData) {
    return this.common.markFormGroupTouched(formData);
  }
  public applicationForm(data): Observable<Response> {
    const url = environment.services.organizations.api.application;
    return this.httpService.post<Response>(
      this.apiOrganisationBaseUrl,
      url,
      data
    );
  }
  public corporateRegisterGetDetail(data): Observable<Response> {
    const url = environment.services.organizations.api.application_details;
    return this.httpService.post<Response>(
      this.apiOrganisationBaseUrl,
      url,
      data
    );
  }


  public sendGuestRegisterDetail(data): Observable<Response> {
    const url = environment.services.users.api.guest_register;
    return this.httpService.post<Response>(this.apiUsersBaseUrl, url, data);
  }
  public sendRegisterDetail(data): Observable<Response> {
    const url = environment.services.users.api.register;
    return this.httpService.post<Response>(this.apiUsersBaseUrl, url, data);
  }
  

  public uploadDocs(formData): Observable<Response> {
    const url = environment.services.organizations.api.upload_doc;
    return this.httpService.post<Response>(this.apiOrganisationBaseUrl, url, formData);
  }
  /*   public getMasters(type = 'getCountries', _code = ''): Observable<Response> {
      const url =
        environment.services.master.api[type].replace(":code", _code);
      return this.httpService.get<Response>(this.apiMastersBaseUrl, url);
    } */
  public getMasters(data): Observable<Response> {
    const url = environment.services.master.api.list;
    return this.httpService.post<any>(this.apiMastersBaseUrl, url, data);
  }
}
