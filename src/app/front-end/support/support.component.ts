import { RouterService } from 'src/app/shared/services/router.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from "../../authentication/services/authentication.service"
import { FrontEndService } from '../services/front-end.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userRoles } from '../../shared/constants/enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.sass']
})
export class SupportComponent implements OnInit {
  public supportFrm: FormGroup;
  public feedbackFrm: FormGroup;
  public loader: boolean = false;
  public typeLoader: boolean = false;
  public types = [];
  constructor(private fb: FormBuilder,
    private frontEndService: FrontEndService,
    private authenticationService: AuthenticationService,
    public toaster: ToastrService,
    public localStorageService: LocalStorageService,
    public routerServices: RouterService, public dialogRef: MatDialogRef<SupportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }
  initSupportFrm() {
    this.supportFrm = this.fb.group({
      subject: ['',
      [Validators.required, Validators.maxLength(20), Validators.minLength(3),Validators.pattern(/^((?!\s{,2}).)*$/)]
      ],
      description: ['',
        [Validators.required,Validators.maxLength(500), Validators.minLength(3)]
      ],
    });
  }
  initFeedbackFrm() {
    this.feedbackFrm = this.fb.group({
      subject: ['',
        [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern(/^((?!\s{,2}).)*$/)]
      ],
      description: ['',
        [Validators.required,Validators.maxLength(500), Validators.minLength(3)]
      ],
    });
  }
  public ngOnInit(): void {
    this.initSupportFrm();
    this.getSubjectTypes();
    this.initFeedbackFrm();
  }
  getSubjectTypes() {
    this.typeLoader = true;
    this.types = [];
    let data = { type: 'support' };
    this.authenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.typeLoader = false;
          if (result.statusCode == 200) {
            this.types = result.body;
          } else {
            this.types = [];
          }
        },
        (error: any) => {
          this.typeLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.types = [];
          } else {
            this.types = [];
          }
        }
      );

  }
  onSubmitClick() {
    this.loader = true;
    this.authenticationService.makeFormTouched(this.supportFrm);
    if (this.supportFrm.invalid) {
      this.loader = false;
      return;
    } else {
      let errorMessage = '';
      let data = {
        "subject": this.supportFrm.value.subject.trim(),
        "type": "Support",
        "description": this.supportFrm.value.description.trim()
      }
      this.frontEndService.supportQuery(data).pipe().subscribe((result: any) => {
        this.loader = false;
        if (result.statusCode == 200) {
          this.toaster.success(result.message, "", {
            timeOut: 3000,
          });
          setTimeout(() => {
            this.closeDialog();
          }, 1500)
        } else {
          errorMessage = 'Something went wrong. Please try after sometime.';
          this.toaster.error(errorMessage, "", {
            timeOut: 2000,
          });
        }
      }, (error: any) => {
        this.loader = false;
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

  onSubmitFeedback() {
    this.loader = true;
    this.authenticationService.makeFormTouched(this.feedbackFrm);
    if (this.feedbackFrm.invalid) {
      this.loader = false;
      return;
    } else {
      let errorMessage = '';
      let data = {
        "subject": this.feedbackFrm.value.subject.trim(),
        "type": "Feedback",
        "description": this.feedbackFrm.value.description.trim()
      }
      this.frontEndService.supportQuery(data).pipe().subscribe((result: any) => {
        this.loader = false;
        if (result.statusCode == 200) {
          this.toaster.success(result.message, "", {
            timeOut: 3000,
          });
          setTimeout(() => {
            this.closeDialog();
          }, 1500)
        } else {
          errorMessage = 'Something went wrong. Please try after sometime.';
          this.toaster.error(errorMessage, "", {
            timeOut: 2000,
          });
        }
      }, (error: any) => {
        this.loader = false;
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
  redirectToDashboard() {
    if (this.localStorageService.userDetails.roles == userRoles.startupAdmin || this.localStorageService.userDetails.roles == userRoles.startupUser) {
      this.redirectToStartupDashboard();
    } else if (this.localStorageService.userDetails.roles == userRoles.corporateAdmin || this.localStorageService.userDetails.roles == userRoles.corporateUser) {
      this.redirectToCorpDashboard();
    }
  }
  redirectToStartupDashboard() {
    this.routerServices.RedirectToStartupDashboard();
  }
  redirectToCorpDashboard() {
    this.routerServices.RedirectToCorpDashboard();
  }
}

