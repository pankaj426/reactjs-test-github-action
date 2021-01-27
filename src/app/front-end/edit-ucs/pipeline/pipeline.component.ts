import { AttachmentsComponent } from '../attachments/attachments.component';
import { SharedVarService } from '../../../shared/services/shared-var.service';
import { Component, Input, OnInit, Output, ViewChild, ElementRef, EventEmitter, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { userRoles, UsecaseSolutoinTypes, discussionType, redirectSessions } from "../../../shared/constants/enum";
import { FrontEndService } from "../../services/front-end.service";
import { ToastrService } from "ngx-toastr";
import { DateFormatService } from "../../../shared/services/date-format.service";
import { MatDialog } from '@angular/material/dialog';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { environment } from "../../../../environments/environment";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
declare var $: any;

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.sass']
})
export class PipelineComponent implements OnInit {

  @Input() ucsLength: number;
  @Output() publicStatusUpdate: EventEmitter<any> = new EventEmitter<any>();
  modalRef: BsModalRef;
  @Input() isEditable:any;
  @Input() uscType:any;
  @Input() ucsParticipants: any;
  userId = this.localStorageService.userDetails._id;
  ucsId: any = "";
  defaultmessage : any = "Hi, I've shared some resources. Please have a look."
  ucs_type: any = "";
  ucs_user_role: any = "";
  pipelineDraftMessageObj :any = {};
  showSearchBox: boolean = false;
  showDescSearchBox: boolean = false;
  showPublishBtn: boolean = false;

  quoteMessage :any = "";
  quoteMessageId :any = "";
  quoteMessageSender :any = "";
  quoteMessageDate :any = "";
  showReplyBox:boolean = false;

  pipleinesLoader: boolean = false;
  piplines: any = [];

  messageToSend = "";
  pipelineParticipants: any = [];
  selectedPiplineId: any;

  viewNotifiSession = redirectSessions.viewNotifiSession;
  errorMessage = "";

  initUcsLoader: boolean = false
  pipelinMsgLoader: boolean = false;
  pipeLineMgs: any = [];

  selectedPipeline: any = "";
  pipeLineMsgMobChatBoxOpen: boolean = false;
  sendMessageLoader: boolean = false;

  showParticipants:boolean = false;
  pressedKey :any = "";
  @ViewChild('pipelineMessage') pipelineMessage: ElementRef;
  taggedUsers = [];
  participants: any = [];
  replaceString :any = "";
  tagIndex:any = ""
  overViewDetails1: any = "";
  selectedAttachments = []

  overViewDetails: any = "";
  userRoles: any = userRoles;

  piplineSearchText = "";
  addToDisusbtn: MatProgressButtonOptions = <MatProgressButtonOptions>environment.addToDiscBtnConfig;
  discussionType: any = discussionType
  selectedDescType: any = "";
  @Output() availabeDiscTypeUpdate: EventEmitter<any> = new EventEmitter<any>();
  pipelineInnerParticipants: any = [];
  sharedTeam:any = [];
  donwnloadPath = environment.services.files.downloadAttachments;
  constructor(
    private localStorageService: LocalStorageService,
    private frontEndService: FrontEndService,
    private varService: SharedVarService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    public dateFormatService: DateFormatService,

  ) { }

  ngOnInit(): void {
    this.showParticipants = false;
    this.ucsId = localStorage.getItem('ucs_id');
    this.ucs_type = localStorage.getItem('ucs_type');
    this.ucs_user_role = localStorage.getItem('ucs_user_role');


    // -------Get Value From Local storege--------
    if(localStorage.getItem("pipeline_drafts") == null ){
      this.pipelineDraftMessageObj = {};
    }else{
      this.pipelineDraftMessageObj = JSON.parse(localStorage.getItem("pipeline_drafts"));
    }


    if (this.ucsId) {
      this.viewPipline();
      //this.openTab(3);
    } else {
      this.ucsId = "";
    }
  }

  checkNotification(vlaue) {
    return parseInt(vlaue);
  }

  viewPipline() {
    this.showSearchBox = false;
    this.showPublishBtn = false;
    this.showDescSearchBox = false;
    this.getuscPipelines()
    this.varService.setValue(true);
  }


