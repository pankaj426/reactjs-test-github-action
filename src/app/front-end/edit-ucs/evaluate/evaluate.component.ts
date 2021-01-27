import { SharedVarService } from '../../../shared/services/shared-var.service';
import { Component, Input, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { FrontEndService } from "../../services/front-end.service";
import { ToastrService } from "ngx-toastr";
import { DateFormatService } from "../../../shared/services/date-format.service";
declare var $: any;

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.sass']
})
export class EvaluateComponent implements OnInit {

  evalLoader: boolean = false;
  ucsId: any = "";
  selectedEvaluateId: any;
  EvaluateDraftMessageObj: any = {};
  errorMessage = "";
  showSearchBox: boolean = false;
  showDescSearchBox: boolean = false;
  showPublishBtn: boolean = false;
  overViewDetails: any = [];
  sendEvalMsgLoader: boolean = false;
  userId = this.localStorageService.userDetails._id;
  participants: any = [];
  pressedKey: any = "";
  tagIndex: any = ""
  selectedAttachments = []
  showParticipants: boolean = false;
  replaceString: any = "";
  sendMessageLoader: boolean = false;
  quoteMessageEval: any = "";
  quoteMessageIdEval: any = "";
  quoteMessageSenderEval: any = "";
  quoteMessageDateEval: any = "";
  showReplyBoxEval: boolean = false;
  ucs_type: any = "";
  ucs_user_role: any = "";
  @ViewChild('sendMsg') sendMsg: ElementRef;
  @Input() isSampleEditable: any;
  @Input() ucsParticipants: any;
  evalMsgToSend: any = "";
  evaluations: any = [];
  evalMsgMobChatBoxOpen: boolean = false;
  evalMsgLoader: boolean = false;
  evalMgs: any = [];
  selectedEval: any = ""

  constructor(
    private frontEndService: FrontEndService,
    private varService: SharedVarService,
    private toaster: ToastrService,
    private localStorageService: LocalStorageService,
    public dateFormatService: DateFormatService,
  ) { }



  ngOnInit(): void {
    this.showParticipants = false;
    this.ucsId = localStorage.getItem('ucs_id');
    this.ucs_type = localStorage.getItem('ucs_type');
    this.ucs_user_role = localStorage.getItem('ucs_user_role');

    this.overViewDetails.sharedUsers = this.ucsParticipants;
    console.log("this.overViewDetails.sharedUsers", this.overViewDetails.sharedUsers);

    // -------Get Value From Local storege--------
    if (localStorage.getItem("evaluate_drafts") == null) {
      this.EvaluateDraftMessageObj = {};
    } else {
      this.EvaluateDraftMessageObj = JSON.parse(localStorage.getItem("evaluate_drafts"));
    }

    if (this.ucsId) {
      this.getEvaluations();
    } else {
      this.ucsId = "";
    }
  }

  toStr(id) {
    return id.toString().trim();
  }

