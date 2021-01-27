import { PomoationLinkPopupComponent } from './pomoation-link-popup/pomoation-link-popup.component';
import { Component, OnInit } from '@angular/core';
import { AdministratorService } from "../../services/administrator.service";
import { DateFormatService } from "../../../shared/services/date-format.service";
import { MatDialog } from '@angular/material/dialog';
import { OrgTypesEnum } from "../../../shared/constants/enum";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.sass']
})
export class PromotionsComponent implements OnInit {
  loginLoader: any = false;
  displayedColumns: string[] = [
    "Title",
    "Short Description",
    "Corporation",
    "Website",
    "Embed URL",
  ];
  constructor(public dialog: MatDialog, public toaster: ToastrService, private administratorService: AdministratorService, public dateFormatService: DateFormatService) { }
  errorMessage: any = "";
  apiLink: any = "";
  openShareLinkPopup(id) {
    let DialogConfig = {
      data: id,
      width: '544px',
      panelClass: 'cust-share-modal'
    };
    const dialogRef = this.dialog.open(PomoationLinkPopupComponent, DialogConfig);
  }
  public columnValues
  getShareApiLink() {
    this.apiLink = this.administratorService.getShareApiLink()
  }
  getList() {
    this.columnValues = [];
    this.administratorService
      .getPromotedList(OrgTypesEnum.corporate)
      .pipe()
      .subscribe(
        (result: any) => {
          this.loginLoader = false;
          if (result.message == "success") {
            this.columnValues = result.body;
          } else {
            this.columnValues = [];
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.loginLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.columnValues = [];
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.columnValues = [];
          }
        }
      );
  }

  ngOnInit() {
    this.getList();
    this.getShareApiLink();
  }

}
