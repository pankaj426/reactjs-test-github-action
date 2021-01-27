import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../../authentication/services/authentication.service';
import { FrontEndService } from './../../services/front-end.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { discussionType } from "../../../shared/constants/enum";
import { environment } from "../../../../environments/environment";
import { env } from 'process';

@Component({
  selector: 'app-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss']
})

export class SharePopupComponent implements OnInit {
  lang: any = ["html"];
  public sendInviteFrm: FormGroup;
  public inviteLoader: boolean = false;
  ucsId: any = "";
  genricError: boolean = false;
  selectAll: boolean = false;
  usersList: any = [];
  userListLoader: boolean = false;
  created_by: any = "";
  type: any = "invite";
  overViewLoader = false;
  overViewDetails = "";
  shareUrl = "";
  sharePath = "";
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<SharePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private frontEndService: FrontEndService,
    private _clipboardService: ClipboardService,
    private authenticationService: AuthenticationService,
    public toaster: ToastrService) {
    this.ucsId = data.ucsId;
    this.created_by = data.created_by
    this.type = data.type
    this.sharePath = environment.services.siteUrl
    if (this.type == "invite") {
      this.initInviteFrm();
      this.getUsers();
    }
    if (this.type != "invite") {
      this.getUcsDetail();
      this.getapiCode();
      this.shareUrl = environment.services.files.baseUrl + 
              environment.public.basePath + '/' +
              environment.public.main
    }
  }
  public ngOnInit(): void {
    this.getDetails();
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
    this.overViewDetails = "";
    let errorMessage = "";
    this.frontEndService
      .ucsDetailsPage(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.message == "success") {
            this.overViewDetails = result.body[0];
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

  getDetails() {
    this.frontEndService
      .getDetailsUcs(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {}
        },
        (error: any) => {}
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