  // --------------Get Evaluation list and message for initial state------------
  getEvaluations(evaluationId = "") {
    this.removeQuoteMessageEval();
    this.evalMsgToSend = "";
    this.evalLoader = true;
    this.evaluations = [];
    let ucsId = this.ucsId;

    this.frontEndService
      .getEvaluations(ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {
            let evaluations = result.body;
            console.log("evaluations", evaluationId);
            this.frontEndService.setevaluations(evaluations, evaluationId).then((value: any) => {
              console.log("value", value);

              this.evalLoader = false;
              this.evaluations = value.evaluations;
              let activeEvalIndex = value.selectedEvalIndex;
              let SelectedEvalMsgsId = this.evaluations[activeEvalIndex]["_id"];

              this.selectedEvaluateId = this.evaluations[activeEvalIndex]["_id"];
              if (this.EvaluateDraftMessageObj.hasOwnProperty(this.selectedEvaluateId)) {
                this.evalMsgToSend = this.EvaluateDraftMessageObj[this.selectedEvaluateId]
              } else {
                this.evalMsgToSend = "";
              }
              this.getevaluationsMessages(activeEvalIndex, SelectedEvalMsgsId);
            }, (error) => {
              this.evaluations = evaluations;
            });
          } else {
            this.evaluations = [];
            this.errorMessage = result.message;
          }
        },
        (error: any) => {
          this.evalLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.evaluations = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.evaluations = [];
          }
        }
      );
  }

  // ---------Add class on active evaluation---------------
  makeActiveEvalClass(_id) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (_id) {
        for (let i = 0; i < that.evaluations.length; i++) {
          that.evaluations[i]["activeClass"] = ""
          if (that.evaluations[i]._id == _id) {
            this.selectedEval = that.evaluations[i];
            that.evaluations[i]["activeClass"] = "active_chat"
          }
        }
        resolve(that.evaluations);
      } else {
        reject(0);
      }
    })
  }


  //Eval functionlity
  viewEvaluations() {
    this.showSearchBox = false;
    this.showPublishBtn = false;
    this.showDescSearchBox = false;
    this.getEvaluations()
    this.varService.setValue(true);
  }
  
  toggleEvalMsgsMobChatBox() {
    this.evalMsgMobChatBoxOpen = !this.evalMsgMobChatBoxOpen;
  }

  // ------Function is used for open particular evaluation message ---------
  openEvalMsgBox(index = 0, evaluationsId) {
    this.removeQuoteMessageEval();
    this.showParticipants = false;
    this.selectedEvaluateId = evaluationsId;
    if (this.EvaluateDraftMessageObj.hasOwnProperty(this.selectedEvaluateId)) {
      this.evalMsgToSend = this.EvaluateDraftMessageObj[this.selectedEvaluateId]
    } else {
      this.evalMsgToSend = "";
    }
    this.evalMsgMobChatBoxOpen = true;
    this.getevaluationsMessages(index = 0, evaluationsId);
  }

  // ------Function is used for send Evaluation message ---------
  sendEvalMessage() {

    if (this.evalMsgToSend != "" && this.evalMsgToSend != null && this.selectedEval != "") {
      var receiver_ids: any = [];
      var tagParticipantsArray = this.evalMsgToSend.match(/@\S+/g);
      if (this.evalMsgToSend.match(/@\S+/g)) {
        if (this.evalMsgToSend.includes("@all")) {
          this.overViewDetails.sharedUsers.forEach(function (value) {
            receiver_ids.push(value._id);
          });
        } else {

          tagParticipantsArray.forEach(value => {
            var searchTag = value.replace('@', '');
            this.overViewDetails.sharedUsers.filter(e => {
              var username = e.fullname;
              var selectedValue = username.split(" ");
              selectedValue = selectedValue[0];
              if (searchTag == selectedValue){
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

      this.sendEvalMsgLoader = true;
      let evalMsgToSend = this.evalMsgToSend;
      let receiver_ucs_id = this.selectedEval.ucs_id;
      let sender_userId = this.userId;//this.ucsId;
      let data = {
        "evaluate_id": this.selectedEval._id,
        "receiver_id": "",
        "receiver_users_id": receiver_ids,
        "sender_id": sender_userId,
        "message": evalMsgToSend,
        "reply_id": this.quoteMessageIdEval
      }
      this.evalMsgToSend = "";
      this.frontEndService
        .sendEvalMessage(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.sendEvalMsgLoader = false;
            if (result.statusCode == 200) {
              /*   this.toaster.success("Message sent successfully", "", {
                  timeOut: 2000,
                }) */
              this.removeQuoteMessageEval();
              this.removeQuoteMessageApi('evaluate_drafts', this.selectedEvaluateId);
              if (this.EvaluateDraftMessageObj.hasOwnProperty(this.selectedEvaluateId)) {
                var DeletedId = this.selectedEvaluateId;
                delete this.EvaluateDraftMessageObj[DeletedId];
                localStorage.setItem("evaluate_drafts", JSON.stringify(this.EvaluateDraftMessageObj));
              }

              this.evalMgs.push(result.body);
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
            this.sendEvalMsgLoader = false;
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

  // ------Function is used for scroll in message listing ---------
  scrollToBottom(): void {
    $(".msg_history").animate({ scrollTop: $(".msg_pos").height() }, 1000);
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


  // ------Function is used for handle the keypress event ---------
  checkInput(event) {
    this.pressedKey = event.key;
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.evalMsgToSend.lastIndexOf('@', cursorPosition);
    this.tagIndex = cursorPosition;

    const str1 = this.evalMsgToSend.substring(atPosition);
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
  selectedMenu(selectedValue, id) {
    var selectedValue = selectedValue.split(" ");
    selectedValue = selectedValue[0];
    this.showParticipants = false;
    this.replaceString = this.replaceString.replace(/\s/g, '');
    if (this.pressedKey === "@") {
      let indexPosition = this.tagIndex + 1;
      this.evalMsgToSend = this.evalMsgToSend.slice(0, indexPosition)
        + selectedValue + ' '
        + this.evalMsgToSend.slice(indexPosition);

      setTimeout(() => this.sendMsg.nativeElement.focus(), 500);
    } else {
      this.evalMsgToSend = this.evalMsgToSend.replace(this.replaceString, "@" + selectedValue + ' ');
      setTimeout(() => this.sendMsg.nativeElement.focus(), 500);
    }
    this.pressedKey = "";
  }

  // ------Function is used for handle keydown event ---------
  keyDownHandler(event) {
    const cursorPosition = event.target.selectionStart;
    const atPosition = this.evalMsgToSend.lastIndexOf('@', cursorPosition);
    if (event.code === 'Backspace') {

      const strFound = this.evalMsgToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound2 = this.evalMsgToSend.substring(atPosition, cursorPosition);
      const spacePosition = this.evalMsgToSend.lastIndexOf(' ', cursorPosition);
      const string = this.evalMsgToSend.substring(atPosition + 1, spacePosition);

      var afterbang = this.evalMsgToSend.substring(atPosition, this.evalMsgToSend.indexOf(' ', atPosition));

      if (/\s/.test(strFound2) || strFound2 == "@" || string == "") {
        // console.log("whitespace", strFound2)
        this.showParticipants = false;
      } else {
        this.participants = this.overViewDetails.sharedUsers;
        if (this.evalMsgToSend.lastIndexOf('@') == atPosition) {
          var removeStringIndex = cursorPosition - (atPosition + 1);
          const str1 = this.evalMsgToSend.substring(atPosition - 1);
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
      const strFound = this.evalMsgToSend.substring(atPosition + 1, cursorPosition + 1);
      const strFound1 = this.evalMsgToSend.substring(atPosition, cursorPosition + 1);
      var afterbang = this.evalMsgToSend.substring(atPosition, this.evalMsgToSend.indexOf(' ', atPosition));
      this.replaceString = strFound1 + event.key;
    }
  }
  // ------------------

  //------------------Function for Evalute and get input string through keyup--------------------
  getEvalMsgToSend() {

    if (this.evalMsgToSend == "") {
      if (this.EvaluateDraftMessageObj.hasOwnProperty(this.selectedEvaluateId)) {
        var DeletedId = this.selectedEvaluateId;
        delete this.EvaluateDraftMessageObj[DeletedId];
        localStorage.setItem("evaluate_drafts", JSON.stringify(this.EvaluateDraftMessageObj));
      }
    } else {
      if (this.EvaluateDraftMessageObj.hasOwnProperty(this.selectedEvaluateId)) {
        this.EvaluateDraftMessageObj[this.selectedEvaluateId] = this.evalMsgToSend;
      } else {
        var id = this.selectedEvaluateId;
        this.EvaluateDraftMessageObj[id] = this.evalMsgToSend;
      }
      localStorage.setItem("evaluate_drafts", JSON.stringify(this.EvaluateDraftMessageObj));
    }

  }


  // -------------Reply functionality for Evaluate--------------------
  EvaluateReply(event: MouseEvent, messageId, message, sendername, messsageDate) {
    this.quoteMessageEval = message;
    this.quoteMessageIdEval = messageId;
    this.quoteMessageSenderEval = sendername;
    this.quoteMessageDateEval = messsageDate;
    this.showReplyBoxEval = true;
  }

  removeQuoteMessageEval() {
    this.quoteMessageEval = "";
    this.quoteMessageIdEval = "";
    this.quoteMessageSenderEval = "";
    this.quoteMessageDateEval = "";
    this.showReplyBoxEval = false;
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
        },
        (error: any) => {
          this.sendMessageLoader = false;
        }
      );
  }

  // --------Get evalution messages for a evaluation-----------
  getevaluationsMessages(index = 0, evalId) {
    this.makeActiveEvalClass(evalId).then(res => {
      this.evalMsgLoader = true;
      this.evalMgs = [];
      let data = {
        "evaluate_id": evalId,
        "sender_id": "",
      }
      this.frontEndService
        .getevaluationsMessages(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.evalMsgLoader = false;
            if (result.message == "success") {
              console.log()
              this.evalMgs = result.body;
              setTimeout(() => {
                this.scrollToBottom();
              }, 1);
            } else {
              this.evalMgs = [];
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            this.evalMsgLoader = false;
            this.evalMgs = [];
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

  // --------Function is used for get sharedUser at runt time-----------
  getsharedUserList(sharedUsers) {
    this.showParticipants = false;
    this.overViewDetails.sharedUsers = sharedUsers;
    this.participants = sharedUsers;
  }
}
