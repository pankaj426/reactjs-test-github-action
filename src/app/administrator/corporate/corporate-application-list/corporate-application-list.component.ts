import { Component, OnInit } from "@angular/core";
import { AdministratorService } from "../../services/administrator.service";
import { DateFormatService } from "../../../shared/services/date-format.service";
import { ApplicationDetailsComponent } from "../application-details/application-details.component"
import { MatDialog } from '@angular/material/dialog';
import { OrgTypesEnum } from "../../../shared/constants/enum";
import { ToastrService } from 'ngx-toastr';
import { RejectEmitterService } from '../../reject-emitter-service';
import { RejectPopupComponent} from "../../reject-popup/reject-popup.component"
@Component({
  selector: "app-corporate-application-list",
  templateUrl: "./corporate-application-list.component.html",
  styleUrls: ["./corporate-application-list.component.sass"],
})
export class CorporateApplicationListComponent implements OnInit {
  loginLoader: any = false;
  showInputBox:any;
  comment:any;
  displayedColumns: string[] = [
    "Sr no",
    "Full Name",
    "Corporate Name",
    "Email Id",
    "Website",
    "Date Of Application",
    "Registered",
    "Date Of Registration",
    "Remarks",
    "Actions",
  ];
  constructor(public rejectEmitter : RejectEmitterService,public dialog: MatDialog, public toaster: ToastrService, private administratorService: AdministratorService, public dateFormatService: DateFormatService) { }
  errorMessage: any = "";
  public columnValues

  openPopup(_id,status,index){
    let DialogConfig = {
      data: {
        _id:_id,
        status:status,
        index:index,
        type:"corporate"
      },   
      width: '544px',
      panelClass: 'cust-share-modal'
    };
    let dialogRef = this.dialog.open(RejectPopupComponent, DialogConfig);
  }

  reject(_id, status, index,comment){
    let data = {
      "org_id": _id,
      "new_status": status,
      "comment":comment
    }
    this.administratorService.approved(data).pipe().subscribe((result: any) => {
      this.loginLoader = false;
      if (result.statusCode == 200) {
        //this.columnValues[index]["status"] = "rejected";
        this.toaster.success(result.message, "", {
          timeOut: 2000,
        });
      } else {
        this.errorMessage = 'Something went wrong. Please try after sometime.';
      }
    }, (error: any) => {
      this.loginLoader = false;
      if (error.error.message != null && error.error.message != '') {
        this.errorMessage = error.error.message;
      }
      else {
        this.errorMessage = 'Something went wrong. Please try after sometime.';
        this.columnValues = [];
      }
    }
    );
    this.showInputBox = 'hideBox';
  }

  approved(_id, status, index, email='', type='', pass='') {
    let data = {
      "org_id": _id,
      "new_status": status
    }
    this.administratorService.approved(data).pipe().subscribe((result: any) => {
      this.loginLoader = false;
      if (result.statusCode == 200) {
        if(email != '') {
          let data_send = {
            fullname: '',
            mobile: '',
            organization: { org_id: _id, role_name: 'corporateAdmin' },
            unique_code: '',
            ucs_id : '',
            country_code : '',
            user_location: '',
            type: type,
            email: email,
            password: pass,
          };
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
        this.errorMessage = 'Something went wrong. Please try after sometime.';
      }
    }, (error: any) => {
      this.loginLoader = false;
      if (error.error.message != null && error.error.message != '') {
        this.errorMessage = error.error.message;
      }
      else {
        this.errorMessage = 'Something went wrong. Please try after sometime.';
        this.columnValues = [];
      }
    }
    );
  }
  getList() {
    this.columnValues = [];
    this.administratorService
      .getCropList(OrgTypesEnum.corporate)
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


  openDetails(index) {
    let Details = this.columnValues[index];
    const dialogRef = this.dialog.open(ApplicationDetailsComponent, {
      data: {
        profile: Details,
        action: 'View',
      },
      width: '1024px'
    });
  }
  ngOnInit() {

    if (this.rejectEmitter.subsVarCorporate == undefined) {
      this.rejectEmitter.subsVarCorporate = this.rejectEmitter.corporateEmitter.subscribe((value) => {
        this.reject(value._id,value.status,value.index, value.comment);
        this.getList();
        this.rejectEmitter.subsVarCorporate = undefined;
      })
    }
    this.getList();
  }
}
