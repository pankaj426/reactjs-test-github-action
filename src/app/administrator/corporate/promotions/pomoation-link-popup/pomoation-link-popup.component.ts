import { AdministratorService } from './../../../services/administrator.service';

import { FrontEndService } from './../../../../front-end/services/front-end.service';
import { environment } from './../../../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard'
@Component({
  selector: 'app-pomoation-link-popup',
  templateUrl: './pomoation-link-popup.component.html',
  styleUrls: ['./pomoation-link-popup.component.sass']
})
export class PomoationLinkPopupComponent implements OnInit {
  lang: any = ["html"];
  details: any = "";
  detailLoader: boolean = false;
  errorMessage: any = "";
  embedPath = environment.services.siteUrl;
  constructor(
    public toaster: ToastrService,
    public adminService: AdministratorService,
    public frontEndService: FrontEndService,
    private _clipboardService: ClipboardService,
    public dialogRef: MatDialogRef<PomoationLinkPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getPromoDetails();
  }

  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }
  copy(text: string) {
    if (this._clipboardService.copyFromContent(text)) {
      this.toaster.success("Code copied", "Success!", {
        timeOut: 3000,
      });
    }
  }

  getPromoDetails() {
    this.detailLoader = true;
    this.details = "";
    let id = this.data;
    this.frontEndService
      .ucsDetailsPage(id)
      .pipe()
      .subscribe(
        (result: any) => {
          this.detailLoader = false;
          if (result.message == "success") {
            result.body[0].content = '<iframe width="560" height="315" src="'+
            this.embedPath + 'assets/index.php?uc_id='+ result.body[0]._id +
            '&embed=true'+
            '" frameborder="0" ></iframe>';
            this.details = result.body[0];
          } else {
            this.detailLoader = false;
            this.details = "";
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.detailLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.details = "";
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.details = "";
          }
        }
      );
  }
  ngOnInit() {
  }
}