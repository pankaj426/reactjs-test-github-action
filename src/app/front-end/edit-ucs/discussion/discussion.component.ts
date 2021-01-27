import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { CommonService } from '../../../shared/services/common.service';
import { SharedVarService } from '../../../shared/services/shared-var.service';
import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterService } from "../../../shared/services/router.service";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { AuthService } from "../../../shared/services/auth.service";
import { userRoles, UsecaseSolutoinTypes, discussionType, redirectSessions } from "../../../shared/constants/enum";
import { FrontEndService } from "../../services/front-end.service";
import { ToastrService } from "ngx-toastr";
import { DateFormatService } from "../../../shared/services/date-format.service";
import { MatDialog } from '@angular/material/dialog';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { environment } from "../../../../environments/environment";
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddChatTopicComponent } from '../add-chat-topic/add-chat-topic.component';
declare var $: any;

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.sass']
})
export class DiscussionComponent implements OnInit {

  
  @ViewChild('discussionmessage') discussionmessage: ElementRef;
  
  userRoles: any = userRoles;

  selectedDiscussionId: any;
  discussionDraftMessageObj :any = {};
  availabeDiscType: any;

  quoteMessageDiscus :any = "";
  quoteMessageIdDiscus :any = "";
  quoteMessageSenderDiscus :any = "";
  quoteMessageDateDiscus :any = "";
  showReplyBoxDiscus:boolean = false;
  
  discTypeFilter: any = "";
  selectedDescType: any = "";
  discussionType: any = discussionType
  
  selectedDiscussion: any = "";
  messageToSend = "";
  initUcsLoader: boolean = false;
  
  discussionLoader: boolean = false;
  discussionmessageToSend: any = "";
  discussions: any = [];
  viewDisucss = redirectSessions.viewDisucss;
  
  showSearchBox: boolean = false;
  showDescSearchBox: boolean = false;
  showPublishBtn: boolean = false;
  sendMessageLoader: boolean = false;

  ucsId: any = "";
  ucs_type: any = "";
  ucs_user_role: any = "";
  participants: any = [];
  overViewDetails: any = "";
  pressedKey :any = "";
  tagIndex:any = "";
  showParticipants:boolean = false;
  replaceString :any = "";
  errorMessage = "";
  sendDiscMsgLoader: boolean = true;
  discussionMsgLoader: boolean = false;
  discussionMgs: any = [];
  descMobChatBoxVisible: boolean = false;
  userId = this.localStorageService.userDetails._id;

  @Input() isEditable : boolean = false;
  @Input() uscType: any = "";
  @Input() ucsParticipants: any;

  addToDisusbtn: MatProgressButtonOptions = <MatProgressButtonOptions>environment.addToDiscBtnConfig;

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

  filterDiscussionType(type, index) {
    this.removeQuoteMessageDiscus();
    this.discTypeFilter = type
    for (let i = 0; i < this.availabeDiscType.length; i++) {
      this.availabeDiscType[i]["activeClass"] = "";
    }
    this.availabeDiscType[index]["activeClass"] = "active";
    this.getuscDiscussions();
  }

  viewDiscussion() {
    this.showSearchBox = false;
    this.showPublishBtn = false;
    this.showDescSearchBox = false;
    this.getuscDiscussions();
    this.varService.setValue(true);
  }

