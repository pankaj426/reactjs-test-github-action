import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { FrontEndService } from '../../services/front-end.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/shared/services/common.service';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.sass']
})
export class ResourcesComponent implements OnInit {
  donwnloadPath = environment.services.files.downloadAttachments;
  resourseLoader: boolean = true;
  resourceList: any = [];
  dtlResLoader: boolean = false;
  dtlReslist: any = [];
  ucsId: any = "";
  showParticipants:boolean = false;
  ucs_type: any = "";
  ucs_user_role: any = "";
  errorMessage = "";
  userId = this.localStorageService.userDetails._id;
  public isSampleEditable: boolean = true;
  constructor(  private localStorageService: LocalStorageService,
    private frontEndService: FrontEndService,
    public commonService: CommonService,
    private toaster: ToastrService,) { }

  ngOnInit(): void {
    this.showParticipants = false;
    this.ucsId = localStorage.getItem('ucs_id');
    this.ucs_type = localStorage.getItem('ucs_type');
    this.ucs_user_role = localStorage.getItem('ucs_user_role');
    this.getResourses();
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
            this.resourceList = result.body;
          } else {
            this.resourceList = [];
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.resourseLoader = false;
          this.resourceList = [];
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }

        }
      );
  }

  updateRes(val, ucsid, resIndex) {
    setTimeout(() => {
      const { checked } = val;
      let flag = checked === true ? 'public' : 'private';
      this.resourceList[resIndex].status = flag;
      let id = ucsid
      let data = {
        "resource_id": id,
        "status": flag
      };
      this.frontEndService
        .updateResoures(data)
        .pipe()
        .subscribe(
          (result: any) => {
            if (result.statusCode == 200) {
              //this.resourceList[resIndex].status = flag;
              this.toaster.success(result.message, "", {
                timeOut: 2000,
              });
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            if (error.error.message != null && error.error.message != "") {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          }
        );
    }, 0);

  }
  removeRes(resId, resIndex) {
    Swal.fire({
      title: '',
      text: "Are you sure you want to delete this resource?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#46448B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        let data = {
          "resource_id": resId
        }
        this.frontEndService
          .removeResource(data)
          .pipe()
          .subscribe(
            (result: any) => {
              if (result.statusCode == 200) {
                this.toaster.success(result.message, "", {
                  timeOut: 2000,
                });
                /* Swal.fire('Deleted!', 'Resource has been deleted.', 'success'); */
                this.resourceList.splice(resIndex, 1);
              } else {
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
                this.toaster.error(this.errorMessage, "", {
                  timeOut: 2000,
                });
              }
            },
            (error: any) => {
              if (error.error.message != null && error.error.message != "") {
                this.errorMessage = error.error.message;
              } else {
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
              }
              this.toaster.error(this.errorMessage, "", {
                timeOut: 2000,
              });
            }
          );
      }
    });
  }
  uploadResLoader: boolean = false;
  fileUpoadTest: File = null;
  uploadResources(fileUpoadTest: File) {
    this.uploadResLoader = true;
    let errorMessage = "";
    let doc_name = fileUpoadTest.name;
    const formData: FormData = new FormData();
    let org_id = this.localStorageService.userDetails.organization_id;
    let size = this.frontEndService.formatBytes(fileUpoadTest.size);
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
          window["document"]["querySelector"]('[type=file]')["value"] = '';
          this.resourceList.unshift(data.body);
          //this.getResourses();
        } else {
          this.errorMessage =
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
          if (this.commonService.chkValidFileExt(file)) {
            this.uploadResources(file);
          } else {
            this.toaster.error("Only image,pdf and video files are acceptable!", "", {
              timeOut: 3000,
            });
          }

        }
      } else {
        this.toaster.error("Please upload file Only image,pdf and video .!", "", {
          timeOut: 3000,
        });
      }
    }
  }
  showPubPraivateRes(flag) {
    return flag == 'public' ? true : false;
  }
  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/resource/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

}
