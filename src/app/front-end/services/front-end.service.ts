import { LocalStorageService } from './../../shared/services/local-storage.service';
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpService } from "../../shared/services/http.service";
import { Observable, BehaviorSubject } from "rxjs";
import { Response } from "../../shared/models/response";
import { userRoles, UsecaseSolutoinTypes } from "../../shared/constants/enum";
import { CommonService } from "../../shared/services/common.service";

@Injectable({
  providedIn: 'root'
})
export class FrontEndService {
  private readonly apiFrontEndBaseUrl =
    environment.services.gatewayUrl +
    environment.services.frontEnd.baseUrl;
  private readonly apiTagBaseUrl =
    environment.services.gatewayUrl +
    environment.services.tags.baseUrl;
  userDetails = this.localStorageService.userDetails;
  private readonly apiUserBaseUrl =
    environment.services.gatewayUrl +
    environment.services.users.baseUrl;
  private readonly apiOrgBaseUrl =
    environment.services.gatewayUrl +
    environment.services.organizations.baseUrl
  private readonly apiDiscussionBaseUrl =
    environment.services.gatewayUrl +
    environment.services.discussions.baseUrl;
  private readonly apiResourseBaseUrl =
    environment.services.gatewayUrl +
    environment.services.resources.baseUrl;
  private readonly apiSupportBaseUrl =
    environment.services.gatewayUrl +
    environment.services.support.baseUrl;
  private readonly apiUsersBaseUrl =
    environment.services.gatewayUrl +
    environment.services.users.baseUrl;
  private readonly apiEvalBaseUrl =
    environment.services.gatewayUrl +
    environment.services.evaluates.baseUrl;
  private readonly apiPromotesBaseUrl =
    environment.services.gatewayUrl +
    environment.services.promotes.baseUrl;
  constructor(
    private httpService: HttpService,
    private common: CommonService,
    private localStorageService: LocalStorageService
  ) { }
  /*********************************************Eval*****************************************************************/
  public getEvaluations(ucsId): Observable<Response> {
    let ucs_id = ucsId;
    const url = environment.services.evaluates.api.list + "?ucs_id=" + ucs_id + "&user_id=&limit=500&offset=0&searchText=&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiEvalBaseUrl, url);
  }
  public setevaluations(evaluation, aciveEvalId = "") {
    return new Promise((resolve, reject) => {
      let evals = evaluation;
      let selectedEvalIndex = 0;
      setTimeout(() => {
        if (evals.length == 0) {
          reject(0);
        } else {
          for (let i = 0; i < evals.length; i++) {
            evals[i].activeClass = "";
            if (aciveEvalId == "") {
              if (i == 0) {
                evals[i].activeClass = "active_chat";
                selectedEvalIndex = 0;
              }
            } else {
              if (aciveEvalId == evals[i]['_id']) {
                evals[i].activeClass = "active_chat";
                selectedEvalIndex = i;
              }
            }
          }
          let data = {
            evaluations: evals,
            selectedEvalIndex: selectedEvalIndex
          }
          resolve(data);
        }
      }, 500);
    });
  }
  public getevaluationsMessages(data) {
    const url = environment.services.evaluates.api.getMessges;
    return this.httpService.post<any>(this.apiEvalBaseUrl, url, data);
  }
  public sendEvalMessage(data) {
    const url = environment.services.evaluates.api.sendMessages;
    return this.httpService.post<any>(this.apiEvalBaseUrl, url, data);
  }
  /*********************************************Eval ends here****************************************************/

