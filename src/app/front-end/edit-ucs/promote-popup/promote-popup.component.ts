import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { FrontEndService } from '../../services/front-end.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { PromoteEmitterService } from '../promote-emmitter-service';

@Component({
  selector: 'app-promote-popup',
  templateUrl: './promote-popup.component.html',
  styleUrls: ['./promote-popup.component.scss']
})

export class PromotePopupComponent implements OnInit {
  promoteLoader: any;
  isUcsPromoted: boolean = false;
  errorMessage: any;
  checkboxx: boolean = false;
  isDeleted: boolean = false;
  lang: any = ["html"];
  public sendInviteFrm: FormGroup;
  public inviteLoader: boolean = false;
  ucsId: any = "";
  title: any = "";
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<PromotePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private frontEndService: FrontEndService,
    private authenticationService: AuthenticationService,
    public toaster: ToastrService,
    public promoteEmitter: PromoteEmitterService) {
    this.isUcsPromoted = data.isUcsPromoted;
    this.ucsId = data.ucsId;
    this.isDeleted = data.isDeleted;
    this.checkboxx = data.checkbox ? true : false;
    this.title = data.title;

  }
  public ngOnInit(): void {


  }
  promoStrartStrop(isUcsPromoted) {
    if (isUcsPromoted) {
      this.stopPromote()
    } else {
      this.promote();
    }
  }
  checkboxevent(event) {
    if (event.target.checked) {
      this.checkboxx = true;
    } else {
      this.checkboxx = false;
    }
  }

  promote() {
    if (this.checkboxx == true) {
      this.promoteLoader = true;
      let data = {
        "ucs_id": this.ucsId
      }
      this.frontEndService
        .promoteUcs(data)
        .pipe()
        .subscribe(
          (result: any) => {
            this.promoteLoader = false;
            if (result.statusCode == 200) {
              this.isUcsPromoted = true;
              this.toaster.success(result.message, "", {
                timeOut: 2000,
              })
              this.promoteEmitter.onStopPromoting(true, this.ucsId);
              this.closeDialog();
            } else {
              this.promoteEmitter.onStopPromoting(false, this.ucsId);
              this.isUcsPromoted = false;
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
              this.toaster.error(this.errorMessage, "", {
                timeOut: 2000,
              });
            }
          },
          (error: any) => {
            this.promoteEmitter.onStopPromoting(false, this.ucsId);
            this.isUcsPromoted = false;
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
      this.toaster.error(" Please check the checkbox.", "", {
        timeOut: 2000,
      });
    }

  }
  cancel() {
    this.closeDialog();
  }
  stopPromote() {
    if (this.isDeleted == false) {
      if (this.checkboxx != true) {
        let data = {
          "ucs_id": this.ucsId
        }
        
        this.frontEndService
          .stopPromoteUcs(data)
          .pipe()
          .subscribe(
            (result: any) => {
              
              if (result.statusCode == 200) {
                this.isUcsPromoted = false;
                this.toaster.success(result.message, "", {
                  timeOut: 2000,
                })
                this.promoteEmitter.onStopPromoting(false, this.ucsId);
                this.closeDialog();
              } else {
                this.promoteEmitter.onStopPromoting(true, this.ucsId);
                this.isUcsPromoted = false;
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
                this.toaster.error(this.errorMessage, "", {
                  timeOut: 2000,
                });
              }
            },
            (error: any) => {
              this.promoteEmitter.onStopPromoting(true, this.ucsId);
              this.isUcsPromoted = false;
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
        this.toaster.error(" Please uncheck the checkbox.", "", {
          timeOut: 2000,
        });
      }
    } else {
      this.closeDialog();
    }


  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