  sendDiscMessage() {
    if (this.discussionmessageToSend != "" && this.discussionmessageToSend != null && this.selectedDiscussion != "") {

      var receiver_ids :any = [];
      var tagParticipantsArray = this.discussionmessageToSend.match(/@\S+/g);
      if(this.discussionmessageToSend.match(/@\S+/g)){
        if(this.discussionmessageToSend.includes("@all")){
          this.ucsParticipants.forEach(function (value) {
            receiver_ids.push(value._id);
          });
        }else{

          tagParticipantsArray.forEach(value => {
            var searchTag = value.replace('@','');
            this.ucsParticipants.filter(e => {
              var username = e.fullname;
              var selectedValue = username.split(" ");
              selectedValue = selectedValue[0];
              if (searchTag == selectedValue){
                if(receiver_ids.indexOf(e._id) == -1){
                  receiver_ids.push(e._id);
                } 
              }
            });
          })
        }
      }else{
        receiver_ids = [];
      }
      receiver_ids = JSON.stringify(receiver_ids);


      let discussionmessageToSend = this.discussionmessageToSend
      this.sendDiscMsgLoader = true;
      let data = {
        "discussion_id": this.selectedDiscussion._id,
        "ucs_id": this.ucsId,
        "message": discussionmessageToSend,
        "receiver_users_id" : receiver_ids,
        "attachment": [{
          res_id: "", file_name: "", link: ""
        }],
        "reply_id" : this.quoteMessageIdDiscus
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
              if(this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)){
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

  openDesMsgBox(index = 0, discussionId) {
    this.showParticipants = false;
    this.selectedDiscussionId = discussionId;
    this.removeQuoteMessageDiscus();
    if(this.discussionDraftMessageObj.hasOwnProperty(discussionId)){
      this.discussionmessageToSend = this.discussionDraftMessageObj[discussionId]
    }else{
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
            console.log("discussions", discussions);
            this.frontEndService.setDiscussions(discussions, aciveDiscussionId).then((value: any) => {
              this.discussionLoader = false;
              this.discussions = value.discussion;
              let activeDiscussIndex = value.selectedDiscussIndex;
              let SelectedDiscussionMsgsId = this.discussions[activeDiscussIndex]["_id"];
              this.selectedDiscussionId = this.discussions[activeDiscussIndex]["_id"];
              if(this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)){
                this.discussionmessageToSend = this.discussionDraftMessageObj[this.selectedDiscussionId]
              }else{
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

              // this.availabeDiscType[this.availabeDiscType.length - 1]["key"] = this.selectedDescType;
              // this.availabeDiscType[this.availabeDiscType.length - 1]["value"] = disctypeValue;//this.selectedDescType;
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

  viewRedirectContent(viewNotifi) {
    if (this.isRedirectSession(viewNotifi)) {
      this.removeRedirectSession(viewNotifi);
      this.initUcsLoader = false;
    }
  }

  isRedirectSession(viewNotifi) {
    if (localStorage.getItem(viewNotifi)) {
      return true;
    } else {
      return false;
    }
  }

  removeRedirectSession(viewNotifi) {
    if (this.isRedirectSession(viewNotifi)) {
      sessionStorage.removeItem(viewNotifi);
    }
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

  toStr(id) {
    return id.toString().trim();
  }

  descToggleMobChatBox() {
    this.descMobChatBoxVisible = !this.descMobChatBoxVisible;
  }

  scrollToBottom(): void {
    $(".msg_history").animate({ scrollTop: $(".msg_pos").height() }, 1000);
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

  constructor(
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
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.showParticipants = false;
    this.ucsId = localStorage.getItem('ucs_id');
    this.ucs_type = localStorage.getItem('ucs_type');
    this.ucs_user_role = localStorage.getItem('ucs_user_role');
    // -------Get Value From Local storege--------
    if(localStorage.getItem("discussion_drafts") == null ){
      this.discussionDraftMessageObj = {};
    }else{
      this.discussionDraftMessageObj = JSON.parse(localStorage.getItem("discussion_drafts"));
    }
    if (this.ucsId) {
      this.initAvailabelTypes();
      this.getuscDiscussions();
      this.viewDiscussion();
    } else {
      this.ucsId = "";
      this.redirectUser();
    }
  }

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

  RedirectDashboard() {
    this.routerService.redirectToCorpApplication();
  }
  redirectToStartupDashboard() {
    this.routerService.RedirectToStartupDashboard();
  }
  redirectToCorpDashboard() {
    this.routerService.RedirectToCorpDashboard();
  }

  // ------Function is used for filter the participants list using keywords ---------
  filterParticipants(searchString){
    this.participants = this.ucsParticipants.filter(function (e) {
      var username = e.fullname.toLowerCase();
      searchString = searchString.toLowerCase();
      if (username.indexOf(searchString) !=-1){
        return true;
      }else{
        return false;
      }
    });
  }

  // ------Function is used for handle the keypress event ---------
  checkInputForDiscussion(event){
    this.pressedKey = event.key;
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.discussionmessageToSend.lastIndexOf('@', cursorPosition);
    this.tagIndex = cursorPosition;
    const str1 = this.discussionmessageToSend.substring(atPosition);
    const str2 = str1.substring(str1.lastIndexOf('@')).split(' ')[0];
    if(event.key === "@"){
      this.participants = this.ucsParticipants;
      this.showParticipants = true;
    }else if(event.key === " "){
      this.showParticipants = false;
    }else{
      if(str1.indexOf('@') >= 0){
          var searchString = str2+event.key
          searchString = searchString.replace(/\s/g,'');
          searchString = searchString.replace('@','');
          this.filterParticipants(searchString);
      }else{
        this.showParticipants = false;
      }
    }
  }

  // ------Function is used for handle selected Tag from suggestions ---------
  selectedMenuForDiscussion(selectedValue, id){
    var selectedValue = selectedValue.split(" ");
    selectedValue = selectedValue[0];
    this.showParticipants = false;
    this.replaceString = this.replaceString.replace(/\s/g,'');
    if(this.pressedKey === "@"){
      let indexPosition = this.tagIndex + 1; 
      this.discussionmessageToSend = this.discussionmessageToSend.slice(0, indexPosition) 
              + selectedValue+' '
              + this.discussionmessageToSend.slice(indexPosition);
      setTimeout(() => this.discussionmessage.nativeElement.focus(), 500);    
    }else{
      this.discussionmessageToSend = this.discussionmessageToSend.replace(this.replaceString, "@"+selectedValue+' ');
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
      const string  = this.discussionmessageToSend.substring(atPosition + 1, spacePosition);
      var afterbang = this.discussionmessageToSend.substring(atPosition, this.discussionmessageToSend.indexOf(' ', atPosition));
      if (/\s/.test(strFound2) || strFound2 == "@" || string == "") {
        // console.log("whitespace", strFound2)
        this.showParticipants = false;
      }else{
        this.participants = this.ucsParticipants;
        if(this.discussionmessageToSend.lastIndexOf('@') == atPosition){
          var removeStringIndex = cursorPosition - (atPosition+1);          
          const str1 = this.discussionmessageToSend.substring(atPosition-1);
          const str2 = str1.substring(str1.lastIndexOf('@')).split(' ')[0];
          var validstring = str2.substr(0, removeStringIndex) + "" + str2.substr(removeStringIndex +1);
          this.replaceString = validstring;
          var searchTag = this.replaceString.replace(/\s/g,'');
          searchTag = searchTag.replace('@','');
          this.filterParticipants(searchTag);
        }else{
          var removeCharIndex = strFound2.length - 1;
          var part1 = afterbang.substring(0, removeCharIndex);
          var part2 = afterbang.substring(removeCharIndex + 1, afterbang.length);
          this.replaceString = part1 + part2;

          var searchTag = this.replaceString.replace(/\s/g,'');
          searchTag = searchTag.replace('@','');
          this.filterParticipants(searchTag);
        }
        this.showParticipants = true;
      }
    }else{
      const strFound = this.discussionmessageToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound1 = this.discussionmessageToSend.substring(atPosition, cursorPosition + 1);
      var afterbang = this.discussionmessageToSend.substring(atPosition, this.discussionmessageToSend.indexOf(' ', atPosition));
      this.replaceString = strFound1+event.key;
    }
  }

  //-----------------Function form Team Discussion -------------------
  getDiscussionDraftMessage(){
    if(this.discussionmessageToSend == ""){
      if(this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)){
        var DeletedId = this.selectedDiscussionId;
        delete this.discussionDraftMessageObj[DeletedId];
        localStorage.setItem("discussion_drafts", JSON.stringify(this.discussionDraftMessageObj));
      }
    }else{
      if(this.discussionDraftMessageObj.hasOwnProperty(this.selectedDiscussionId)){
        this.discussionDraftMessageObj[this.selectedDiscussionId] = this.discussionmessageToSend;
      }else{
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

  removeQuoteMessageDiscus(){
    this.quoteMessageDiscus = "";
    this.quoteMessageIdDiscus = "";
    this.quoteMessageSenderDiscus = "";
    this.quoteMessageDateDiscus = "";
    this.showReplyBoxDiscus = false;
  }
  
  removeQuoteMessageApi(type, recordId){
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
        },
        (error: any) => {
          this.sendMessageLoader = false;
        }
      );
  }

  availabeDiscTypeUpdate(sharedata){
    this.availabeDiscType[this.availabeDiscType.length - 1]["key"] = sharedata[0];
    this.availabeDiscType[this.availabeDiscType.length - 1]["value"] = sharedata[1];
  }

  getsharedUserList(sharedUsers){
    this.showParticipants = false;
  }
}