  public getshorOrgName(orgName) {
    let x = orgName;
    let nameArray = x.split(' ').slice(0, 2);
    let firstLetter = "";
    let secLetter = "";
    let dispName = "";
    if (nameArray.length > 1) {
      if (nameArray[0].length > 0) {
        firstLetter = nameArray[0][0];
      }
      if (nameArray[1].length > 0) {
        secLetter = nameArray[1][0];
      }
      dispName = firstLetter + secLetter;
    } else {
      if (nameArray[0].length > 0) {
        dispName = nameArray[0][0];
      }
    }
    return dispName;
  }
  public getUserRoleType() {
    let uscTypes = "";
    if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser ||this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      uscTypes = UsecaseSolutoinTypes.solution;
    } else if (this.localStorageService.userDetails.roles == userRoles.corporateGuestUser ||this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
      uscTypes = UsecaseSolutoinTypes.usecase;
    }
    return uscTypes;
  }

  public saveCardTitle(data) {
    data["org_id"] = this.userDetails.organization_id;
    data["user_id"] = this.userDetails._id;
    const url = environment.services.frontEnd.api.create;
    return this.httpService.post<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public addTopic(data) {
    data["user_id"] = this.userDetails._id;
    const url = environment.services.discussions.api.create
    return this.httpService.post<any>(this.apiDiscussionBaseUrl, url, data);
  }
  public getSolutions(type,uscId = "",limit="", orgId ="" , searchText = "", status = ""): Observable<Response> {
    let user_id = this.userDetails._id;
    const url = environment.services.frontEnd.api.list + "?user_id=" + user_id + "&type=" + type + "&uscId=" + uscId + "&org_id=&limit=500&offset=0&searchText=&sortBy=modified&sortOrder=desc&status=" + status;
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }
  public getDashboardSolutions(): Observable<Response> {
    let user_id = this.userDetails._id;
    const url = environment.services.frontEnd.api.dashboardList + "?user_id=" + user_id + "&limit=500&offset=0&sortBy=modified&sortOrder=desc" + status;
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }
  public getUcsDetails(ucsId): Observable<Response> {
    const url =
      environment.services.frontEnd.api.ucsDetails.replace(":id", ucsId);
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }

  public deleteSharedUsers(data): Observable<Response> {
    const url =
      environment.services.frontEnd.api.removeUsers;
    return this.httpService.put<Response>(this.apiFrontEndBaseUrl, url,data);
  }
  public promoteUcs(data): Observable<Response> {
    data["user_id"] = this.userDetails._id;
    const url =  environment.services.promotes.api.create;
    return this.httpService.post<any>(this.apiPromotesBaseUrl, url, data);
  }

  public stopPromoteUcs(data): Observable<Response> {
    const url =
      environment.services.promotes.api.stop;
    return this.httpService.delete<any>(this.apiPromotesBaseUrl, url+"/"+data.ucs_id);
  }
  public getembedcode(ucsId): Observable<Response> {
    const url =
      environment.services.promotes.api.getembed.replace(":id", ucsId);
    return this.httpService.get<Response>(this.apiPromotesBaseUrl, url);
  }
  
  public ucsDetailsPage(ucsId): Observable<Response> {
    const url =
      environment.services.frontEnd.api.getUcsDetails.replace(":id", ucsId);
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }

  public deleteCaseStudyAttachment(ucsId): Observable<Response> {
    const url =
      environment.services.frontEnd.api.deleteCaseStudyAttachment.replace(":id", ucsId);
    return this.httpService.delete<Response>(this.apiFrontEndBaseUrl, url);
  }

  public getUserProfile(): Observable<Response> {
    let user_id = this.userDetails._id;
    const url =
      environment.services.users.api.profile.replace(':user_id', user_id);
    return this.httpService.get<Response>(this.apiUserBaseUrl, url);
  }

  public deleteLogo(): Observable<Response> {
    let org_id = this.userDetails.organization_id;
    const url = environment.services.organizations.api.delete_logo.replace(":org_id",org_id);
    return this.httpService.delete<Response>(this.apiOrgBaseUrl, url);
  }

  public checkrelevantdata(id): Observable<Response> {
    const url =
      environment.services.frontEnd.api.checkrelevantdata.replace(':id', id);
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }
  public deleterelevantdata(id) {
    const url = environment.services.frontEnd.api.deleterelevantdata.replace(':id', id);
    return this.httpService.delete<any>(this.apiFrontEndBaseUrl, url);
  }
  public getOrgProfile(): Observable<Response> {
    let org_id = this.userDetails.organization_id;
    const url =
      environment.services.organizations.api.profile.replace(':org_id', org_id);
    return this.httpService.get<Response>(this.apiOrgBaseUrl, url);
  }
  public userUpdate(data) {
    data["user_id"] = this.userDetails._id;
    const url = environment.services.users.api.putUpdate
    return this.httpService.put<any>(this.apiUserBaseUrl, url, data);
  }
  public rejectPipline(data) {
    const url = environment.services.frontEnd.api.delete
    return this.httpService.put<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public blockPipline(data) {
    const url = environment.services.frontEnd.api.piplineUpdate
    return this.httpService.put<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public orgUpdate(data) {
    data["org_id"] = this.userDetails.organization_id;
    const url = environment.services.organizations.api.update_profile;
    return this.httpService.put<any>(this.apiOrgBaseUrl, url, data);
  }
  public changePassword(data) {
    data["user_id"] = this.userDetails._id;
    const url = environment.services.users.api.changePassword
    return this.httpService.put<any>(this.apiUserBaseUrl, url, data);
  }
  public ucsUpdate(data) {
    const url = environment.services.frontEnd.api.update;
    return this.httpService.put<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public createTags(data) {
    const url = environment.services.tags.api.create;
    return this.httpService.post<any>(this.apiTagBaseUrl, url, data);
  }
  public getTags(): Observable<Response> {
    const url = environment.services.tags.api.list;
    return this.httpService.get<Response>(this.apiTagBaseUrl, url);
  }

  public getPipelines(ucsId): Observable<Response> {
    let org_id = this.userDetails.organization_id;
    let ucs_id = ucsId;
    const url = environment.services.frontEnd.api.piplines + "?ucs_id=" + ucs_id + "&org_id=" + org_id + "&limit=100&offset=0&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }
  public getDiscussions(ucsId, type): Observable<Response> {
    /* let org_id = this.userDetails.organization_id; */
    let ucs_id = ucsId;
    const url = environment.services.discussions.api.list + "?ucs_id_1=" + ucs_id + "&user_id=&type=" + type + "&limit=500&offset=0&searchText=&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiDiscussionBaseUrl, url);
  }
  public getPipeLineMessages(data) {
    data["user_id"] = "";//this.userDetails._id;
    const url = environment.services.frontEnd.api.messages;
    return this.httpService.post<any>(this.apiFrontEndBaseUrl, url, data);
  }

  public getDiscussionMessages(data) {
    data["sender_id"] = this.userDetails._id;
    const url = environment.services.discussions.api.messages;
    return this.httpService.post<any>(this.apiDiscussionBaseUrl, url, data);
  }
  public sendMessage(data) {
    data["user_id"] = this.userDetails._id;
    const url = environment.services.frontEnd.api.sendMessagges;
    return this.httpService.post<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public sendDiscMessage(data) {
    data["sender_id"] = this.userDetails._id;
    data["org_id"] = this.userDetails.organization_id;
    const url = environment.services.discussions.api.sendMesssage
    return this.httpService.post<any>(this.apiDiscussionBaseUrl, url, data);
  }
  public applyToPipline(data) {
    data["org_id"] = this.userDetails.organization_id;
    data["user_id"] = this.userDetails._id;
    const url = environment.services.frontEnd.api.apply;
    return this.httpService.post<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public getUsers(dt) {
    let ucs_createdby = dt.ucs_createdby;
    let ucs_id = dt.ucs_id
    let data: any = { "org_id": this.userDetails.organization_id, "user_id": this.userDetails._id, "ucs_createdby": ucs_createdby, "ucs_id": ucs_id };
    const url = environment.services.users.api.list;
    return this.httpService.post<any>(this.apiUsersBaseUrl, url, data);
  }
  public sendInvitation(data) {
    data["user_id"] = this.userDetails._id;
    const url = environment.services.users.api.send_invitation;
    return this.httpService.post<any>(this.apiUsersBaseUrl, url, data);
  }
  public shareUcs(data) {
    data["user_id"] = this.userDetails._id;
    data["sender_name"] = this.userDetails.fullname;
    const url = environment.services.frontEnd.api.share;
    return this.httpService.put<any>(this.apiFrontEndBaseUrl, url, data);
  }
  public getResources(ucs_id) {
    let org_id = this.userDetails.organization_id;
    const url = environment.services.resources.api.list + "?ucs_id=" + ucs_id + "&org_id=" + org_id + "&status=&limit=500&offset=0&searchText=&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiResourseBaseUrl, url);
  }
  public getDetailsResources(data) {
    let org_id = data.org_id;
    let ucs_id = data.ucsId
    const url = environment.services.resources.api.list + "?ucs_id=" + ucs_id + "&org_id=" + org_id + "&status=public&limit=500&offset=0&searchText=&sortBy=created&sortOrder=desc";
    return this.httpService.get<Response>(this.apiResourseBaseUrl, url);
  }
  public removeResource(data) {
    const url = environment.services.resources.api.remove;
    return this.httpService.post<any>(this.apiResourseBaseUrl, url, data);
  }
  public supportQuery(data) {
    data["user_id"] = this.userDetails._id;
    const url = environment.services.support.api.create;
    return this.httpService.post<any>(this.apiSupportBaseUrl, url, data);
  }
  public updateResoures(data) {
    const url = environment.services.resources.api.update
    return this.httpService.put<any>(this.apiResourseBaseUrl, url, data);
  }
  public uploadResourse(formData): Observable<Response> {
    const url = environment.services.resources.api.upload;
    return this.httpService.post<Response>(this.apiResourseBaseUrl, url, formData);
  }
  public uploadDocuments(formData): Observable<Response> {
    const url = environment.services.organizations.api.upload_doc;
    return this.httpService.post<Response>(this.apiOrgBaseUrl, url, formData);
  }
  public getcompanyProfile(org_id): Observable<Response> {
    //let org_id = this.userDetails.organization_id;
    const url =
      environment.services.organizations.api.profile.replace(':org_id', org_id);
    return this.httpService.get<Response>(this.apiOrgBaseUrl, url);
  }
  public getDetailsUcs(ucsId): Observable<Response> {
    const url =
      environment.services.frontEnd.api.getDetailsUcs.replace(":id", ucsId);
    return this.httpService.get<Response>(this.apiFrontEndBaseUrl, url);
  }
  public formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  public setuscList(uscList) {
    return new Promise((resolve, reject) => {
      let uscLst = uscList;
      setTimeout(() => {
        if (uscLst.length == 0) {
          reject(0);
        } else {
          for (let i = 0; i < uscLst.length; i++) {
            if (uscLst[i]["org_name"]) {
              uscLst[i]["orgShortName"] = this.getshorOrgName(
                uscLst[i]["org_name"]
              );
            }
            /* uscLst[i]["notification"]=5;
            uscLst[i]["org_name"]="WeDigTechSolutions P. Ltd. ";
             */
            uscLst[i]["publishClass"] = "bg-cyan";
            /* if( i == 2){
              uscLst[i]['status'] = "published";
            } */
            if (uscLst[i]["status"] == "unpublished") {
              uscLst[i]["publishClass"] = "bg-gray";
            }
          }
          resolve(uscLst);
        }
      }, 500);
    });
  }
  public setPiplines(piplines, acivePiplineId = "") {
    return new Promise((resolve, reject) => {
      let pipeLines = piplines;
      let SelectedPiplineIndex = 0;
      setTimeout(() => {
        if (pipeLines.length == 0) {
          reject(0);
        } else {
          for (let i = 0; i < pipeLines.length; i++) {
            pipeLines[i].activeClass = "";
            if (acivePiplineId == "") {
              if (i == 0) {
                pipeLines[i].activeClass = "active_chat";
                SelectedPiplineIndex = 0;
              }
            } else {
              if (acivePiplineId == pipeLines[i]['_id']) {
                pipeLines[i].activeClass = "active_chat";
                SelectedPiplineIndex = i;
              }
            }
          }
          let data = {
            pipeLines: pipeLines,
            SelectedPiplineIndex: SelectedPiplineIndex
          }
          resolve(data);
        }
      }, 500);
    });
  }
  public setDiscussions(discussion, aciveDiscussId = "") {
    return new Promise((resolve, reject) => {
      let discuss = discussion;
      let selectedDiscussIndex = 0;
      setTimeout(() => {
        if (discuss.length == 0) {
          reject(0);
        } else {
          for (let i = 0; i < discuss.length; i++) {
            discuss[i].activeClass = "";
            if (aciveDiscussId == "") {
              if (i == 0) {
                discuss[i].activeClass = "active_chat";
                selectedDiscussIndex = 0;
              }
            } else {
              if (aciveDiscussId == discuss[i]['_id']) {
                discuss[i].activeClass = "active_chat";
                selectedDiscussIndex = i;
              }
            }
          }
          let data = {
            discussion: discuss,
            selectedDiscussIndex: selectedDiscussIndex
          }
          resolve(data);
        }
      }, 500);
    });
  }
  public getActivePiplineIndex(piplines, acivePiplineId = "") {
    return new Promise((resolve, reject) => {
      let pipeLines = piplines;
      setTimeout(() => {
        if (pipeLines.length == 0) {
          reject(0);
        } else {
          for (let i = 0; i < pipeLines.length; i++) {
            if (acivePiplineId == pipeLines[i]['_id']) {
              resolve(i);
            }
          }
        }
      }, 500);
    });
  }
  public setTagList(items) {
    let getItems = items;
    return new Promise((resolve, reject) => {
      let itm = [];
      if (getItems.length == 0) {
        reject(0);
      } else {
        for (let i = 0; i < getItems.length; i++) {
          let data = { key: getItems[i]["value"], value: getItems[i]["value"] };
          itm.push(data);
        }
        resolve(itm);
      }
    })

  }



  // ----------Save Drafts------------
  public saveDrafts() {
    let data: any = { 
      "pipeline_drafts": localStorage.getItem("pipeline_drafts") == null ? JSON.stringify({}) : localStorage.getItem("pipeline_drafts"),
      "evaluate_drafts":  localStorage.getItem("evaluate_drafts") == null ? JSON.stringify({}) : localStorage.getItem("evaluate_drafts"), 
      "discussion_drafts": localStorage.getItem("discussion_drafts") == null ? JSON.stringify({}) : localStorage.getItem("discussion_drafts"), 
    };
    const url = environment.services.frontEnd.api.draftMessages;
    return this.httpService.post<any>(this.apiFrontEndBaseUrl, url, data);
  }

  // ----------Delete Drafts------------
  public deleteDrafts(data) {
    const url = environment.services.frontEnd.api.draftMessages;
    return this.httpService.delete<any>(this.apiFrontEndBaseUrl, url+"?type="+data.type+"&id="+data.id);
  }
}
