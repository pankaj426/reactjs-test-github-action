import { AuthenticationService } from './../../authentication/services/authentication.service';
import { AttachmentsComponent } from './attachments/attachments.component';
import { CommonService } from './../../shared/services/common.service';
import { SharedVarService } from './../../shared/services/shared-var.service';
import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterService } from "../../shared/services/router.service";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { AuthService } from "../../shared/services/auth.service";
import { userRoles, UsecaseSolutoinTypes, discussionType, redirectSessions } from "../../shared/constants/enum";
import { FrontEndService } from "./../services/front-end.service";
import { ToastrService } from "ngx-toastr";
import { DateFormatService } from "../../shared/services/date-format.service";
import { MatDialog } from '@angular/material/dialog';
import { AddChatTopicComponent } from './add-chat-topic/add-chat-topic.component';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { environment } from "../../../environments/environment";
import * as Editor from '../../../assets/js/plugins/ckeditor5-baloon-block/ckeditor';
import Swal from 'sweetalert2';
import { ThemePalette } from '@angular/material/core';
import { PromotePopupComponent } from "./promote-popup/promote-popup.component";
import { SupportComponent } from './../../front-end/support/support.component';
import { ChangePasswordComponent } from './../../front-end/org-profile/change-password/change-password.component';
import { UserProfileComponent } from './../../front-end/user-profile/user-profile.component';
import { UserListPopupComponent } from './../frontend-dashboard/user-list-popup/user-list-popup.component';
import { PromoteEmitterService } from './promote-emmitter-service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { UserAddRemoveEmitterService } from '../frontend-dashboard/user-add-remove.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppComponent } from '../../app.component';
import { RightSidebarComponent } from '../../layout/right-sidebar/right-sidebar.component';
import { PipelineComponent } from './pipeline/pipeline.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
declare var $: any;
@Component({
  selector: "app-edit-ucs",
  templateUrl: "./edit-ucs.component.html",
  styleUrls: ["./edit-ucs.component.scss"],
})
export class EditUcsComponent implements OnInit, OnDestroy {
  isGuest = false;
  authenticated = false;
  selectInd = 1;
  isStartup: boolean = false;
  isDeleted: boolean = false;
  color: ThemePalette = 'accent';
  @ViewChild('tabGroup') private tabGroup;
  @ViewChild('techSelect') techSelect: any;
  public baseUrl = environment.services.files.downloadAttachments;
  public url = "http://18.235.246.81:3000/api/upload/"
  // ---------Tagged Participants ---------
  @ViewChild('sendMsg') sendMsg: ElementRef;
  @ViewChild('discussionmessage') discussionmessage: ElementRef;
  @ViewChild('pipelineMessage') pipelineMessage: ElementRef;
  @ViewChild(PipelineComponent) private pipelineChild: PipelineComponent;
  @ViewChild(EvaluateComponent) private evalChild: EvaluateComponent;
  @ViewChild(DiscussionComponent) private discussionChild: DiscussionComponent;
  taggedUsers = [];
  participants: any = [];
  pipelineParticipants: any = [];
  showParticipants: boolean = false;
  replaceString: any = "";
  pressedKey: any = "";
  tagIndex: any = ""
  overViewDetails1: any = "";

  selectedDiscussionId: any;
  discussionDraftMessageObj: any = {};

  selectedPiplineId: any;
  pipelineDraftMessageObj: any = {};

  fullname = localStorage.getItem('fullname');
  quoteMessage: any = "";
  quoteMessageId: any = "";
  quoteMessageSender: any = "";
  quoteMessageDate: any = "";
  showReplyBox: boolean = false;

  quoteMessageDiscus: any = "";
  quoteMessageIdDiscus: any = "";
  quoteMessageSenderDiscus: any = "";
  quoteMessageDateDiscus: any = "";
  showReplyBoxDiscus: boolean = false;

  public isSampleEditable: boolean = false;

  selectedTab: number = 1;

  // -------------------------

  public Editor = Editor;
  userRoles: any = userRoles;
  ckEditorConfig: any = environment.EditorConfig;
  discTypeFilter: any = "";
  selectedDescType: any = "";
  discussionType: any = discussionType
  donwnloadPath = environment.services.files.downloadAttachments;
  selectedAttachments = []
  addToDisusbtn: MatProgressButtonOptions = <MatProgressButtonOptions>environment.addToDiscBtnConfig;
  publishBtn: MatProgressButtonOptions = <MatProgressButtonOptions>environment.publishBtnConfig;
  industries: any = [];
  industry: any = "";
  industriesLoaders: boolean = false;
  editTitle: any = "";
  isTitleEditable: boolean = false;
  availabeDiscType: any = [];
  ucsForm: FormGroup;
  ucsId: any = "";
  ucs_type: any = "";
  ucs_user_role: any = "";
  moduleTitle = "Solution";
  uscType: any = "";
  overViewDetails: any = "";
  overViewLoader: boolean = false;
  shortDesc: any = "";
  longDesc: any = "";
  ucsTitle = "";
  userId = this.localStorageService.userDetails._id;
  updateLoader: boolean = false;
  isTagSelected: boolean = false;
  isIndustryDisabled: boolean = true;
  isFunctionDisabled: boolean = true;
  isTechoDisabled: boolean = true;
  selectedTechno = [];
  functions: any = [];
  technologies: any = [];
  errorMessage = "";
  tags: any = "";
  publishedStatus = "";
  ucsType = "";
  searchText = "";
  piplineSearchText = "";
  initSelectedTag = { key: "selecttag", value: "Select Tag(s)" };
  items: any = [this.initSelectedTag];
  selectedtags: any = [];
  pipelinMsgLoader: boolean = false;
  isPublishButtonClicked: boolean = false;
  pipeLineMgs: any = [];
  selectedPipeline: any = "";
  selectedDiscussion: any = "";
  uscFormFieldData = {
    industry: [{ value: "", disabled: true }],
    function: [{ value: "", disabled: true }],
    techonolgy: [{ value: this.selectedTechno, disabled: true }],
    selectedtags: [{ value: this.selectedtags, disabled: true }],
    shortDesc: [{ value: "", disabled: true }],
    longDesc: [{ value: "", disabled: true }],
  };
  messageToSend = "";
  uscList: any = [];
  viewNotifi: boolean = false;
  viewNotifiSession = redirectSessions.viewNotifiSession;
  viewDisucss = redirectSessions.viewDisucss;
  dropdownList: any = "";
  publishBtnLoader: boolean = false
  uscDtl: any = "";
  viewUcsDetails: boolean = false;
  ucsDetailsLoader: boolean = false;
  techlogies: any = [];
  showOverView: boolean = false;
  ucsLength: number = 0;
  modalRef: BsModalRef;
  transaction: any = {};
  uscaseid: any;
  marqueeCustomers: any;
  problemyour: any;
  annualRecurringRevenue: any;
  totalCustomers: any;
  linkedin: any = [];
  currentPaying: any;
  profilelogo: any;
  makeTitleEditable() {

    $('#titleEdit').focus();
    this.isTitleEditable = !this.isTitleEditable;
    this.editTitle = this.ucsTitle;

  }

  config = {
    class: 'modal-dialog-centered modal-lg startup-profile-modal', backdrop: false, keyboard: true

  }

