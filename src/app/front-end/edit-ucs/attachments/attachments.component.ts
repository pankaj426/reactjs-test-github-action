import { CommonService } from './../../../shared/services/common.service';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { FrontEndService } from './../../services/front-end.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from "../../../../environments/environment";
/* import { FormGroup, FormControl } from '@angular/forms'; */
@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  userId = this.localStorageService.userDetails._id;
  resourseLoader: boolean = true;
  resourceList: any = [];
  ucsId: any = "";
  selectAll: boolean = false;//new FormControl('');
  donwnloadPath = environment.services.files.downloadAttachments;
  selectedAttachments: any = [];
  uploadResLoader: boolean = false;
  fileUpoadTest: File = null;
  constructor(private frontEndService: FrontEndService, private commonService: CommonService, public toaster: ToastrService, private localStorageService: LocalStorageService, public dialogRef: MatDialogRef<AttachmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { this.ucsId = data.ucsId; this.selectedAttachments = data.selectedAttachments }
  ngOnInit(): void {
    this.getResourses();
  }
  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/resource/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  closeDialog(passingValue = []): void {
    this.dialogRef.close(passingValue);
  }
  checkAll() {
    
    this.checkUncheck(this.selectAll)
  }
  checkUncheck(flag) {
    for (let i = 0; i < this.resourceList.length; i++) {
      this.resourceList[i]["isSelected"] = flag;
    }
  }
  checkOne() {
    let checkedCoun = 0;
    for (let i = 0; i < this.resourceList.length; i++) {
      if (this.resourceList[i]["isSelected"]) {
        checkedCoun++
      }
    }
    if (checkedCoun == this.resourceList.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  getResourses() {
    
    this.resourseLoader = true;
    this.resourceList = [];
    let errorMessage = ""
    this.frontEndService
      .getResources(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.resourseLoader = false;
          if (result.statusCode == 200) {
            let resourceList = result.body;
            let selectCount = 0;
            for (let i = 0; i < resourceList.length; i++) {
              let isSelectedAttachments: boolean = false
              if (this.selectedAttachments.length > 0) {
                for (let j = 0; j < this.selectedAttachments.length; j++) {
                  if (this.selectedAttachments[j]["_id"] == resourceList[i]["_id"]) {
                    isSelectedAttachments = true;
                  }
                }
              }
              if (isSelectedAttachments) {
                selectCount++
              }
              resourceList[i]["isSelected"] = isSelectedAttachments;
              this.resourceList.push(resourceList[i]);
            }
            if (selectCount == resourceList.length) {
              this.selectAll = true;
            }
          } else {
            this.resourceList = [];
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.resourseLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
          this.resourceList = [];
        }
      );
  }
  attachFiles() {
    let selectedRes = [];
    for (let i = 0; i < this.resourceList.length; i++) {
      if (this.resourceList[i]["isSelected"]) {
        var res = this.resourceList[i].type.split("/");
        console.log(res)
        this.resourceList[i].fileMainType = res[0]
        this.resourceList[i].fileSubType = res[1]
        selectedRes.push(this.resourceList[i])
      }
    }
    if (selectedRes.length < 1) {
      this.toaster.error("Please Select at least one resource", "", {
        timeOut: 2000,
      });
    } else {
      this.closeDialog(selectedRes)
      console.log(selectedRes)
    }
  }
  uploadResources(fileUpoadTest: File) {
    this.uploadResLoader = true;
    let errorMessage = "";
    let doc_name = fileUpoadTest.name;
    const formData: FormData = new FormData();
    let org_id = this.localStorageService.userDetails.organization_id;
    let size = this.frontEndService.formatBytes(fileUpoadTest.size);
    //alert(this.formatBytes(fileUpoadTest.size));
    formData.append("ucs_id", this.ucsId);
    formData.append("org_id", org_id);
    formData.append("user_id", this.userId);
    formData.append("file", fileUpoadTest, doc_name);
    this.frontEndService.uploadResourse(formData).subscribe(
      (data: any) => {
        this.uploadResLoader = false;
        this.fileUpoadTest = null;
        if (data.statusCode == 200) {
          this.toaster.success("Resource uploaded successfully!", "", {
            timeOut: 2000,
          });
          let newRes = data.body;
          newRes["isSelected"] = false;
          this.resourceList.unshift(newRes);
          //this.getResourses();
        } else {
          errorMessage =
            "Something went wrong. Please try after sometime.";
          this.toaster.error(errorMessage, "", {
            timeOut: 2000,
          });
        }
      },
      (error) => {
        this.fileUpoadTest = null;
        this.uploadResLoader = false;
        if (error.error.message != null && error.error.message != "") {
          errorMessage = error.error.message;
        } else {
          errorMessage =
            "Something went wrong. Please try after sometime.";
        }
        this.toaster.error(errorMessage, "", {
          timeOut: 3000,
        });
      }
    );
  }
  handleFileInput(files: FileList) {
    this.fileUpoadTest = null;
    this.fileUpoadTest = files.item(0);
    if (this.fileUpoadTest) {
      let file = this.fileUpoadTest;
      if (this.commonService.chkValidFileExt(file)) {
        if (file.size > 20971520) {
          this.toaster.error("Your upload file size is too big!", "", {
            timeOut: 3000,
          });
        } else {
          this.uploadResources(file);
        }
      } else {
        this.toaster.error("Please uplad file with valid extensions.!", "", {
          timeOut: 3000,
        });
      }
    }
  }
}