  getuscPipelines(acivePiplineId = "") {
    this.removeQuoteMessage();
    this.messageToSend = "";
    this.pipleinesLoader = true;
    this.piplines = [];
    let ucsId = this.ucsId;
    this.frontEndService
      .getPipelines(ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {
            let piplines = result.body;
            this.frontEndService.setPiplines(piplines, acivePiplineId).then((value: any) => {
              this.pipleinesLoader = false;
              this.piplines = value.pipeLines;
              this.pipelineParticipants = this.piplines[0].sharedUsers;
              this.pipelineInnerParticipants = this.piplines[0].sharedUsers;
              this.pipelineParticipants = this.pipelineParticipants.concat(this.ucsParticipants);
              this.sharedTeam = this.ucsParticipants;
              let activePiplineIndex = value.SelectedPiplineIndex;
              let SelectedPipLineMsgsId = this.piplines[activePiplineIndex]["_id"];
              this.selectedPiplineId = this.piplines[activePiplineIndex]["_id"];
              
              if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
                this.messageToSend = this.pipelineDraftMessageObj[this.selectedPiplineId]
              }else{
                this.messageToSend = "";
              }              
                
              
              this.getPipeLineMessages(activePiplineIndex, SelectedPipLineMsgsId,'notification_'+this.selectedPiplineId);
            }, (error) => {
              this.piplines = piplines;
            });
          } else {
            this.piplines = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.pipleinesLoader = false;
          this.viewRedirectContent(this.viewNotifiSession);
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.piplines = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.piplines = [];
          }
        }
      );
  }

  removeQuoteMessage(){
    this.quoteMessage = "";
    this.quoteMessageId = "";
    this.quoteMessageSender = "";
    this.quoteMessageDate = "";
    this.showReplyBox = false;
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

  getPipeLineMessages(index = 0, pipeLineId, notificationId) {
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
            setTimeout (() => {
              if(document.getElementById(notificationId)){
                let targetElement = document.getElementById(notificationId);
                targetElement.style.display = 'none';
              }
            }, 3000);
            this.pipelinMsgLoader = false;
            if (result.message == "success") {
              this.pipeLineMgs = result.body;
              //console.log(this.pipeLineMgs)
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
  
  scrollToBottom(): void {
    $(".msg_history").animate({ scrollTop: $(".msg_pos").height() }, 1000);
  }

  isRedirectSession(viewNotifi) {
    if (localStorage.getItem(viewNotifi)) {
      return true;
    } else {
      return false;
    }
  }


  togglePipeMsgsMobChatBox() {
    this.pipeLineMsgMobChatBoxOpen = !this.pipeLineMsgMobChatBoxOpen;
  }

  openPipLineMsgBox(index = 0, pipeLineId, pipelineParticipants, notification_id) {
    
    this.showParticipants = false;
    if(document.getElementById(notification_id)){
      let targetElement = document.getElementById(notification_id);
      targetElement.style.display = 'none';
    }

    this.pipelineParticipants = pipelineParticipants.concat(this.sharedTeam);
    this.selectedPiplineId = pipeLineId;
    this.removeQuoteMessage();
    if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
      this.messageToSend = this.pipelineDraftMessageObj[this.selectedPiplineId]
    }else{
      this.messageToSend = "";
    }
    this.pipeLineMsgMobChatBoxOpen = true;
    this.getPipeLineMessages(index = 0, pipeLineId, notification_id);
  }




   // -------------Reply functionality for pipeline--------------------
   pipelineReply(event: MouseEvent, messageId, message, sendername, messsageDate) {
    this.quoteMessage = message;
    this.quoteMessageId = messageId;
    this.quoteMessageSender = sendername;
    this.quoteMessageDate = messsageDate;
    this.showReplyBox = true;
  }




  //------------------Function for My pipeline --------------------
  getPipelineDraftMessage() {
    if(this.messageToSend == ""){
      if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
        var DeletedId = this.selectedPiplineId;
        delete this.pipelineDraftMessageObj[DeletedId];
        localStorage.setItem("pipeline_drafts", JSON.stringify(this.pipelineDraftMessageObj));
      }
    }else{
      if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
        this.pipelineDraftMessageObj[this.selectedPiplineId] = this.messageToSend;
      }else{
        var id = this.selectedPiplineId;
        this.pipelineDraftMessageObj[id] = this.messageToSend;
      }
      localStorage.setItem("pipeline_drafts", JSON.stringify(this.pipelineDraftMessageObj));
    }
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


   // ------Function is used for handle the keypress event ---------
   checkInputForPipeline(event){
    this.pressedKey = event.key;
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.messageToSend.lastIndexOf('@', cursorPosition);
    this.tagIndex = cursorPosition;

    const str1 = this.messageToSend.substring(atPosition);
    const str2 = str1.substring(str1.lastIndexOf('@')).split(' ')[0];

    if(event.key === "@"){
      this.participants = this.pipelineParticipants;
      this.showParticipants = true;
      
    }else if(event.key === " "){
      this.showParticipants = false;
    }else{
      if(str1.indexOf('@') >= 0){
          var searchString = str2+event.key
          searchString = searchString.replace(/\s/g,'');
          searchString = searchString.replace('@','');
          this.filterPipelineParticipants(searchString);

      }else{
        this.showParticipants = false;
      }
    }
  }

  // ------Function is used for handle selected Tag from suggestions ---------
  selectedMenuForPipeline(selectedValue, id){
    var selectedValue = selectedValue.split(" ");
    selectedValue = selectedValue[0];
    this.showParticipants = false;
    this.replaceString = this.replaceString.replace(/\s/g,'');
    if(this.pressedKey === "@"){
      let indexPosition = this.tagIndex + 1; 
      this.messageToSend = this.messageToSend.slice(0, indexPosition) 
              + selectedValue + ' '
              + this.messageToSend.slice(indexPosition);
      setTimeout(() => this.pipelineMessage.nativeElement.focus(), 500);
    }else{
      this.messageToSend = this.messageToSend.replace(this.replaceString, "@"+selectedValue+' ');
      setTimeout(() => this.pipelineMessage.nativeElement.focus(), 500);
    }
    this.pressedKey = "";
  }

  // ------Function is used for handle keydown event ---------
  keyDownHandlerForPipeline(event) {
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.messageToSend.lastIndexOf('@', cursorPosition);
    if (event.code === 'Backspace') {
      
      const strFound = this.messageToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound2 = this.messageToSend.substring(atPosition, cursorPosition);
      const spacePosition = this.messageToSend.lastIndexOf(' ', cursorPosition);
      const string  = this.messageToSend.substring(atPosition + 1, spacePosition);

      var afterbang = this.messageToSend.substring(atPosition, this.messageToSend.indexOf(' ', atPosition));

      if (/\s/.test(strFound2) || strFound2 == "@" || string == "") {
        // console.log("whitespace", strFound2)
        this.showParticipants = false;
      }else{
        this.participants = this.pipelineParticipants;
        if(this.messageToSend.lastIndexOf('@') == atPosition){
          var removeStringIndex = cursorPosition - (atPosition+1);          
          const str1 = this.messageToSend.substring(atPosition-1);
          const str2 = str1.substring(str1.lastIndexOf('@')).split(' ')[0];
          var validstring = str2.substr(0, removeStringIndex) + "" + str2.substr(removeStringIndex +1);
          this.replaceString = validstring;

          var searchTag = this.replaceString.replace(/\s/g,'');
          searchTag = searchTag.replace('@','');
          this.filterPipelineParticipants(searchTag);


        }else{
          var removeCharIndex = strFound2.length - 1;
          var part1 = afterbang.substring(0, removeCharIndex);
          var part2 = afterbang.substring(removeCharIndex + 1, afterbang.length);
          this.replaceString = part1 + part2;

          var searchTag = this.replaceString.replace(/\s/g,'');
          searchTag = searchTag.replace('@','');
          this.filterPipelineParticipants(searchTag);

        }
        this.showParticipants = true;
      }
    }else{
      const strFound = this.messageToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound1 = this.messageToSend.substring(atPosition, cursorPosition + 1);
      var afterbang = this.messageToSend.substring(atPosition, this.messageToSend.indexOf(' ', atPosition));
      this.replaceString = strFound1+event.key;
    }


  }

  filterPipelineParticipants(searchString){
    this.participants = this.pipelineParticipants.filter(function (e) {
      var username = e.fullname.toLowerCase();
      searchString = searchString.toLowerCase();
      if (username.indexOf(searchString) !=-1){
        return true;
      }else{
        return false;
      }

    });
  }

 
  openAttechmentPopup() {
    if(!this.isEditable){
      return false;
    }
    let DialogConfig = {
      data: {
        ucsId: this.ucsId,
        selectedAttachments: this.selectedAttachments,
        
      },
      width: '550px',
      panelClass: 'cust-share-modal'
    };

    const dialogRef = this.dialog.open(AttachmentsComponent, DialogConfig);
    let that = this;
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data.length > 0) {
          this.removeQuoteMessage();
          that.selectedAttachments = data;
          this.messageToSend = this.defaultmessage
          
        }
      });
  }

  toStr(id) {
    return id.toString().trim();
  }

  sendMessage() {
    if (this.messageToSend != "" && this.messageToSend != null && this.selectedPipeline != "") {
      var receiver_ids :any = [];
      var tagParticipantsArray = this.messageToSend.match(/@\S+/g);
      if(this.messageToSend.match(/@\S+/g)){
        if(this.messageToSend.includes("@all")){
          this.pipelineParticipants.forEach(function (value) {
            receiver_ids.push(value._id);
          });
        }else{

          tagParticipantsArray.forEach(value => {
            var searchTag = value.replace('@','');
            this.pipelineParticipants.filter(e => {
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


      let messageToSend = this.messageToSend;
      this.sendMessageLoader = true;
      this.sendMessageLoader = true;
      let receiver_ucs_id = "";
      let sender_ucs_id = "";//this.ucsId;
      if (this.toStr(this.selectedPipeline.org_id) != this.toStr(this.localStorageService.userDetails.organization_id)) {
        receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
        sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
      } else {
        receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
        sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
      }
      let data = {
        "pipeline_id": this.selectedPipeline._id,
        "receiver_ucs_id": receiver_ucs_id,
        "sender_ucs_id": sender_ucs_id,
        "message": messageToSend,
        "receiver_users_id": receiver_ids,
        "status": "unread",
        "attachments": this.selectedAttachments,
        "reply_id" : this.quoteMessageId
      }
      // this.messageToSend = "";
      this.frontEndService
        .sendMessage(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.sendMessageLoader = false;
            if (result.statusCode == 200) {
              /*   this.toaster.success("Message sent successfully", "", {
                  timeOut: 2000,
                }) */
              this.removeQuoteMessage();
              this.removeQuoteMessageApi('pipeline_drafts', this.selectedPiplineId);
              if(this.pipelineDraftMessageObj.hasOwnProperty(this.selectedPiplineId)){
                var DeletedId = this.selectedPiplineId;
                delete this.pipelineDraftMessageObj[DeletedId];
                localStorage.setItem("pipeline_drafts", JSON.stringify(this.pipelineDraftMessageObj));
              }
              this.pipeLineMgs.push(result.body);
              //console.log(this.pipeLineMgs)
              this.messageToSend = "";
              this.selectedAttachments = [];
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
            this.sendMessageLoader = false;
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
    } else {
      if (this.selectedAttachments.length > 0) {
     //   this.messageToSend = "Hi, I've shared some resources. Please have a look."
       //  this.messageToSend = "";
      // let receiver_ucs_id :any = [];
        this.sendMessageLoader = true;
        this.sendMessageLoader = true;
        let receiver_ucs_id = "";
        let sender_ucs_id = "";//this.ucsId;
        ///receiver_ucs_id = JSON.stringify(receiver_ucs_id);
        if (this.toStr(this.selectedPipeline.org_id) != this.toStr(this.localStorageService.userDetails.organization_id)) {
          receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
          sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
        } else {
          receiver_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_2;
          sender_ucs_id = this.selectedPipeline.use_case_solution_ids.ucs_id_1;
        }
        let data = {
          "pipeline_id": this.selectedPipeline._id,
          "receiver_ucs_id": receiver_ucs_id,
          "sender_ucs_id": sender_ucs_id,
          "message": this.messageToSend,
          "status": "unread",
          "attachments": this.selectedAttachments

        }
        this.frontEndService
          .sendMessage(data)
          .pipe()
          .subscribe(
            (result: any) => {
              this.sendMessageLoader = false;
              if (result.statusCode == 200) {
                /*   this.toaster.success("Message sent successfully", "", {
                    timeOut: 2000,
                  }) */
                  
                this.pipeLineMgs.push(result.body);
               // console.log(this.pipeLineMgs)
                this.messageToSend = "";
                this.selectedAttachments = [];
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
              this.sendMessageLoader = false;
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
      else  {
        this.errorMessage =
        "Something went wrong. Please try after sometime.";
        this.toaster.error(this.errorMessage, "", {
          timeOut: 2000,
        });
      }
    }
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
    
    var shareData = [this.selectedDescType, addDescTypeValues]

    this.availabeDiscTypeUpdate.emit(shareData);

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

  getsharedUserList(getsharedUserList) {
    this.sharedTeam = [];
    this.sharedTeam = getsharedUserList;
    this.showParticipants = false;
    this.pipelineParticipants = this.pipelineInnerParticipants.concat(getsharedUserList);
  }
  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/resource/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  removeAttachment(index) {
    this.selectedAttachments.splice(index, 1);
    if(this.selectedAttachments.length==0){
    this.messageToSend = "";
  }}
  
}
