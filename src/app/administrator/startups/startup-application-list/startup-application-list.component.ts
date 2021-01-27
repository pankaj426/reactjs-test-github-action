import { Component, OnInit } from "@angular/core";
import { AdministratorService } from "../../services/administrator.service";
import { DateFormatService } from "../../../shared/services/date-format.service";
import { orgTypes } from "../../../shared/constants/enum";
import {ApplicationDetailsComponent} from "../../corporate/application-details/application-details.component";
import { MatDialog } from '@angular/material/dialog';
import { RejectPopupComponent} from "../../reject-popup/reject-popup.component"
import { RejectEmitterService } from "../../reject-emitter-service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-startup-application-list",
  templateUrl: "./startup-application-list.component.html",
  styleUrls: ["./startup-application-list.component.sass"],
})
export class StartupApplicationListComponent implements OnInit {
  loginLoader: any = false;
  showInputBox : any;
  comment:any;
  displayedColumns: string[] = [
    "Sr no.",
    "Full Name",
    "Company Name",
    "Email ID",
    "Website",
    "Date Of Application",
    "Registered",
    "Date Of Registration",
    "Remarks",
    "Actions",
  ];
  errorMessage: any = "";
  public columnValues;


  openPopup(_id,status,index){
    let DialogConfig = {
      data: {
        _id:_id,
        status:status,
        index:index,
        type:"startup"
      },   
      width: '544px',
      panelClass: 'cust-share-modal'
    };
    let dialogRef = this.dialog.open(RejectPopupComponent, DialogConfig);
  }

  reject(_id, status, index,comment){ 
    let data = {
      org_id: _id,
      new_status: status,
      comment: comment
    };
    this.administratorService
      .approved(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.loginLoader = false;
          if (result.statusCode == 200) {
            //this.columnValues[index]["status"] = "rejected";
            this.toaster.success(result.message, "", {
              timeOut: 2000,
            });
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.loginLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.columnValues = [];
          }
        }
      );
    this.showInputBox = 'hideBox';
  }

  approved(_id, status, index, email='', type='', pass='') {
    let data = {
      org_id: _id,
      new_status: status
    };
    this.administratorService
      .approved(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.loginLoader = false;
          if (result.statusCode == 200) {
            if(email != '') {
              let data_send = {
                fullname: '',
                mobile: '',
                organization: { org_id: _id, role_name: 'startupAdmin' },
                unique_code: '',
                ucs_id : '',
                country_code : '',
                user_location: '',
                type: type,
                email: email,
                password: pass,
              };
              console.log(data_send);
              this.administratorService.sendRegisterDetail(data_send)
              .pipe()
              .subscribe(
                (result) => {},
                (error: any) => {}
              );
            }
            this.columnValues[index]["status"] = status;
            this.toaster.success(result.message, "", {
              timeOut: 2000,
            });
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.loginLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.columnValues = [];
          }
        }
      );
  }
  getList() {

    this.columnValues = [];
    this.administratorService
      .getCropList(orgTypes.startups)
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
  constructor(
    private administratorService: AdministratorService,
    public dateFormatService: DateFormatService,
    public dialog: MatDialog,
    public rejectEmitter : RejectEmitterService,
    public toaster: ToastrService,
  ) {}
  openDetails(index){
    let Details=this.columnValues[index];
    const dialogRef = this.dialog.open(ApplicationDetailsComponent, {
      data: {
        profile: Details,
        action: 'View',
        
      },
      width: '1050px'
    });
  }
  
  ngOnInit() {

    if (this.rejectEmitter.subsVarStartup == undefined) {
      this.rejectEmitter.subsVarStartup = this.rejectEmitter.startupEmitter.subscribe((value) => {
        this.reject(value._id,value.status,value.index, value.comment);
        this.rejectEmitter.subsVarStartup = undefined;
        this.getList();
      })
    }

    this.getList();

    
  }
}
