import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { FrontEndService } from '../../services/front-end.service';
import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { discussionType, userRoles } from "../../../shared/constants/enum";
import { environment } from "../../../../environments/environment";
import { env } from 'process';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { UserAddRemoveEmitterService} from './../user-add-remove.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-list-popup',
  templateUrl: './user-list-popup.component.html',
  styleUrls: ['./user-list-popup.component.scss']
})

export class UserListPopupComponent implements OnInit {
  lang: any = ["html"];
  public sendInviteFrm: FormGroup;
  public inviteLoader: boolean = false;
  ucsId: any = "";
  role: any = "";
  genricError: boolean = false;
  selectAll: boolean = false;
  usersList: any = [];
  userListLoader: boolean = false;
  created_by: any = "";
  overViewLoader = false;
  overViewDetails = "";
  shareUrl = "";
  sharePath = "";
  isGuest=false;
  fullName;
  index;
  parentIndex;
  isEditable:boolean = true;
  onParticipantRemove = new EventEmitter();

  constructor(private fb: FormBuilder,
    private userAddRemoveEmitterService : UserAddRemoveEmitterService,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UserListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private frontEndService: FrontEndService,
    private _clipboardService: ClipboardService,
    private authenticationService: AuthenticationService,
    public toaster: ToastrService) {
    
    this.ucsId = data.ucsId;
    this.role = data.role;
    this.created_by = data.created_by
    this.fullName = data.name;
    this.sharePath = environment.services.siteUrl
    this.index = data.index;
    this.parentIndex = data.parentIndex;
    this.isEditable = data.isSampleEditable;

  }
  public ngOnInit(): void {

  if(this.role == userRoles.corporateGuestUser  || this.role == userRoles.startupGuestUser){
    this.isGuest = true;
  }
    this.initInviteFrm();
  
    this.getUcsDetail();
  }


  copy(text: string) {
    if (this._clipboardService.copyFromContent(text)) {
      this.toaster.success("Code copied", "Success!", {
        timeOut: 3000,
      });
    }
  }

  getUcsDetail() {
    this.overViewLoader = true;
    this.usersList = "";
    let errorMessage = "";
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.message == "success") {
            this.userListLoader = false;
            this.usersList = result.body[0];
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
  }

