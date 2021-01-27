import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpService } from "../../shared/services/http.service";
import { Observable, BehaviorSubject } from "rxjs";
import { Response } from "../../shared/models/response";
import { RoleType, deviceType } from "../../shared/constants/enum";
import { CommonService } from "../../shared/services/common.service";
//import{enums} from "../../shared/constants/enum";
const orgTypes = "corporate"; //enums.orgTypes;
@Injectable({
  providedIn: "root",
})
export class AdministratorService {
  private readonly apiOrgBaseUrl =
    environment.services.gatewayUrl +
    environment.services.organizations.baseUrl;
  private readonly apiPromoteBaseUrl =
    environment.services.gatewayUrl +
    environment.services.promotes.baseUrl;
  private readonly apiUsersBaseUrl =
    environment.services.gatewayUrl + environment.services.users.baseUrl;
  constructor(
    private httpService: HttpService,
    private common: CommonService
  ) { }
  public getCropList(type): Observable<Response> {
    const url =
      environment.services.organizations.api.list +
      "?type=" +
      type +
      "&limit=100&offset=0&searchText=&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiOrgBaseUrl, url);
  }
  public getPromotedList(type): Observable<Response> {
    const url =
      environment.services.promotes.api.list +
      "?type=" +
      type +
      "&limit=100&offset=0&searchText=&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiPromoteBaseUrl, url);
  }
  public getPromoDetails(data): Observable<Response> {
    const url = environment.services.promotes.api.get.replace(":id", data);
    return this.httpService.get<Response>(this.apiPromoteBaseUrl, url);
  }
  public getShareApiLink() {
    const url =
      environment.services.promotes.api.get;
    return url;
  }
  public approved(data) {
    const url = environment.services.organizations.api.change_status;
    return this.httpService.put<any>(this.apiOrgBaseUrl, url, data);
  }
  public sendRegisterDetail(data): Observable<Response> {
    const url = environment.services.users.api.register;
    return this.httpService.post<Response>(this.apiUsersBaseUrl, url, data);
  }
}