  openModal(template: TemplateRef<any>, Id: any) {

    this.uscaseid = Id;
    this.modalRef = this.modalService.show(template, this.config);
    this.getCompanyprofile();
  }
  closepopuo() {
    this.modalRef.hide()
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
  openUserListPopup(id, created_by, type = "invite", role, name) {
    let uscId = id
    let DialogConfig = {
      data: {
        ucsId: uscId,
        created_by: created_by,
        type: type,
        role: role,
        name: name,
        isSampleEditable: this.isSampleEditable
      },
      width: '450px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(UserListPopupComponent, DialogConfig);

    const sub = dialogRef.componentInstance.onParticipantRemove.subscribe(() => {
      // do something
      this.getUcsDetail();

    });

    /*   dialogRef.afterClosed().subscribe(
     (data: any) => {
      if (data.length > 0) {
         } 
  });*/
  }

  redirectToOrgProfile() {
    if (this.localStorageService.userDetails.roles == userRoles.corporateGuestUser || this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {

      this.redirectToCorpProfile();
    }
    if (this.localStorageService.userDetails.roles == userRoles.startupGuestUser || this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.redirectToStartupProfile();
    }
  }
  public redirectToCorpProfile() {
    this.routerService.redirectToCorpProfile()
  }

  public redirectToStartupProfile() {
    this.routerService.redirectToStartupProfile()
  }
  logout() {

    this.frontEndService
      .saveDrafts()
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            RightSidebarComponent.authenticated = false;
            HeaderComponent.authenticated = false;
            AppComponent.authenticated = false;
            this.authenticated = false;
            this.sessionStorageService.flushOnLogout();
            localStorage.clear();
            this.routerService.RedirectHome();
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

    // HeaderComponent.authenticated = false;
    // this.authenticated = false;
    // this.sessionStorageService.flushOnLogout();
    // localStorage.clear();
    // this.routerService.RedirectHome();
  }


  /*getUcsOverviewDetail(ucsIdToView) {
    this.techlogies = [];
    this.overViewLoader = true;
    this.overViewDetails = "";
    let errorMessage = "";
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.message == "success") {
            this.overViewDetails1 = result.body[0];
            this.getResourses();
            /* this.overViewDetails.tags = this.overViewDetails.tags.join(", ");
            this.overViewDetails.industries = this.overViewDetails.industries.join(", ");
            this.overViewDetails.functions = this.overViewDetails.functions.join(", "); 
            let techlogies: any = [];
            for (let i = 0; i < this.overViewDetails.technologies.length; i++) {
              techlogies.push(this.overViewDetails.technologies[i]);
            }
            this.techlogies = techlogies
          } else {
            this.overViewLoader = false;
            this.overViewDetails = "";
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.overViewLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.overViewDetails = "";
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
            this.overViewDetails = "";
          }
        }
      );
  }*/

  seeUcsDetails(ucsIdToView) {
    this.viewUcsDetails = true;
    this.techlogies = [];
    this.ucsDetailsLoader = true;
    this.uscDtl = "";
    let errorMessage = "";
    this.frontEndService
      .ucsDetailsPage(ucsIdToView)
      .pipe()
      .subscribe(
        (result: any) => {
          this.ucsDetailsLoader = false;
          if (result.message == "success") {
            this.uscDtl = result.body[0];
            this.getUcsDetailRes(this.uscDtl._id, this.uscDtl.org_id);
            /* this.uscDtl.tags = this.uscDtl.tags.join(", ");
            this.uscDtl.industries = this.uscDtl.industries.join(", ");
            this.uscDtl.functions = this.uscDtl.functions.join(", "); */
            let techlogies: any = [];
            for (let i = 0; i < this.uscDtl.technologies.length; i++) {
              techlogies.push(this.uscDtl.technologies[i]);
            }
            this.techlogies = techlogies
          } else {
            this.ucsDetailsLoader = false;
            this.uscDtl = "";
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.ucsDetailsLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.uscDtl = "";
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
            this.uscDtl = "";
          }
        }
      );
  }
  matToggleChange(event) {

  }
  initAvailabelTypes() {
    this.availabeDiscType = [{
      key: "", value: "All", activeClass: "active", class: "all"
    }, {
      key: this.discussionType.question, value: "Question", activeClass: "", class: "info"
    },
    {
      key: this.discussionType.idea, value: "Idea", activeClass: "", class: "idea"
    },
    {
      key: this.discussionType.challenge, value: "Challenge", activeClass: "", class: "challenge"
    },
    {
      key: this.discussionType.comment, value: "Comment", activeClass: "", class: "comment"
    }];
  }
  hideSeletePanel() {
    this.techSelect.close();
  }
  deselectAllTechno() {
  }
  removeAttachment(index) {
    this.selectedAttachments.splice(index, 1);
  }
  filterDiscussionType(type, index) {
    this.removeQuoteMessageDiscus();
    this.discTypeFilter = type
    for (let i = 0; i < this.availabeDiscType.length; i++) {
      this.availabeDiscType[i]["activeClass"] = "";
    }
    this.availabeDiscType[index]["activeClass"] = "active";
    this.getuscDiscussions();
  }

  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/resource/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  addDiscussion(): void {

    this.addToDisusbtn.active = true;
    let errorMessage = '';
    let receiver_ucs_id = "";
    let sender_ucs_id = "";
    if (this.toStr(this.selectedPipeline.org_id) != this.toStr(this.localStorageService.userDetails.organization_id)) {
      receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
      sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
    } else {
      receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
      sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
    }
    let addDescTypeValues = "";
    if (this.uscType == UsecaseSolutoinTypes.solution) {
      this.selectedDescType = this.discussionType.usecase;
      addDescTypeValues = 'Use Case';
    }
    if (this.uscType == UsecaseSolutoinTypes.usecase) {
      this.selectedDescType = this.discussionType.solution;
      addDescTypeValues = 'Solution';
    }
    this.availabeDiscType[this.availabeDiscType.length - 1]["key"] = this.selectedDescType;
    this.availabeDiscType[this.availabeDiscType.length - 1]["value"] = addDescTypeValues;//this.selectedDescType;
    let data = {
      "ucs_id_1": sender_ucs_id,
      "ucs_id_2": receiver_ucs_id,
      "type": this.selectedDescType,
      "title": this.selectedPipeline.ucs_title
    }
    this.frontEndService.addTopic(data).pipe().subscribe((result: any) => {
      this.addToDisusbtn.active = false;
      if (result.statusCode == 200) {
        this.selectedPipeline.is_discussion = true;
        this.toaster.success(result.message, "", {
          timeOut: 2000,
        });

      } else {
        errorMessage = 'Something went wrong. Please try after sometime.';
        this.toaster.error(errorMessage, "", {
          timeOut: 2000,
        });
      }
    }, (error: any) => {
      this.addToDisusbtn.active = false;
      if (error.error.message != null && error.error.message != '') {
        errorMessage = error.error.message;
      }
      else {
        errorMessage = 'Something went wrong. Please try after sometime.';

      }
      this.toaster.error(errorMessage, "", {
        timeOut: 2000,
      });
    }
    );
  }
  getIndustries() {
    this.industriesLoaders = true;
    this.industries = [];
    let data = { type: 'industries' };
    this.authenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.industriesLoaders = false;
          if (result.statusCode == 200) {
            this.industries = result.body;
          } else {
            this.industries = [];
          }
        },
        (error: any) => {
          this.industriesLoaders = false;
          if (error.error.message != null && error.error.message != "") {
            this.industries = [];
          } else {
            this.industries = [];
          }
        }
      );

  }
  functionLoader: boolean = false;
  getFunctions() {
    this.functionLoader = true;
    this.functions = [];
    let data = { type: 'function' };
    this.authenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.functionLoader = false;
          if (result.statusCode == 200) {
            this.functions = result.body;
          } else {
            this.functions = [];
          }
        },
        (error: any) => {
          this.functionLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.functions = [];
          } else {
            this.functions = [];
          }
        }
      );

  }
  technoLoader: boolean = false;
  getTechonologies() {

    this.technoLoader = true;
    this.technologies = [];
    let data = { type: 'technologies' };
    this.authenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.technoLoader = false;
          if (result.statusCode == 200) {
            this.technologies = result.body;
          } else {
            this.technologies = [];
          }
        },
        (error: any) => {
          this.technoLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.technologies = [];
          } else {
            this.technologies = [];
          }
        }
      );

  }
  scrollToBottom(): void {
    $(".msg_history").animate({ scrollTop: $(".msg_pos").height() }, 1000);
  }
  viewRedirectContent(viewNotifi) {
    if (this.isRedirectSession(viewNotifi)) {
      this.removeRedirectSession(viewNotifi);
      this.initUcsLoader = false;
    }
  }
  removeRedirectSession(viewNotifi) {
    if (this.isRedirectSession(viewNotifi)) {
      sessionStorage.removeItem(viewNotifi);
    }
  }
  isRedirectSession(viewNotifi) {
    if (localStorage.getItem(viewNotifi)) {
      return true;
    } else {
      return false;
    }
  }
  // uploadResLoader: boolean = false;
  // fileUpoadTest: File = null;
  // uploadResources(fileUpoadTest: File) {
  //   this.uploadResLoader = true;
  //   let errorMessage = "";
  //   let doc_name = fileUpoadTest.name;
  //   const formData: FormData = new FormData();
  //   let org_id = this.localStorageService.userDetails.organization_id;
  //   let size = this.frontEndService.formatBytes(fileUpoadTest.size);
  //   formData.append("ucs_id", this.ucsId);
  //   formData.append("org_id", org_id);
  //   formData.append("user_id", this.userId);
  //   formData.append("file", fileUpoadTest, doc_name);
  //   this.frontEndService.uploadResourse(formData).subscribe(
  //     (data: any) => {
  //       this.uploadResLoader = false;
  //       this.fileUpoadTest = null;
  //       if (data.statusCode == 200) {
  //         this.toaster.success("Resource uploaded successfully!", "", {
  //           timeOut: 2000,
  //         });
  //         window["document"]["querySelector"]('[type=file]')["value"] = '';
  //         this.resourceList.unshift(data.body);
  //         //this.getResourses();
  //       } else {
  //         this.errorMessage =
  //           "Something went wrong. Please try after sometime.";
  //         this.toaster.error(errorMessage, "", {
  //           timeOut: 2000,
  //         });
  //       }
  //     },
  //     (error) => {
  //       this.fileUpoadTest = null;
  //       this.uploadResLoader = false;
  //       if (error.error.message != null && error.error.message != "") {
  //         errorMessage = error.error.message;
  //       } else {
  //         errorMessage =
  //           "Something went wrong. Please try after sometime.";
  //       }
  //       this.toaster.error(errorMessage, "", {
  //         timeOut: 3000,
  //       });
  //     }
  //   );
  // }

  // handleFileInput(files: FileList) {
  //   this.fileUpoadTest = null;
  //   this.fileUpoadTest = files.item(0);
  //   if (this.fileUpoadTest) {
  //     let file = this.fileUpoadTest;
  //     if (this.commonService.chkValidFileExt(file)) {
  //       if (file.size > 20971520) {
  //         this.toaster.error("Your upload file size is too big!", "", {
  //           timeOut: 3000,
  //         });
  //       } else {
  //         if (this.commonService.chkValidFileExt(file)) {
  //           this.uploadResources(file);
  //         } else {
  //           this.toaster.error("Only image,pdf and video files are acceptable!", "", {
  //             timeOut: 3000,
  //           });
  //         }

  //       }
  //     } else {
  //       this.toaster.error("Please upload file Only image,pdf and video .!", "", {
  //         timeOut: 3000,
  //       });
  //     }
  //   }
  // }
  ngOnDestroy() {
    this.varService.setValue(true);
    this.viewRedirectContent(this.viewNotifiSession);
    this.viewRedirectContent(this.viewDisucss);
    $('body').removeClass('bg-change');

  }
  ucsLoader: boolean = false;
  //uscList:any= [];
  ucsFetchType: any = "";
  tabTitle: any = "";
  getuscprofile: any = [];
  tagSelectIsEnable: boolean = false;
  //technoSelectIsEnable: boolean = false;
  showSearchBox: boolean = false;
  showDescSearchBox: boolean = false;
  showPublishBtn: boolean = false;
  compareItems(i1, i2) {
    return i1 && i2 && i1.key === i2.key;
  }
  shortDescIsEnabled: boolean = false;
  longDescIsEnabled: boolean = false;

  makeEabelDisableForm(name, flag) {


    if (this.ucs_user_role == userRoles.corporateGuestUser || this.ucs_user_role == userRoles.startupGuestUser) {
      this.ucsForm.controls[name].disable();
      this.ucsForm.controls[name].markAsPristine();
      this.toaster.error("As a guest user you cannot make changes.", "", {
        timeOut: 2000,
      });
    } else if ((name == 'industry' || name == 'function' || name == 'techonolgy' || name == 'selectedtags')
      && this.uscList.length > 0) {
      this.ucsForm.controls[name].disable();
      this.ucsForm.controls[name].markAsPristine();
      this.toaster.error("You can't modify Industries, Functions, Technologies and Tags after getting a match.", "", {
        timeOut: 2000,
      });
    } else {
      if (flag == "enable") {
        if (!this.isSampleEditable) {
          return false;
        }
        if (name == 'industry') {
          this.isIndustryDisabled = false;
        }
        if (name == 'function') {
          this.isFunctionDisabled = false;
        }
        if (name == 'techonolgy') {
          this.isTechoDisabled = false;
        }
        if (name == 'selectedtags') {
          this.tagSelectIsEnable = true;
        }
        if (name == 'shortDesc') {
          this.shortDescIsEnabled = true;
        }
        if (name == 'longDesc') {
          this.longDescIsEnabled = true;
        }
        this.ucsForm.controls[name].enable();
        $('#' + name).focus();
      } else if (flag == "disable") {
        if (name == 'industry') {
          this.isIndustryDisabled = true;
        }
        if (name == 'function') {
          this.isFunctionDisabled = true;
        }
        if (name == 'techonolgy') {
          this.isTechoDisabled = true;
        }
        if (name == 'selectedtags') {
          this.tagSelectIsEnable = false;
        }
        if (name == 'shortDesc') {
          this.shortDescIsEnabled = false;
        }
        if (name == 'longDesc') {
          this.longDescIsEnabled = false;
        }
        this.ucsForm.controls[name].disable();
        this.ucsForm.controls[name].markAsPristine();
      }
    }

  }
  checkAtleastOnEditable() {
    let noOfPristine = 0
    let returnVal = false;
    let formKyes = Object.keys(this.ucsForm.controls);
    let i = 0;
    Object.values(this.ucsForm.controls).forEach(control => {
      if (!control["pristine"]) {
        this.saveUcsNew(formKyes[i]);
        noOfPristine++
      }
      i++;
    });
    if (noOfPristine > 0) {
      returnVal = true;
    }
    return returnVal;
  }
  ucstitleMinLength = 5;
  titleMaxLength = 100;

  saveUcsNew(name) {

    this.tagsError = false;
    this.technoError = false;
    this.shortDescError = false;
    this.functionError = false;
    this.industryError = false;
    let isInvalid: boolean = false;
    this.isPublishButtonClicked = false;
    if (name == "shortDesc") {
      let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
      if (shortDesc == "" || shortDesc == null) {
        this.toaster.error("Short description cannot be blank!", "", {
          timeOut: 2000,
        });
        isInvalid = true;
        this.shortDescError = true;
      } else {
        if (shortDesc.length > 500) {
          this.toaster.error("Short description must not contains more then 500 characters!", "", {
            timeOut: 2000,
          });
          isInvalid = true;
          this.shortDescError = true;
        }
      }
    } else if (name == "longDesc") {
    } else if (name == "industry") {
      let industry = this.ucsForm.controls["industry"].value;
      if (industry == null || industry == undefined || industry == "") {
        this.toaster.error("Please select industry!", "", {
          timeOut: 2000,
        });
        this.industryError = true;
        isInvalid = true;
      }
    } else if (name == "function") {
      let funct = this.ucsForm.controls["function"].value;
      if (funct == null || funct == undefined || funct == "") {
        this.toaster.error("Please select function!", "", {
          timeOut: 2000,
        });
        isInvalid = true;
        this.functionError = true;
      }
    } else if (name == "selectedtags") {
      let selectedtags = this.ucsForm.controls["selectedtags"].value;
      if (selectedtags.length == 1) {
        if (selectedtags.value) {
          let seltags = selectedtags.value[0];
          if (seltags.key == "") {
            selectedtags = [];
          }
        }

      }
      if (selectedtags == null || selectedtags == undefined || selectedtags == "" || selectedtags.length == 0) {
        this.toaster.error("Please select at least one tag.", "", {
          timeOut: 2000,
        });
        this.tagsError = true;
        isInvalid = true;
      } else if (selectedtags.length > 3 && this.isStartup == true) {
        if (this.localStorageService.userDetails.roles == userRoles.startupAdmin
          || this.localStorageService.userDetails.roles == userRoles.startupUser) {
          this.toaster.error("Maximum 3 tags are allowed.", "Tags not saved!", {
            timeOut: 2000,
          });
          isInvalid = true;
        }
      }
    } else if (name == "techonolgy") {
      let techonolgy = this.ucsForm.controls["techonolgy"].value;
      if (techonolgy.length == 1) {
        if (techonolgy.value) {
          let seltechs = techonolgy.value[0];
          if (seltechs.key == "") {
            techonolgy = [];
          }
        }

      }
      if (techonolgy == null || techonolgy == undefined || techonolgy == "" || techonolgy.length == 0) {
        this.toaster.error("Please select at least one technology.", "", {
          timeOut: 2000,
        });
        this.technoError = true;
        isInvalid = true;
      }
    } else if (name == "title") {
      let editTitle: any = this.editTitle;
      if (editTitle == "" && editTitle == null) {
        this.toaster.error("Please provide title!", "", {
          timeOut: 2000,
        });
        isInvalid = true;
      } else {
        if (!(editTitle.length >= this.ucstitleMinLength)) {
          this.toaster.error('Title must be at least ' + this.ucstitleMinLength + ' characters long.', '', {
            timeOut: 3000
          });
          isInvalid = true;
        } else if ((editTitle.length >= this.titleMaxLength)) {
          this.toaster.error('Title must not be greater ' + this.titleMaxLength + ' characters.', '', {
            timeOut: 3000
          });
          isInvalid = true;
        }
      }
    }
    if (!isInvalid) {
      this.updateucs().then((res) => {
        if (res == 200) {
          if (!(name == "title")) {
            this.makeEabelDisableForm(name, "disable");
          } else {
            this.ucsTitle = this.editTitle;
            this.toaster.success("Title updated successfully!", "", {
              timeOut: 2000,
            });
            this.isTitleEditable = false
          }

        }
      }, (error) => {
        if (name == "title") {
          this.editTitle = this.ucsTitle;
        }

        this.toaster.error(this.errorMessage, "", {
          timeOut: 2000,
        });
        this.isTitleEditable = false
      });
    }

  }


  toStr(id) {
    return id.toString().trim();
  }
  addToPipeline(index = 0, ucs_id_2 = "") {
    let data = {
      "ucs_id_1": this.ucsId,
      "ucs_id_2": ucs_id_2,
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
            this.uscList[index]["is_pipeline"] = true;
            //redirect to pipline
            /* let pipelineId = result.body._id;
            this.getuscPipelines(pipelineId);
            this.tabGroup.selectedIndex = 2 */
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {

          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.toaster.error(error.error.message, "", {
              timeOut: 3000,
            });
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }
  disableTagSelect(flag, fieldName = 'tags') {

    if (flag == "enable") {
      if (fieldName == 'tags') {
        this.tagSelectIsEnable = true;
      }
      if (fieldName == 'technology') {
        //this.technoSelectIsEnable = true;
      }
      // $('.ng-input').find(':input').focus();

    } else {
      if (fieldName == 'tags') {
        this.tagSelectIsEnable = false;
      }
      if (fieldName == 'technology') {
        // this.technoSelectIsEnable = false;
      }


    }
  }
  pipleinesLoader: boolean = false;
  piplines: any = [];
  discussionLoader: boolean = false;
  discussionmessageToSend: any = "";
  discussions: any = [];
  constructor(
    private userAddRemoveEmitterService: UserAddRemoveEmitterService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService,
    private routerService: RouterService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private frontEndService: FrontEndService,
    private toaster: ToastrService,
    public dateFormatService: DateFormatService,
    private varService: SharedVarService,
    public dialog: MatDialog,
    public commonService: CommonService,
    public authenticationService: AuthenticationService,
    public promoteEmitter: PromoteEmitterService
  ) { 
    if(localStorage.getItem('fullname')!=undefined)
    {
      this.fullname = localStorage.getItem('fullname');
     if(this.fullname.charAt(0) == '"'){
      this.fullname = JSON.parse(localStorage.getItem('fullname'));
     }
    
    
    }
  }
  openAddChatFrm() {
    let DialogConfig = {
      data: {
        ucsId: this.ucsId
      },
      width: '550px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(AddChatTopicComponent, DialogConfig);
    let that = this;
    dialogRef.afterClosed().subscribe(
      (data: any) => { if (data == 1) { that.getuscDiscussions(); } });
  }

  // openAttechmentPopup() {
  //   if(!this.isSampleEditable){
  //     return false;
  //   }
  //   let DialogConfig = {
  //     data: {
  //       ucsId: this.ucsId,
  //       selectedAttachments: this.selectedAttachments
  //     },
  //     width: '550px',
  //     panelClass: 'cust-share-modal'
  //   };
  //   const dialogRef = this.dialog.open(AttachmentsComponent, DialogConfig);
  //   let that = this;
  //   dialogRef.afterClosed().subscribe(
  //     (data: any) => {
  //       if (data.length > 0) {
  //         this.removeQuoteMessage();
  //         that.selectedAttachments = data;

  //       }
  //     });
  // }


  backToUscList() {
    //this.openTab(0);
    this.viewUscList();
  }

  isAuthenticated() {

    this.authenticated = this.authService.isAuthenticated();
  }


  viewUscList() {

    this.viewUcsDetails = false;
    this.techlogies = [];
    this.ucsDetailsLoader = false;
    this.uscDtl = "";
    this.showSearchBox = true;
    this.showDescSearchBox = false;
    this.showPublishBtn = false;
    this.getuscList();
    this.varService.setValue(true);
  }
  viewOverview() {
    if (this.industries.length == 0) {
      this.getIndustries();
    }
    if (this.functions.length == 0) {
      this.getFunctions();
    }
    if (this.technologies.length == 0) {
      this.getTechonologies();
    }
    this.showSearchBox = false;
    this.showDescSearchBox = false;
    this.showPublishBtn = true;
    this.getUcsDetail();
    this.varService.setValue(true);
  }
  viewDiscussion() {
    this.showSearchBox = false;
    this.showPublishBtn = false;
    this.showDescSearchBox = false;
    this.getuscDiscussions()
    this.varService.setValue(true);
  }
  viewResources() {
    this.showSearchBox = false;
    this.showPublishBtn = false;
    this.showDescSearchBox = false;
    this.getResourses();
    this.varService.setValue(true);
  }
  // viewPipline() {
  //   this.showSearchBox = false;
  //   this.showPublishBtn = false;
  //   this.showDescSearchBox = false;
  //   this.getuscPipelines()
  //   this.varService.setValue(true);
  // }


  yourFn($event) {
    // this.isPublishButtonClicked = false;
    this.showSearchBox = false;
    this.showPublishBtn = false;
    this.showDescSearchBox = false;
    this.selectedTab = $event.index;
    if ($event.index == 0) {
      if (this.publishedStatus == "published") {
        this.viewUscList();
      }
    }
    
    if ($event.index == 3) {
      if (this.publishedStatus == "published") {
        this.viewDiscussion();
      }
    }
    if ($event.index == 4) {
      if (this.publishedStatus == "published") {
        this.viewResources();
      }
    }
    if ($event.index == 5) {
      this.showOverView = true;
      this.viewOverview();
    }
  }
  makeActivePipLienClass(_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (_id) {
        for (let i = 0; i < that.piplines.length; i++) {
          that.piplines[i]["activeClass"] = ""
          if (that.piplines[i]._id == _id) {
            this.selectedPipeline = that.piplines[i];
            that.piplines[i]["activeClass"] = "active_chat"
          }
        }
        resolve(that.piplines);
      } else {
        reject(0);
      }
    })
  }

  checkNotification(vlaue) {
    return parseInt(vlaue);
  }
  openPromotePopUp(isUcsPromoted: boolean = false) {

    let DialogConfig = {
      data: {
        "ucsId": this.ucsId,
        "checkbox": false,
        "isUcsPromoted": isUcsPromoted,
        "isDeleted": !isUcsPromoted,
        "title": this.ucsTitle
      },
      width: '544px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(PromotePopupComponent, DialogConfig);

  }

  sendMessageLoader: boolean = false;

  // sendMessage() {
  //   if (this.messageToSend != "" && this.messageToSend != null && this.selectedPipeline != "") {

  //     var receiver_ids :any = [];
  //     var tagParticipantsArray = this.messageToSend.match(/@\S+/g);
  //     if(this.messageToSend.match(/@\S+/g)){
  //       if(this.messageToSend.includes("@all")){
  //         this.pipelineParticipants.forEach(function (value) {
  //           receiver_ids.push(value._id);
  //         });
  //       }else{

  //         tagParticipantsArray.forEach(value => {
  //           var searchTag = value.replace('@','');
  //           this.pipelineParticipants.filter(e => {
  //             var username = e.fullname;
  //             if (username.indexOf(searchTag) !=-1){
  //               if(receiver_ids.indexOf(e._id) == -1){
  //                 receiver_ids.push(e._id);
  //               } 
  //             }
  //           });
  //         })
  //       }
  //     }else{
  //       receiver_ids = [];
  //     }
  //     receiver_ids = JSON.stringify(receiver_ids);


  //     let messageToSend = this.messageToSend;
  //     this.sendMessageLoader = true;
  //     this.sendMessageLoader = true;
  //     let receiver_ucs_id = "";
  //     let sender_ucs_id = "";//this.ucsId;
  //     if (this.toStr(this.selectedPipeline.org_id) != this.toStr(this.localStorageService.userDetails.organization_id)) {
  //       receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
  //       sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
  //     } else {
  //       receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
  //       sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
  //     }
  //     let data = {
  //       "pipeline_id": this.selectedPipeline._id,
  //       "receiver_ucs_id": receiver_ucs_id,
  //       "sender_ucs_id": sender_ucs_id,
  //       "message": messageToSend,
  //       "receiver_users_id": receiver_ids,
  //       "status": "unread",
  //       "attachments": this.selectedAttachments,
  //       "reply_id" : this.quoteMessageId
  //     }
  //     this.messageToSend = "";
  //     this.frontEndService
  //       .sendMessage(data)
  //       .pipe()
  //       .subscribe(
  //         (result: any) => {
  //           this.sendMessageLoader = false;
  //           if (result.statusCode == 200) {
  //             /*   this.toaster.success("Message sent successfully", "", {
  //                 timeOut: 2000,
  //               }) */
  //             this.removeQuoteMessage();
  //             this.removeQuoteMessageApi('pipeline_drafts', this.selectedPiplineId);
  //             if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
  //               var DeletedId = this.selectedPiplineId;
  //               delete this.pipelineDraftMessageObj[DeletedId];
  //               localStorage.setItem("pipeline_drafts", JSON.stringify(this.pipelineDraftMessageObj));
  //             }
  //             this.pipeLineMgs.push(result.body);
  //             this.selectedAttachments = [];
  //             this.scrollToBottom();
  //           } else {
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //             this.toaster.error(this.errorMessage, "", {
  //               timeOut: 2000,
  //             });
  //           }

  //         },
  //         (error: any) => {
  //           this.sendMessageLoader = false;
  //           if (error.error.message != null && error.error.message != "") {
  //             this.errorMessage = error.error.message;
  //             this.toaster.error(this.errorMessage, "", {
  //               timeOut: 2000,
  //             });
  //           } else {
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //             this.toaster.error(this.errorMessage, "", {
  //               timeOut: 2000,
  //             });
  //           }
  //         }
  //       );
  //   } else {
  //     if (this.selectedAttachments.length > 0) {
  //       this.messageToSend = "Hi, I've shared some resources. Please have a look."
  //       this.sendMessageLoader = true;
  //       this.sendMessageLoader = true;
  //       let receiver_ucs_id = "";
  //       let sender_ucs_id = "";//this.ucsId;
  //       if (this.toStr(this.selectedPipeline.org_id) != this.toStr(this.localStorageService.userDetails.organization_id)) {
  //         receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
  //         sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
  //       } else {
  //         receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
  //         sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
  //       }
  //       let data = {
  //         "pipeline_id": this.selectedPipeline._id,
  //         "receiver_ucs_id": receiver_ucs_id,
  //         "sender_ucs_id": sender_ucs_id,
  //         "message": this.messageToSend,
  //         "status": "unread",
  //         "attachments": this.selectedAttachments

  //       }
  //       this.frontEndService
  //         .sendMessage(data)
  //         .pipe()
  //         .subscribe(
  //           (result: any) => {
  //             this.sendMessageLoader = false;
  //             if (result.statusCode == 200) {
  //               /*   this.toaster.success("Message sent successfully", "", {
  //                   timeOut: 2000,
  //                 }) */
  //               this.pipeLineMgs.push(result.body);
  //               this.messageToSend = "";
  //               this.selectedAttachments = [];
  //               this.scrollToBottom();
  //             } else {
  //               this.errorMessage =
  //                 "Something went wrong. Please try after sometime.";
  //               this.toaster.error(this.errorMessage, "", {
  //                 timeOut: 2000,
  //               });
  //             }

  //           },
  //           (error: any) => {
  //             this.sendMessageLoader = false;
  //             if (error.error.message != null && error.error.message != "") {
  //               this.errorMessage = error.error.message;
  //               this.toaster.error(this.errorMessage, "", {
  //                 timeOut: 2000,
  //               });
  //             } else {
  //               this.errorMessage =
  //                 "Something went wrong. Please try after sometime.";
  //               this.toaster.error(this.errorMessage, "", {
  //                 timeOut: 2000,
  //               });
  //             }
  //           }
  //         );
  //     }
  //   }
  // }


  sendDiscMsgLoader: boolean = true;

  sendDiscMessage() {
    if (this.discussionmessageToSend != "" && this.discussionmessageToSend != null && this.selectedDiscussion != "") {

      var receiver_ids: any = [];
      var tagParticipantsArray = this.discussionmessageToSend.match(/@\S+/g);
      if (this.discussionmessageToSend.match(/@\S+/g)) {
        if (this.discussionmessageToSend.includes("@all")) {
          this.overViewDetails.sharedUsers.forEach(function (value) {
            receiver_ids.push(value._id);
          });
        } else {

          tagParticipantsArray.forEach(value => {
            var searchTag = value.replace('@', '');
            this.overViewDetails.sharedUsers.filter(e => {
              var username = e.fullname;
              if (username.indexOf(searchTag) != -1) {
                if (receiver_ids.indexOf(e._id) == -1) {
                  receiver_ids.push(e._id);
                }
              }
            });
          })
        }
      } else {
        receiver_ids = [];
      }
      receiver_ids = JSON.stringify(receiver_ids);


      let discussionmessageToSend = this.discussionmessageToSend
      this.sendDiscMsgLoader = true;
      let data = {
        "discussion_id": this.selectedDiscussion._id,
        "ucs_id": this.ucsId,
        "message": discussionmessageToSend,
        "receiver_users_id": receiver_ids,
        "attachment": [{
          res_id: "", file_name: "", link: ""
        }],
        "reply_id": this.quoteMessageIdDiscus
      }
      this.discussionmessageToSend = "";
      this.frontEndService
        .sendDiscMessage(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.sendDiscMsgLoader = false;
            if (result.statusCode == 200) {
              /*   this.toaster.success("Message sent successfully", "", {
                  timeOut: 2000,
                }) */
              this.removeQuoteMessageDiscus();
              this.removeQuoteMessageApi('discussion_drafts', this.selectedDiscussionId);
              if (this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)) {
                var DeletedId = this.selectedDiscussionId;
                delete this.discussionDraftMessageObj[DeletedId];
                localStorage.setItem("discussion_drafts", JSON.stringify(this.discussionDraftMessageObj));
              }

              this.discussionMgs.push(result.body);
              this.scrollToBottom();
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
              this.toaster.error(this.errorMessage, "", {
                timeOut: 2000,
              });
            }

          },
          (error: any) => {
            this.sendDiscMsgLoader = false;
            if (error.error.message != null && error.error.message != "") {
              this.errorMessage = error.error.message;
              this.toaster.error(this.errorMessage, "", {
                timeOut: 2000,
              });
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
              this.toaster.error(this.errorMessage, "", {
                timeOut: 2000,
              });
            }
          }
        );
    }
  }
  showDetailsResource: boolean = false;
  openUscDetails(tabToShow) {
    if(tabToShow == 'detail') {
      this.showDetailsResource = false;
    } else {
      this.showDetailsResource = true;
    }
  }
  pipeLineMsgMobChatBoxOpen: boolean = false;
  togglePipeMsgsMobChatBox() {
    this.pipeLineMsgMobChatBoxOpen = !this.pipeLineMsgMobChatBoxOpen;
  }


  // openPipLineMsgBox(index = 0, pipeLineId, pipelineParticipants, notification_id) {
  //   if(document.getElementById(notification_id)){
  //     let targetElement = document.getElementById(notification_id);
  //     targetElement.style.display = 'none';
  //   }

  //   this.pipelineParticipants = pipelineParticipants
  //   this.selectedPiplineId = pipeLineId;
  //   this.removeQuoteMessage();
  //   if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
  //     this.messageToSend = this.pipelineDraftMessageObj[this.selectedPiplineId]
  //   }else{
  //     this.messageToSend = "";
  //   }
  //   this.pipeLineMsgMobChatBoxOpen = true;
  //   this.getPipeLineMessages(index = 0, pipeLineId);
  // }



  getPipeLineMessages(index = 0, pipeLineId) {
    this.makeActivePipLienClass(pipeLineId).then(res => {
      this.pipelinMsgLoader = true;
      this.pipeLineMgs = [];
      let data = {
        "pipeline_id": pipeLineId,
        "receiver_ucs_id": "",
        "sender_ucs_id": ""
      }
      this.frontEndService
        .getPipeLineMessages(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.pipelinMsgLoader = false;
            if (result.message == "success") {
              this.pipeLineMgs = result.body;
              setTimeout(() => {
                this.scrollToBottom();
              }, 1);
            } else {
              this.pipeLineMgs = [];
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            this.pipelinMsgLoader = false;
            this.pipeLineMgs = [];
            if (error.error.message != null && error.error.message != "") {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          }
        );
    }, error => { });

  }
  resourseLoader: boolean = true;
  resourceList: any = [];
  dtlResLoader: boolean = false;
  dtlReslist: any = [];
  getUcsDetailRes(ucsId, org_id) {

    this.dtlResLoader = true;
    //this.dtlReslist = [];
    let errorMessage = ""
    let data = {
      ucsId: ucsId,
      org_id: org_id
    }
    this.frontEndService
      .getDetailsResources(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.dtlResLoader = false;
          if (result.statusCode == 200) {
            this.dtlReslist = result.body;
          } else {
            this.dtlReslist = [];
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.dtlResLoader = false;

          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
          this.dtlReslist = [];
        }
      );
  }
  // showPubPraivateRes(flag) {
  //   return flag == 'public' ? true : false;
  // }
  DtlToPipelineLoader: boolean = false;
  addDtlToPipeline(ucsId) {
    this.DtlToPipelineLoader = true;
    let errorMessage = "";
    let data = {
      "ucs_id_1": this.ucsId,
      "ucs_id_2": ucsId,
    };
    this.frontEndService
      .applyToPipline(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.DtlToPipelineLoader = false;
          if (result.statusCode == 200) {
            this.toaster.success("Added to pipeline successfully!", "", {
              timeOut: 2000,
            });
            this.overViewDetails["is_pipeline"] = true;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.DtlToPipelineLoader = false;
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
    this.frontEndService
      .getResources(this.ucsId)
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
          this.resourceList = [];
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }

        }
      );
  }
  // updateRes(val, ucsid, resIndex) {
  //   setTimeout(() => {
  //     const { checked } = val;
  //     let flag = checked === true ? 'public' : 'private';
  //     this.resourceList[resIndex].status = flag;
  //     let id = ucsid
  //     let data = {
  //       "resource_id": id,
  //       "status": flag
  //     };
  //     this.frontEndService
  //       .updateResoures(data)
  //       .pipe()
  //       .subscribe(
  //         (result: any) => {
  //           if (result.statusCode == 200) {
          
  //             this.toaster.success(result.message, "", {
  //               timeOut: 2000,
  //             });
  //           } else {
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //           }
  //         },
  //         (error: any) => {
  //           if (error.error.message != null && error.error.message != "") {
  //             this.errorMessage = error.error.message;
  //           } else {
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //           }
  //         }
  //       );
  //   }, 0);

  // }
  // removeRes(resId, resIndex) {
  //   Swal.fire({
  //     title: '',
  //     text: "Are you sure you want to delete this resource?",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#46448B',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Delete',
  //     cancelButtonText: 'Cancel',
  //     reverseButtons: true,
  //   }).then(result => {
  //     if (result.value) {
  //       let data = {
  //         "resource_id": resId
  //       }
  //       this.frontEndService
  //         .removeResource(data)
  //         .pipe()
  //         .subscribe(
  //           (result: any) => {
  //             if (result.statusCode == 200) {
  //               this.toaster.success(result.message, "", {
  //                 timeOut: 2000,
  //               });
              
  //               this.resourceList.splice(resIndex, 1);
  //             } else {
  //               this.errorMessage =
  //                 "Something went wrong. Please try after sometime.";
  //               this.toaster.error(this.errorMessage, "", {
  //                 timeOut: 2000,
  //               });
  //             }
  //           },
  //           (error: any) => {
  //             if (error.error.message != null && error.error.message != "") {
  //               this.errorMessage = error.error.message;
  //             } else {
  //               this.errorMessage =
  //                 "Something went wrong. Please try after sometime.";
  //             }
  //             this.toaster.error(this.errorMessage, "", {
  //               timeOut: 2000,
  //             });
  //           }
  //         );
  //     }
  //   });
  // }

  getuscList() {

    let industryTag = "";
    let functionTag = "";
    this.ucsLoader = true;
    this.uscList = [];
    // let getTags = this.selectedtags.join(",");
    let getTags = "";
    this.frontEndService
      .getSolutions(this.ucsFetchType, this.ucsId, "", "", "", "published")
      .pipe()
      .subscribe(
        (result: any) => {

          if (result.message == "success") {
            let uscList = result.body;
            this.ucsLength = result.body.length;
            if (result.body.length > 0) {
              /*if(result.body[0].type =='solution'){
                this.moduleTitle = "Solution";
                this.ucsFetchType = "usecase";
                this.tabTitle = "Use Case";
              }
              if(result.body[0].type =='usecase'){
                this.moduleTitle = "Use Case";
                this.ucsFetchType = "solution";
                this.tabTitle = "Solutions";
              }*/
            }
            this.frontEndService.setuscList(uscList).then(value => {
              this.ucsLoader = false;
              this.uscList = value;

              /* this.getuscPipelines();
              this.getuscDiscussions();
              this.getResourses(); */
            }, (error) => {
              this.uscList = uscList;
            });

          } else {
            this.uscList = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.ucsLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.uscList = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.uscList = [];
          }
        }
      );
  }
  openTab(value) {
    setTimeout(() => {
      this.tabGroup.selectedIndex = value;
    }, 10);
  }

  // getuscPipelines(acivePiplineId = "") {
  //   this.viewRedirectContent(this.viewNotifiSession);
  //   this.removeQuoteMessage();    this.messageToSend = "";
  //   this.pipleinesLoader = true;
  //   this.piplines = [];
  //   let ucsId = this.ucsId;
  //   this.frontEndService
  //     .getPipelines(ucsId)
  //     .pipe()
  //     .subscribe(
  //       (result: any) => {
  //         if (result.message == "success") {
  //           let piplines = result.body;
  //           this.frontEndService.setPiplines(piplines, acivePiplineId).then((value: any) => {
  //             this.pipleinesLoader = false;
  //             this.piplines = value.pipeLines;
  //             this.pipelineParticipants = this.piplines[0].sharedUsers;
  //             let activePiplineIndex = value.SelectedPiplineIndex;
  //             let SelectedPipLineMsgsId = this.piplines[activePiplineIndex]["_id"];
  //             this.selectedPiplineId = this.piplines[activePiplineIndex]["_id"];

  //             if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
  //               this.messageToSend = this.pipelineDraftMessageObj[this.selectedPiplineId]
  //             }else{
  //               this.messageToSend = "";
  //             }
  //             this.getPipeLineMessages(activePiplineIndex, SelectedPipLineMsgsId);
  //           }, (error) => {
  //             this.piplines = piplines;
  //           });
  //         } else {
  //           this.piplines = [];
  //           this.errorMessage =
  //             "Something went wrong. Please try after sometime.";
  //         }
  //       },
  //       (error: any) => {
  //         this.pipleinesLoader = false;
  //         this.viewRedirectContent(this.viewNotifiSession);
  //         if (error.error.message != null && error.error.message != "") {
  //           this.errorMessage = error.error.message;
  //           this.piplines = [];
  //         } else {
  //           this.errorMessage =
  //             "Something went wrong. Please try after sometime.";
  //           this.piplines = [];
  //         }
  //       }
  //     );
  // }


  openDesMsgBox(index = 0, discussionId) {
    this.selectedDiscussionId = discussionId;
    this.removeQuoteMessageDiscus();
    if (this.discussionDraftMessageObj.hasOwnProperty(discussionId)) {
      this.discussionmessageToSend = this.discussionDraftMessageObj[discussionId]
    } else {
      this.discussionmessageToSend = "";
    }
    this.descMobChatBoxVisible = true;
    this.getDisucssionMessages(index, discussionId);
  }

  getuscDiscussions(aciveDiscussionId = "") {
    this.viewRedirectContent(this.viewDisucss);
    this.removeQuoteMessageDiscus();
    //Discussion
    this.discussionmessageToSend = "";
    this.discussionLoader = true;
    this.discussions = [];
    let ucsId = this.ucsId;
    let discTypeFilter = this.discTypeFilter;
    this.frontEndService
      .getDiscussions(ucsId, discTypeFilter)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            let discussions = result.body;
            this.frontEndService.setDiscussions(discussions, aciveDiscussionId).then((value: any) => {
              this.discussionLoader = false;
              this.discussions = value.discussion;
              let activeDiscussIndex = value.selectedDiscussIndex;
              let SelectedDiscussionMsgsId = this.discussions[activeDiscussIndex]["_id"];
              this.selectedDiscussionId = this.discussions[activeDiscussIndex]["_id"];
              if (this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)) {
                this.discussionmessageToSend = this.discussionDraftMessageObj[this.selectedDiscussionId]
              } else {
                this.discussionmessageToSend = "";
              }

              let disctypeValue = '';
              if (this.uscType == UsecaseSolutoinTypes.solution) {
                this.selectedDescType = this.discussionType.usecase;
                disctypeValue = 'Use Case'
              }
              if (this.uscType == UsecaseSolutoinTypes.usecase) {
                this.selectedDescType = this.discussionType.solution;
                disctypeValue = 'Solutions'
              }

              this.availabeDiscType[this.availabeDiscType.length - 1]["key"] = this.selectedDescType;
              this.availabeDiscType[this.availabeDiscType.length - 1]["value"] = disctypeValue;//this.selectedDescType;
              this.getDisucssionMessages(activeDiscussIndex, SelectedDiscussionMsgsId);
            }, (error) => {
              this.discussions = discussions;
              this.viewRedirectContent(this.viewDisucss);
            });
          } else {
            this.viewRedirectContent(this.viewDisucss);
            this.discussionLoader = false;
            this.discussions = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.viewRedirectContent(this.viewDisucss);
          this.discussionLoader = false;
          this.discussions = [];
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }

  makeActiveDiscussionClass(_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (_id) {
        for (let i = 0; i < that.discussions.length; i++) {
          that.discussions[i]["activeClass"] = ""
          if (that.discussions[i]._id == _id) {
            this.selectedDiscussion = that.discussions[i];
            that.discussions[i]["activeClass"] = "active_chat"
          }
        }
        resolve(that.discussions);
      } else {
        reject(0);
      }
    })
  }
  discussionMsgLoader: boolean = false;
  discussionMgs: any = [];
  descMobChatBoxVisible: boolean = false;
  descToggleMobChatBox() {
    this.descMobChatBoxVisible = !this.descMobChatBoxVisible;
  }
  getDisucssionMessages(index = 0, discussionId) {
    this.makeActiveDiscussionClass(discussionId).then(res => {
      this.discussionMsgLoader = true;
      this.discussionMgs = [];
      let data = {
        "discussion_id": discussionId,
      }
      this.frontEndService
        .getDiscussionMessages(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.discussionMsgLoader = false;
            if (result.message == "success") {
              this.discussionMgs = result.body;
              /* this.viewRedirectContent(this.viewNotifiSession); */
              setTimeout(() => {
                this.scrollToBottom();
              }, 1);
            } else {
              this.discussionMgs = [];
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            this.discussionMsgLoader = false;
            if (error.error.message != null && error.error.message != "") {
              this.errorMessage = error.error.message;
              this.discussionMgs = [];
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
              this.discussionMgs = [];
            }
          }
        );
    }, error => {

    });

  }
  initUcslist() {
    this.initUcsForm(this.uscFormFieldData);
    this.iniModule();
    this.getUcsDetialsForUcsList();
  }

  promoteLoader: boolean = false;
  isUcsPromoted: boolean = false;

  ngOnInit(): void {

    this.ucsId = localStorage.getItem('ucs_id');
    this.ucs_type = localStorage.getItem('ucs_type');
    this.ucs_user_role = localStorage.getItem('ucs_user_role');


    // -------Get Value From Local storege--------
    if (localStorage.getItem("discussion_drafts") == null) {
      this.discussionDraftMessageObj = {};
    } else {
      this.discussionDraftMessageObj = JSON.parse(localStorage.getItem("discussion_drafts"));
    }

    if (localStorage.getItem("pipeline_drafts") == null) {
      this.pipelineDraftMessageObj = {};
    } else {
      this.pipelineDraftMessageObj = JSON.parse(localStorage.getItem("pipeline_drafts"));
    }


    if (this.ucs_user_role == userRoles.startupGuestUser || this.ucs_user_role == userRoles.corporateGuestUser) {
      this.isGuest = true;
    }
    this.isAuthenticated();
    this.isStartup == false
    if (this.promoteEmitter.subsVar == undefined) {
      this.promoteEmitter.subsVar = this.promoteEmitter.promoteEmitter.subscribe((value) => {
        this.isUcsPromoted = value.val;
        this.isDeleted = value.val;
        this.promoteEmitter.subsVar = undefined;
        setTimeout(() => {
          this.ref.detectChanges()
        }, 200);

      })

    }

    // if (this.userAddRemoveEmitterService.subsVar == undefined) {
    //   this.userAddRemoveEmitterService.subsVar = this.userAddRemoveEmitterService.userAddEmitter.subscribe((value) => {
    //     this.userAddRemoveEmitterService.subsVar = undefined;
    //     this.overViewDetails.sharedUsers = value.value;

    //   })

    //   this.userAddRemoveEmitterService.subsVar = this.userAddRemoveEmitterService.userRemoveEmitter.subscribe((value) => {
    //     this.userAddRemoveEmitterService.subsVar = undefined;
    //     this.overViewDetails.sharedUsers.splice(value.userIndex, 1);

    //   })

    // }

    $('body').addClass('bg-change');
    this.selectedAttachments = [];
    this.industries = [];
    this.functions = [];
    this.technologies = [];
    this.items = [];

    if (this.ucsId) {
      this.initUcslist();
      this.initAvailabelTypes();
      this.viewOverview();
      this.getuscDiscussions();
      this.viewResources();
      this.viewUscList();

    } else {
      this.ucsId = "";
      this.redirectUser();
    }
    // this.route.params.subscribe((params) => {
    //   this.ucsId =
    //     params.id != null && params.id !== undefined ? params.id : "";
    //   if (this.ucsId) {
    //     this.initUcslist();
    //     this.initAvailabelTypes();
    //   } else {
    //     this.ucsId = "";
    //     this.redirectUser();
    //   }
    // });
  }


  ngAfterViewInit() {
    this.ucsLoader = true;
    if (localStorage.getItem('viewNotifi') == "true") {
      this.selectedTab = 1;
      // this.viewPipline()
    } else if (localStorage.getItem('viewDisucss') == "true") {
      this.selectedTab = 3;
      this.viewDiscussion();
    } else {
      this.selectedTab = 0;
      setTimeout(() => {
        this.viewUscList();
      }, 1000);

    }
  }

  stopPromoting(isUcsPromoted) {


    let DialogConfig = {
      data: {
        "ucsId": this.ucsId,
        "checkbox": true,
        "isUcsPromoted": isUcsPromoted,
        "isDeleted": !isUcsPromoted,
        "title": this.ucsTitle
      },
      width: '544px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(PromotePopupComponent, DialogConfig);
  }


  initUcsForm(fieldData) {
    this.ucsForm = this.fb.group(fieldData);
  }

  // acceptRejctUcs(flag) {

  //   if (flag == 'reject') {
  //     let data = {
  //       "ucs_id": this.selectedPipeline._id
  //     }
  //     this.frontEndService
  //       .rejectPipline(data)
  //       .pipe()
  //       .subscribe(
  //         (result: any) => {
  //           if (result.statusCode == 200) {
  //             this.toaster.success(result.message, "", {
  //               timeOut: 2000,
  //             });
  //             this.getuscPipelines();
  //           } else {
  //             this.uscList = [];
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //           }
  //           this.toaster.error(this.errorMessage, "", {
  //             timeOut: 2000,
  //           });
  //         },
  //         (error: any) => {
  //           this.ucsLoader = false;
  //           if (error.error.message != null && error.error.message != "") {
  //             this.errorMessage = error.error.message;
  //             this.uscList = [];
  //           } else {
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //             this.uscList = [];
  //           }
  //           this.toaster.error(this.errorMessage, "", {
  //             timeOut: 2000,
  //           });
  //         }
  //       );
  //   } else {
  //     let data = {
  //       "pipeline_id": this.selectedPipeline._id
  //     }
  //     this.frontEndService
  //       .blockPipline(data)
  //       .pipe()
  //       .subscribe(
  //         (result: any) => {
  //           if (result.statusCode == 200) {
  //             this.toaster.success(result.message, "", {
  //               timeOut: 2000,
  //             });
  //             this.getuscPipelines();
  //           } else {
  //             this.uscList = [];
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //           }
  //           this.toaster.error(this.errorMessage, "", {
  //             timeOut: 2000,
  //           });
  //         },
  //         (error: any) => {
  //           this.ucsLoader = false;
  //           if (error.error.message != null && error.error.message != "") {
  //             this.errorMessage = error.error.message;
  //             this.uscList = [];
  //           } else {
  //             this.errorMessage =
  //               "Something went wrong. Please try after sometime.";
  //             this.uscList = [];
  //           }
  //           this.toaster.error(this.errorMessage, "", {
  //             timeOut: 2000,
  //           });
  //         }
  //       );
  //   }
  // }

  redirectUser() {
    if (this.authService.isAuthenticated()) {
      if (this.localStorageService.userDetails.roles == userRoles.cgAdmin) {
        this.RedirectDashboard();
      } else if (
        this.localStorageService.userDetails.roles == userRoles.startupAdmin ||
        this.localStorageService.userDetails.roles == userRoles.startupUser ||
        this.localStorageService.userDetails.roles == userRoles.startupGuestUser
      ) {
        this.redirectToStartupDashboard();
      } else if (
        this.localStorageService.userDetails.roles == userRoles.corporateAdmin ||
        this.localStorageService.userDetails.roles == userRoles.corporateUser ||
        this.localStorageService.userDetails.roles == userRoles.corporateGuestUser
      ) {
        this.redirectToCorpDashboard();
      }
    }
  }
  iniModule() {
    if (
      this.localStorageService.userDetails.roles == userRoles.startupAdmin ||
      this.localStorageService.userDetails.roles == userRoles.startupUser ||
      this.localStorageService.userDetails.roles == userRoles.startupGuestUser
    ) {
      /*this.moduleTitle = "Solution";
      this.ucsFetchType = "usecase";
      this.tabTitle = "Use Case";*/
      this.isStartup = true;
    } else if (
      this.localStorageService.userDetails.roles == userRoles.corporateAdmin ||
      this.localStorageService.userDetails.roles == userRoles.corporateUser ||
      this.localStorageService.userDetails.roles == userRoles.corporateGuestUser
    ) {
      /*this.moduleTitle = "Use Case";
      this.ucsFetchType = "solution";
      this.tabTitle = "Solutions";*/
      this.isStartup = false;
    }
    if (
      this.ucs_type == 'solution'
    ) {
      this.moduleTitle = "Solution";
      this.ucsFetchType = "usecase";
      this.tabTitle = "Use Case";
    } else if (
      this.ucs_type == 'usecase'
    ) {
      this.moduleTitle = "Use Case";
      this.ucsFetchType = "solution";
      this.tabTitle = "Solutions";
    }
    this.uscType = this.frontEndService.getUserRoleType();
  }

  initUcsLoader: boolean = false
  deleteUcsLoader: boolean = false;

  deleteUcs() {
    this.deleteUcsLoader = true;
    this.frontEndService
      .deleterelevantdata(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.deleteUcsLoader = false;
          if (result.statusCode == 200) {
            this.toaster.success(result.message, "", {
              timeOut: 2000,
            });
            setTimeout(() => {
              this.redirectUser();
            }, 1);

          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.toaster.success(this.errorMessage, "", {
              timeOut: 2000,
            });
          }
        },
        (error: any) => {
          this.deleteUcsLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
          this.toaster.success(this.errorMessage, "", {
            timeOut: 2000,
          });
        }
      );
  }
  getUcsDetialsForUcsList() {
    let rediectSessions: any = {};
    this.initUcsLoader = true;
    let isViewNotification: boolean = false;
    let viewDisucss = false;
    if (this.isRedirectSession(this.viewNotifiSession)) {
      isViewNotification = true;
      rediectSessions[this.viewNotifiSession] = isViewNotification;
    }
    if (this.isRedirectSession(this.viewDisucss)) {
      viewDisucss = true;
      rediectSessions[this.viewDisucss] = viewDisucss;
    }
    this.overViewDetails = "";
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (isViewNotification == false && viewDisucss == false) {
            rediectSessions = "";
            this.initUcsLoader = false;
          }
          if (result.statusCode == 200) {
            this.overViewDetails = result.body[0]; console.log(this.overViewDetails);
            if (this.overViewDetails.technologies[0] != 0 && this.overViewDetails.technologies != null && this.overViewDetails.technologies.length > 0) {
              this.selectedTechno = this.overViewDetails.technologies
            }
            this.ucsTitle = this.overViewDetails.title;
            this.editTitle = this.ucsTitle;
            this.publishedStatus = this.overViewDetails.status;
            if(this.publishedStatus == "unpublished" && this.selectedTab == 3){
              this.selectedTab = 1;
            }
            this.ucsType = this.overViewDetails.type;
            this.isUcsPromoted = this.overViewDetails.is_promoted;
            let tags = [];
            if (this.overViewDetails.tags.length > 0) {
              tags = this.overViewDetails.tags;
            }
            if (tags.length > 0) {
              this.tags = tags;
            }
            this.selectedtags = this.tags;
            this.uscFormFieldData = {
              industry: [{
                value: this.overViewDetails.industries[0],
                disabled: true,
              }],
              function: [{
                value: this.overViewDetails.functions[0],
                disabled: true,
              }],
              techonolgy: [{
                value: this.selectedTechno,
                disabled: true,
              }],
              selectedtags: [{
                value: this.selectedtags,
                disabled: true,
              }],
              shortDesc: [
                {
                  value: this.overViewDetails["short_description"],
                  disabled: true,
                }
              ],
              longDesc: [
                {
                  value: this.overViewDetails["long_description"],
                  disabled: true,
                }
              ],
            };
            this.initUcsForm(this.uscFormFieldData);
            if (rediectSessions == "") {
              this.initUcsLoader = false;
              if (this.publishedStatus == 'published') {
                this.backToUscList()
              } else {
                this.viewOverview()
              }
            } else {
              this.listTag(rediectSessions);
            }
            this.frontEndService
              .deleterelevantdata(this.ucsId)
              .pipe()
              .subscribe(
                (result: any) => {
                  if (result.message == "success") {
                  } else {
                    this.errorMessage =
                      "Something went wrong. Please try after sometime.";
                  }
                },
                (error: any) => {
                  if (error.error.message != null && error.error.message != "") {
                  } else {
                    this.errorMessage =
                      "Something went wrong. Please try after sometime.";
                  }
                }
              );
          } else {
            this.overViewDetails = "";
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.overViewDetails = "";
          this.initUcsLoader = false;
          this.ucsId = "";
          this.redirectUser();
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.overViewDetails = "";
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.overViewDetails = "";
          }
        }
      );
  }
  getUcsDetail() {
    this.overViewLoader = true;
    this.overViewDetails = "";
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.statusCode == 200) {
            this.overViewDetails = result.body[0];
            if (this.overViewDetails.is_sample) {
              if (this.userId == this.overViewDetails.created_by) {
                this.isSampleEditable = true;
              } else {
                this.isSampleEditable = false;
              }
            } else {
              this.isSampleEditable = true;
            }
            this.participants = this.overViewDetails.sharedUsers;
            this.isUcsPromoted = this.overViewDetails.is_promoted;
            if (this.overViewDetails.technologies[0] != 0 && this.overViewDetails.technologies != null && this.overViewDetails.technologies.length > 0) {
              this.selectedTechno = this.overViewDetails.technologies
            }
            this.ucsTitle = this.overViewDetails.title;
            this.editTitle = this.ucsTitle;
            this.publishedStatus = this.overViewDetails.status;
            this.ucsType = this.overViewDetails.type;
            let tags = [];
            if (this.overViewDetails.tags.length > 0) {
              tags = this.overViewDetails.tags;
            }
            if (tags.length > 0) {
              this.tags = tags;
            }
            this.selectedtags = this.tags;
            this.uscFormFieldData = {
              industry: [{
                value: this.overViewDetails.industries[0],
                disabled: true,
              }],
              function: [{
                value: this.overViewDetails.functions[0],
                disabled: true,
              }],
              techonolgy: [{
                value: this.selectedTechno,
                disabled: true,
              }],
              selectedtags: [{
                value: this.selectedtags,
                disabled: true,
              }],
              shortDesc: [
                {
                  value: this.overViewDetails["short_description"],
                  disabled: true,
                },
              ],
              longDesc: [
                {
                  value: this.overViewDetails["long_description"],
                  disabled: true,
                }
              ],
            };
            this.listTag("");
            this.initUcsForm(this.uscFormFieldData);
            if (this.selectedTab == 1) {
              this.pipelineChild.getsharedUserList(this.participants)
            } else if (this.selectedTab == 2) {
              this.evalChild.getsharedUserList(this.participants)
            }else if (this.selectedTab == 3) {
              this.discussionChild.getsharedUserList(this.participants)
            }
          } else {
            this.overViewDetails = "";
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.overViewDetails = "";
          this.overViewLoader = false;
          this.ucsId = "";
          this.redirectUser();
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.overViewDetails = "";
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.overViewDetails = "";
          }
        }
      );
  }

  tagsLoader: boolean = false;


  listTag(rediectSessions = "") {
    this.tagsLoader = true;
    this.items = [];
    this.frontEndService
      .getTags()
      .pipe()
      .subscribe(
        (result: any) => {
          this.tagsLoader = false;
          if (result.message == "success") {
            let items = result.body;
            this.frontEndService.setTagList(items).then(value => {
              this.items = value;
              if (rediectSessions != "") {
                if (rediectSessions[this.viewNotifiSession]) {
                  // this.viewPipline()
                } else if (rediectSessions[this.viewDisucss]) {
                  this.viewDiscussion()
                }
              }
            }, (error) => {
              this.viewRedirectContent(this.viewDisucss);
              this.viewRedirectContent(this.viewNotifiSession);
              this.items = items;
            });
          } else {
            this.viewRedirectContent(this.viewDisucss);
            this.viewRedirectContent(this.viewNotifiSession);
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.viewRedirectContent(this.viewDisucss);
          this.viewRedirectContent(this.viewNotifiSession);
          this.tagsLoader = false;
          if (error.error.message != null && error.error.message != "") {
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }
  initOverView() {
    this.showOverView = false;
    // this.isPublishButtonClicked = false;
    this.initUcsForm(this.uscFormFieldData);
    this.iniModule();
    this.viewOverview()
  }
  addNewTag(name) {
    return name;
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
  get f() {
    return this.ucsForm.controls;
  }
  redirectoUcsDetail(id) {
    this.seeUcsDetails(id);
    //this.getUcsOverviewDetail(id); //commented by suman for detail page imapct on participants list on 21-10-2020
    /*  if (localStorage.getItem("mainUcsId")) {-
       sessionStorage.removeItem("mainUcsId");-
     }
     localStorage.setItem("mainUcsId", this.ucsId)
     this.varService.setValue(true);
     setTimeout(() => {
       this.routerService.redirectoUcsDetail(id);
     }, 2) */
  }

  saveUcs(name) {
    this.tagsError = false;
    this.shortDescError = false;
    this.functionError = false;
    this.industryError = false;
    let isInvalid: boolean = false;
    this.isPublishButtonClicked = false;
    if (name == "saveTags") {
      if (this.selectedtags.length == 0) {
        this.toaster.error("Please select at least one tag.", "", {
          timeOut: 2000,
        });
        this.tagsError = true;
        isInvalid = true;
      }
      if (!isInvalid) {
        this.updateucs().then((res) => {
          if (res == 200) {
            this.disableTagSelect("disable");
          }
        }, (error) => {

        });
      }
    } else {
      if (name == "shortDesc") {
        let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
        if (shortDesc == "" || shortDesc == null) {
          this.toaster.error("Short description cannot be blank!", "", {
            timeOut: 2000,
          });
          isInvalid = true;
          this.shortDescError = true;
        }
      } else if (name == "longDesc") {
      } else if (name == "industry") {
        let industry = this.ucsForm.controls["industry"].value;
        if (industry == null || industry == undefined || industry == "") {
          this.toaster.error("Please select industry!", "", {
            timeOut: 2000,
          });
          this.industryError = true;
          isInvalid = true;
        }
      } else if (name == "function") {
        let funct = this.ucsForm.controls["function"].value;
        if (funct == null || funct == undefined || funct == "") {
          this.toaster.error("Please select function!", "", {
            timeOut: 2000,
          });
          isInvalid = true;
          this.functionError = true;
        }
      } else if (name == "techonolgy") {
        let techonolgy = this.ucsForm.controls["techonolgy"].value;
        if (techonolgy.length == 1) {
          if (techonolgy.value) {
            let seltechs = techonolgy.value[0];
            if (seltechs.key == "") {
              techonolgy = [];
            }
          }
        }
        if (
          techonolgy == null ||
          techonolgy == undefined ||
          techonolgy == "" ||
          techonolgy.length == 0
        ) {
          this.toaster.error("Please select at least one technology.", "", {
            timeOut: 2000,
          });
          this.technoError = true;
          isInvalid = true;
        }
      }
      if (!isInvalid) {
        this.updateucs().then((res) => {
          if (res == 200) {
            this.makeEabelDisableForm(name, "disable");
          }
        }, (error) => {

        });
      }
    }
  }
  publish() {
    if (this.localStorageService.userDetails.roles != userRoles.corporateGuestUser && this.localStorageService.userDetails.roles != userRoles.startupGuestUser) {
      this.isPublishButtonClicked = false;
      this.tagsError = false;
      this.technoError = false;
      this.shortDescError = false;
      this.functionError = false;
      this.industryError = false;
      this.selectedtags = this.overViewDetails.tags;
      let selectedtags = this.overViewDetails.tags;
      let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
      let industry = this.overViewDetails.industries[0];
      let funct = this.overViewDetails.functions[0];
      let techonolgy = this.overViewDetails.technologies;
      if (this.ucsForm.controls["industry"].value != "") {
        industry = this.ucsForm.controls["industry"].value;
      }
      if (this.ucsForm.controls["function"].value != "") {
        funct = this.ucsForm.controls["function"].value;
      }
      if (this.ucsForm.controls["selectedtags"].value) {
        selectedtags = this.ucsForm.controls["selectedtags"].value;
        if (selectedtags.length == 1) {
          if (selectedtags.value) {
            let selTechnoo = selectedtags.value[0];
            if (selTechnoo.key == "") {
              selectedtags = [];
            }
          }

        }
      }
      if (this.ucsForm.controls["techonolgy"].value) {
        techonolgy = this.ucsForm.controls["techonolgy"].value;
        if (techonolgy.length == 1) {
          if (techonolgy.value) {
            let selTechnoo = techonolgy.value[0];
            if (selTechnoo.key == "") {
              techonolgy = [];
            }
          }

        }
      }
      if ((selectedtags.length < 1) || (techonolgy.length < 1) || (shortDesc == "" || shortDesc == null) || (industry == null || industry == undefined || industry == "") || (funct == null || funct == undefined || funct == "")) {
        if ((selectedtags.length < 1)) {
          this.tagsError = true;
        }
        if ((techonolgy.length < 1)) {
          this.technoError = true;
        }
        if (shortDesc == "" || shortDesc == null) {
          this.shortDescError = true;
        }
        if (industry == null || industry == undefined || industry == "") {
          this.industryError = true;
        }
        if (funct == null || funct == undefined || funct == "") {
          this.functionError = true;
        }
        this.isPublishButtonClicked = false;
        this.publishBtnLoader = false;
        this.toaster.error("Tags,industry,function and short description are mandatory to publish.", "", {
          timeOut: 5000,
        });
      } else {
        let isPending: boolean = false;
        /* if (this.ucsForm.controls["longDesc"]["status"] == "VALID") {
           this.toaster.error("Long description  is pending.", "", {
             timeOut: 2000,
           });
           isPending = true;
         }
         if (this.ucsForm.controls["shortDesc"]["status"] == "VALID") {
           this.toaster.error("Short description  is pending.", "", {
             timeOut: 2000,
           });
           isPending = true;
         }
         if (this.ucsForm.controls["techonolgy"]["status"] == "VALID") {
           this.toaster.error("Techonolgy is pending.", "", {
             timeOut: 2000,
           });
           isPending = true;
         }
         if (this.ucsForm.controls["function"]["status"] == "VALID") {
           this.toaster.error("Function is pending.", "", {
             timeOut: 2000,
           });
           isPending = true;
         }
         if (this.ucsForm.controls["industry"]["status"] == "VALID") {
           this.toaster.error("Industry is pending.", "", {
             timeOut: 2000,
           });
           isPending = true;
         }
         if (this.ucsForm.controls["selectedtags"]["status"] == "VALID") {
           this.toaster.error("Tag is pending.", "", {
             timeOut: 2000,
           });
           isPending = true;
         } */
        if (selectedtags.length > 3 && this.isStartup == true) {
          this.toaster.error("Maximum 3 tags are allowed.", "", {
            timeOut: 2000,
          });
          isPending = true;
        }
        if (!isPending) {
          this.publishedStatus = "published";
          this.isPublishButtonClicked = true;
          this.publishBtnLoader = true;
          this.updateucs().then((res) => {
            if (res == 200) {
              this.frontEndService
                .checkrelevantdata(this.ucsId)
                .pipe()
                .subscribe(
                  (result: any) => {
                    if (result.message == "success") {
                      this.viewUscList();
                    } else {
                      this.errorMessage =
                        "Something went wrong. Please try after sometime.";
                    }
                  },
                  (error: any) => {
                    if (error.error.message != null && error.error.message != "") {
                    } else {
                      this.errorMessage =
                        "Something went wrong. Please try after sometime.";
                    }
                  }
                );
            }
          }, (error) => {

          });
        }
      }
    } else {
      this.toaster.error("As a guest user you cannot make changes.", "", {
        timeOut: 2000,
      });
    }
  }

  shortDescError: boolean = false;
  tagsError: boolean = false;
  technoError: boolean = false;
  industryError: boolean = false;
  functionError: boolean = false;

  checkValue(val: any, controlName) {

    let chkVal = val
    if (controlName == 'shortDesc') {
      if (chkVal.trim() == "") {
        this.shortDescError = true;
      } else {
        this.shortDescError = false;
      }
    }
    if (controlName == 'selectedtags') {
      if (chkVal.length == 0) {
        this.tagsError = true;
      } else {
        if (chkVal.length > 3) {
          if (this.localStorageService.userDetails.roles == userRoles.startupAdmin
            || this.localStorageService.userDetails.roles == userRoles.startupUser) {
            this.tagsError = true;
          } else {
            this.tagsError = false;
          }
        } else {
          this.tagsError = false;
        }

      }
    }
    if (controlName == 'techonolgy') {
      if (chkVal.length == 0) {
        this.technoError = true;
      } else {
        this.technoError = false;
      }
    }
    if (controlName == 'industry') {
      if (chkVal == "" || chkVal == null || chkVal == undefined) {
        this.industryError = true;
      } else {
        this.industryError = false;
      }
    }
    if (controlName == 'function') {
      if (chkVal == "" || chkVal == null || chkVal == undefined) {
        this.functionError = true;
      } else {
        this.functionError = false;
      }
    }
  }

  updateucs() {


    // let case_study_attachments =this.getfilename;
    return new Promise((resolve, reject) => {
      let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
      let longDesc = this.ucsForm.controls["longDesc"].value;
      let industry = this.overViewDetails.industries[0];
      let funct = this.overViewDetails.functions[0];
      let techonolgy = this.overViewDetails.technologies;
      let selectedtags = this.overViewDetails.tags;
      if (this.ucsForm.controls["industry"].value != "") {
        industry = this.ucsForm.controls["industry"].value;
      }
      if (this.ucsForm.controls["function"].value != "") {
        funct = this.ucsForm.controls["function"].value;
      }

      if (this.ucsForm.controls["techonolgy"].value) {
        techonolgy = this.ucsForm.controls["techonolgy"].value;
        if (techonolgy.length == 1) {
          if (techonolgy.value) {
            let selTechnoo = techonolgy.value[0];
            if (selTechnoo.key == "") {
              techonolgy = [];
            }
          }

        }
      }
      if (this.ucsForm.controls["selectedtags"].value) {
        selectedtags = this.ucsForm.controls["selectedtags"].value;
        if (selectedtags.length == 1) {
          if (selectedtags.value) {
            let seltags = selectedtags.value[0];
            if (seltags.key == "") {
              selectedtags = [];
            }
          }

        }
      }
      /*   if (shortDesc == "" || shortDesc == null || shortDesc == undefined) {
          this.shortDescError = true;
          this.toaster.error("Please provide short description.", "", {
            timeOut: 2000,
          });
        } */
      /*  if ((selectedtags.length < 1) || selectedtags == null || selectedtags == undefined || selectedtags == "") {
         this.tagsError = true;
         this.toaster.error("Please select at least one tag.", "", {
           timeOut: 2000,
         });
       } else {
         if (selectedtags) {
           let tags = selectedtags.join(",");
           selectedtags = tags
         } else {
           this.tagsError = true;
           this.toaster.error("Please select at least one tag.", "", {
             timeOut: 2000,
           });
         }
       } */
      if (selectedtags) {
        let tags = selectedtags.join(",");
        selectedtags = tags
      }
      let ucsTitle = this.editTitle != '' ? this.editTitle : this.ucsTitle;

      /*   if (industry == null || industry == undefined || industry == "") {
          this.industryError = true;
          this.toaster.error("Please select industry", "", {
            timeOut: 2000,
          });
        } */
      /*  if (funct == null || funct == undefined || funct == "") {
         this.functionError = true;
         this.toaster.error("Please select at least one function", "", {
           timeOut: 2000,
         });
       } */
      //  if (this.shortDescError == false && this.functionError == false && this.tagsError == false && this.industryError == false) {
      let data = {
        ucs_id: this.ucsId,
        user_id: this.userId,
        type: this.uscType,
        title: ucsTitle,
        short_description: shortDesc,
        long_description: longDesc,
        tags: selectedtags,
        status: this.publishedStatus,
        industries: [industry],
        functions: [funct],
        technologies: techonolgy,
        annual_recurring_revenue: this.overViewDetails.annual_recurring_revenue,
        rol_of_solution: this.overViewDetails.rol_of_solution,
        total_number_of_customers: this.overViewDetails.total_number_of_customers,
        marquee_customers: this.overViewDetails.marquee_customers,
        // case_study_attachments:case_study_attachments,
        product_explainer_videos: this.overViewDetails.product_explainer_videos,
        testimonials: this.overViewDetails.testimonials,
        additional_fields: this.overViewDetails.additional_fields

      };

      this.frontEndService
        .ucsUpdate(data)
        .pipe()
        .subscribe(
          (result: any) => {



            /*  this.overViewLoader=true; */
            if (result.statusCode == 200) {
              let updatedTerm = "Solution";
              if (this.uscType == UsecaseSolutoinTypes.solution) {
                updatedTerm = "Solution";
              }
              if (this.uscType == UsecaseSolutoinTypes.usecase) {
                updatedTerm = "Use case";
              }
              if (this.isPublishButtonClicked == true) {
                this.toaster.success(updatedTerm + " has been published successfully!", "", {
                  timeOut: 2000,
                });
              } else {
                /*    this.toaster.success(updatedTerm + " detail updated successfully!", "", {
                     timeOut: 2000,
                   }); */
              }
              this.isPublishButtonClicked = false;
              this.publishBtnLoader = false;
              resolve(result.statusCode);
              /* this.viewOverview(); */
            } else {
              reject(result.statusCode);
              this.isPublishButtonClicked = false;
              this.publishBtnLoader = false;
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            reject(-1);
            this.isPublishButtonClicked = false;
            this.publishBtnLoader = false;
            /*  console.log(error); */
            /*  this.overViewLoader=false; */
            if (error.error.message != null && error.error.message != "") {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          }
        );

      // } else {
      // reject(-1);
      //}
    });
  }






  // ------Function is used for filter the participants list using keywords ---------
  filterParticipants(searchString) {
    this.participants = this.overViewDetails.sharedUsers.filter(function (e) {
      var username = e.fullname.toLowerCase();
      searchString = searchString.toLowerCase();
      if (username.indexOf(searchString) != -1) {
        return true;
      } else {
        return false;
      }

    });
  }


  // ---------New Code For Discussion ---------
  // ------Function is used for handle the keypress event ---------
  checkInputForDiscussion(event) {
    this.pressedKey = event.key;
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.discussionmessageToSend.lastIndexOf('@', cursorPosition);
    this.tagIndex = cursorPosition;

    const str1 = this.discussionmessageToSend.substring(atPosition);
    const str2 = str1.substring(str1.lastIndexOf('@')).split(' ')[0];

    if (event.key === "@") {
      this.participants = this.overViewDetails.sharedUsers;
      this.showParticipants = true;

    } else if (event.key === " ") {
      this.showParticipants = false;
    } else {
      if (str1.indexOf('@') >= 0) {
        var searchString = str2 + event.key
        searchString = searchString.replace(/\s/g, '');
        searchString = searchString.replace('@', '');
        this.filterParticipants(searchString);

      } else {
        this.showParticipants = false;
      }
    }
  }

  // ------Function is used for handle selected Tag from suggestions ---------
  selectedMenuForDiscussion(selectedValue, id) {
    var selectedValue = selectedValue.split(" ");
    selectedValue = selectedValue[0];
    this.showParticipants = false;
    this.replaceString = this.replaceString.replace(/\s/g, '');
    if (this.pressedKey === "@") {
      let indexPosition = this.tagIndex + 1;
      this.discussionmessageToSend = this.discussionmessageToSend.slice(0, indexPosition)
        + selectedValue + ' '
        + this.discussionmessageToSend.slice(indexPosition);
      setTimeout(() => this.discussionmessage.nativeElement.focus(), 500);

    } else {

      this.discussionmessageToSend = this.discussionmessageToSend.replace(this.replaceString, "@" + selectedValue + ' ');
      setTimeout(() => this.discussionmessage.nativeElement.focus(), 500);
    }
    this.pressedKey = "";
  }

  // ------Function is used for handle keydown event ---------
  keyDownHandlerForDiscussion(event) {
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.discussionmessageToSend.lastIndexOf('@', cursorPosition);
    if (event.code === 'Backspace') {

      const strFound = this.discussionmessageToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound2 = this.discussionmessageToSend.substring(atPosition, cursorPosition);
      const spacePosition = this.discussionmessageToSend.lastIndexOf(' ', cursorPosition);
      const string = this.discussionmessageToSend.substring(atPosition + 1, spacePosition);

      var afterbang = this.discussionmessageToSend.substring(atPosition, this.discussionmessageToSend.indexOf(' ', atPosition));

      if (/\s/.test(strFound2) || strFound2 == "@" || string == "") {
        // console.log("whitespace", strFound2)
        this.showParticipants = false;
      } else {
        this.participants = this.overViewDetails.sharedUsers;
        if (this.discussionmessageToSend.lastIndexOf('@') == atPosition) {
          var removeStringIndex = cursorPosition - (atPosition + 1);
          const str1 = this.discussionmessageToSend.substring(atPosition - 1);
          const str2 = str1.substring(str1.lastIndexOf('@')).split(' ')[0];
          var validstring = str2.substr(0, removeStringIndex) + "" + str2.substr(removeStringIndex + 1);
          this.replaceString = validstring;

          var searchTag = this.replaceString.replace(/\s/g, '');
          searchTag = searchTag.replace('@', '');
          this.filterParticipants(searchTag);


        } else {
          var removeCharIndex = strFound2.length - 1;
          var part1 = afterbang.substring(0, removeCharIndex);
          var part2 = afterbang.substring(removeCharIndex + 1, afterbang.length);
          this.replaceString = part1 + part2;

          var searchTag = this.replaceString.replace(/\s/g, '');
          searchTag = searchTag.replace('@', '');
          this.filterParticipants(searchTag);

        }
        this.showParticipants = true;
      }
    } else {
      const strFound = this.discussionmessageToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound1 = this.discussionmessageToSend.substring(atPosition, cursorPosition + 1);
      var afterbang = this.discussionmessageToSend.substring(atPosition, this.discussionmessageToSend.indexOf(' ', atPosition));
      this.replaceString = strFound1 + event.key;
    }

  }


  //-----------------Function form Team Discussion -------------------
  getDiscussionDraftMessage() {
    if (this.discussionmessageToSend == "") {
      if (this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)) {
        var DeletedId = this.selectedDiscussionId;
        delete this.discussionDraftMessageObj[DeletedId];
        localStorage.setItem("discussion_drafts", JSON.stringify(this.discussionDraftMessageObj));
      }
    } else {
      if (this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)) {
        this.discussionDraftMessageObj[this.selectedDiscussionId] = this.discussionmessageToSend;
      } else {
        var id = this.selectedDiscussionId;
        this.discussionDraftMessageObj[id] = this.discussionmessageToSend;
      }
      localStorage.setItem("discussion_drafts", JSON.stringify(this.discussionDraftMessageObj));
    }
  }

  // -------------Reply functionality for Discussion--------------------
  DiscussionReply(event: MouseEvent, messageId, message, sendername, messsageDate) {
    this.quoteMessageDiscus = message;
    this.quoteMessageIdDiscus = messageId;
    this.quoteMessageSenderDiscus = sendername;
    this.quoteMessageDateDiscus = messsageDate;
    this.showReplyBoxDiscus = true;
  }

  removeQuoteMessageDiscus() {
    this.quoteMessageDiscus = "";
    this.quoteMessageIdDiscus = "";
    this.quoteMessageSenderDiscus = "";
    this.quoteMessageDateDiscus = "";
    this.showReplyBoxDiscus = false;
  }



  removeQuoteMessageApi(type, recordId) {
    let data = {
      "type": type,
      "id": recordId,
    }
    this.frontEndService
      .deleteDrafts(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.sendMessageLoader = false;
          // if (result.statusCode == 200) {
          //   this.sendMessageLoader = false;
          // } else {
          //   this.sendMessageLoader = false;
          // }

        },
        (error: any) => {
          this.sendMessageLoader = false;
        }
      );
  }

  getCompanyprofile() {

    // this.ucsLoader = true;
    this.frontEndService
      .getcompanyProfile(this.uscaseid)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {
            this.getuscprofile = result.body[0];
            this.marqueeCustomers = result.body[0].additional_fields.marqueeCustomers;
            this.problemyour = result.body[0].description;
            this.annualRecurringRevenue = result.body[0].additional_fields.annualRecurringRevenue;
            this.totalCustomers = result.body[0].additional_fields.totalCustomers;
            this.profilelogo = result.body[0].logo[0].path;
            this.linkedin = result.body[0].founder_linkedin_profiles;
            this.currentPaying = result.body[0].additional_fields.Current_Paying_Clients;

          } else {
            this.getuscprofile = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.ucsLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.getuscprofile = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";

          }
        }
      );
  }


  // --------------child  comonent event----------------

  publicStatusUpdate(status) {
    this.publishedStatus = status;
	this.viewUscList();
    this.getSharedUser();
  }

  availabeDiscTypeUpdate(sharedata) {
    this.availabeDiscType[this.availabeDiscType.length - 1]["key"] = sharedata[0];
    this.availabeDiscType[this.availabeDiscType.length - 1]["value"] = sharedata[1];
  }


  getSharedUser() {
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            // this.overViewDetails = result.body[0]; console.log(this.overViewDetails);
            this.overViewDetails.sharedUsers = result.body[0].sharedUsers;
            this.selectedtags = this.tags;
            this.uscFormFieldData = {
              industry: [{
                value: this.overViewDetails.industries[0],
                disabled: true,
              }],
              function: [{
                value: this.overViewDetails.functions[0],
                disabled: true,
              }],
              techonolgy: [{
                value: this.selectedTechno,
                disabled: true,
              }],
              selectedtags: [{
                value: this.selectedtags,
                disabled: true,
              }],
              shortDesc: [
                {
                  value: this.overViewDetails["short_description"],
                  disabled: true,
                }
              ],
              longDesc: [
                {
                  value: this.overViewDetails["long_description"],
                  disabled: true,
                }
              ],
            };            
          } else {
            this.overViewDetails = "";
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.overViewDetails = "";
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.overViewDetails = "";
          }
        }
      );
  }

}