  deleteUser(_id,email,firstname,userIndex){


    Swal.fire({
      title: '',
      text: "Are you sure you want to remove this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#46448B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        let data = {
          ucs_id: this.usersList._id,
          shared_user_id: _id ,
          firstname: firstname,
          usecasename:this.usersList.title,
          email:email,
          type:this.usersList.type
        }
        this.frontEndService
        .deleteSharedUsers(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.overViewLoader = false;
            this.onParticipantRemove.emit();
            if (result.statusCode == "200") {
              let results = result;
              this.toaster.success(firstname+" removed sucessully.","", {
                timeOut: 2000,
              });
              this.userAddRemoveEmitterService.onUserRemove(this.parentIndex,this.index,userIndex)
              this.usersList = [];
              this.getUcsDetail();
            } else {   
              this.toaster.error("Some problem in removing user.","", {
                timeOut: 2000,
              });
            }
          },
          (error: any) => {
            this.overViewLoader = false;
            if (error.error.message != null && error.error.message != "") {
              this.toaster.error(error.error.message,"", {
                timeOut: 2000,
              });
            } else {
              this.toaster.error("Something went wrong. Please try after sometime.","", {
                timeOut: 2000,
              });
             
            }
          }
        );
      }
    });

    
  }
  apiCodeLoader: boolean = false;
  apiCodeDetails: any = "";
  getapiCode() {
    this.apiCodeLoader = true;
    this.apiCodeDetails = "";
    let errorMessage = "";
    this.frontEndService
      .ucsDetailsPage(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.apiCodeLoader = false;
          if (result.message == "success") {
            result.body[0].content = '<iframe width="560" height="315" src="'+
            this.sharePath + 'assets/index.php?uc_id='+ result.body[0]._id +
            '&embed=true'+
            '" frameborder="0" ></iframe>';
            this.apiCodeDetails = result.body[0];
          } else {
            this.apiCodeLoader = false;
            this.apiCodeDetails = "";
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.apiCodeLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.apiCodeDetails = "";
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
            this.apiCodeDetails = "";
          }
        }
      );
  }
  initInviteFrm() {
    this.sendInviteFrm = this.fb.group({
      email: ['',
        [Validators.required, Validators.email]
      ]
    });
  }
  isGenericEmail(email) {
    let checkEmail = email.replace(/.*@/, "");
    let notAllowedGenericEmail = [
      "yahoo.com",
      "gmail.com",
      "mailinator.com",
      "live.com",
      "rediffmail.com",
    ];
    if (notAllowedGenericEmail.indexOf(checkEmail) == -1) {
      this.genricError = false;
    } else {
      this.genricError = true;
    }
    // return this.genricError;
  }
  checkAll() {
    this.checkUncheck(this.selectAll)
  }
  checkUncheck(flag) {
    for (let i = 0; i < this.usersList.length; i++) {
      this.usersList[i]["isSelected"] = flag;
    }
  }
  checkOne() {
    let checkedCoun = 0;
    for (let i = 0; i < this.usersList.length; i++) {
      if (this.usersList[i]["isSelected"]) {
        checkedCoun++
      }
    }
    if (checkedCoun == this.usersList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }

  getUsers() {
    this.userListLoader = true;
    this.usersList = [];
    let errorMessage = ""
    let data = {
      ucs_createdby: this.created_by,
      ucs_id: this.ucsId
    }
    this.frontEndService
      .getUsers(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.userListLoader = false;
          if (result.statusCode == 200) {
            let usersList = result.body;
            for (let i = 0; i < usersList.length; i++) {
              usersList[i]["isSelected"] = false;
              this.usersList.push(usersList[i]);
            }
          } else {
            this.usersList = [];
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.userListLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
          this.usersList = [];
        }
      );
  }
  shareingLoader: boolean = false;
  share(selectedRes) {
    /* let selectedRes = [];
    for (let i = 0; i < this.usersList.length; i++) {
      if (this.usersList[i]["isSelected"]) {
        selectedRes.push(this.usersList[i]['_id'])
      }
    }
    if (selectedRes.length < 1) {
      this.toaster.error("Please Select at least one user", "", {
        timeOut: 2000,
      });
    } else {
      
    } */
    this.shareingLoader = true;
    let errorMessage = '';
    let data = {
      "user_ids": selectedRes.join(","),
      "ucs_id": this.ucsId
    }
    this.frontEndService.shareUcs(data).pipe().subscribe((result: any) => {
      this.shareingLoader = false;
      if (result.statusCode == 200) {
        this.toaster.success(result.message, "", {
          timeOut: 2000,
        });
        this.closeDialog(1);
      } else {
        errorMessage = 'Something went wrong. Please try after sometime.';
        this.toaster.error(errorMessage, "", {
          timeOut: 2000,
        });
      }
    }, (error: any) => {
      this.shareingLoader = false;
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
  sendInvite() {
    let isUserinvited = false;
    if (this.sendInviteFrm.value.email != null && this.sendInviteFrm.value.email != '') {
      isUserinvited = true;
      this.authenticationService.makeFormTouched(this.sendInviteFrm);
      if (this.sendInviteFrm.invalid || this.genricError == true) {
        return;
      } else {
        this.inviteLoader = true;
        let errorMessage = '';
        let data = {
          "invite_email": this.sendInviteFrm.value.email,
          "ucs_id": this.ucsId
        }
        this.frontEndService.sendInvitation(data).pipe().subscribe((result: any) => {
          this.inviteLoader = false;
          if (result.statusCode == 200) {
            this.toaster.success(result.message, "", {
              timeOut: 2000,
            });
            let results =result;

            this.onParticipantRemove.emit();
            this.userAddRemoveEmitterService.onUserAdd(results.body[0].sharedUsers,this.parentIndex,this.index);
            this.getUcsDetail();
            this.closeDialog(1);
          } else {
            errorMessage = 'Something went wrong. Please try after sometime.';
            this.toaster.error(errorMessage, "", {
              timeOut: 2000,
            });
          }
        }, (error: any) => {
          this.inviteLoader = false;
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
    }
    if (this.usersList.length > 0) {
      let selectedRes = [];
      for (let i = 0; i < this.usersList.length; i++) {
        if (this.usersList[i]["isSelected"]) {
          selectedRes.push(this.usersList[i]['_id'])
          isUserinvited = true;
        }
      }
      if (selectedRes.length > 0) {
        this.share(selectedRes);
      }
    }
    if (!isUserinvited) {
      this.toaster.error("Please select at least one user to invite", "", {
        timeOut: 2000,
      });
    }
  }
}
