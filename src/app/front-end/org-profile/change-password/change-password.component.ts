import { ToastrService } from 'ngx-toastr';
import { FrontEndService } from './../../services/front-end.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { RouterService } from '../../../shared/services/router.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RightSidebarComponent } from 'src/app/layout/right-sidebar/right-sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public errorMessage: string = '';
  public successMessage: string = '';
  public loginLoader: boolean = false;
  changePasswordForm: FormGroup;
  returnUrl: string;
  authenticated= false;
  hide = true;
  token = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private AuthenticationService: AuthenticationService,
    private FrontEndService: FrontEndService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }
  logout() {
    this.FrontEndService
      .saveDrafts()
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            RightSidebarComponent.authenticated = false;
            HeaderComponent.authenticated = false;
            AppComponent.authenticated = false;
            this.authenticated = false;
            this.sessionStorageService.flushOnLogout();
            localStorage.clear();
            this.redirectToLogin()
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
        }
      );
    // this.sessionStorageService.flushOnLogout();
    // this.redirectToLogin()
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params.token != null && params.token !== undefined ? params.token : ""
    });
    this.changePasswordForm = this.formBuilder.group(
      {
        currentpassword: ["", [Validators.required]],
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
          ]),
        ],
        cpassword: ["", [Validators.required]]
      },
      { validator: this.checkPasswords }
    );
  }
  get f() {
    return this.changePasswordForm.controls;
  }
  private checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.cpassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }
  redirectToLogin() {
    this.routerService.RedirectToLogin();
  }

  onSubmit() {
    this.loginLoader = true;
    this.AuthenticationService.makeFormTouched(this.changePasswordForm);
    if (this.changePasswordForm.invalid) {
      this.loginLoader = false;
      return;
    } else {
      this.errorMessage = '';
      this.successMessage = '';
      let data = {
        "old_password": this.changePasswordForm.value.currentpassword,
        "new_password": this.changePasswordForm.value.password,
        "confirm_password": this.changePasswordForm.value.cpassword,
      }
      this.FrontEndService.changePassword(data).pipe().subscribe((result: any) => {
        this.loginLoader = false;
        if (result.statusCode == 200) {
          this.toaster.success(result.message, "", {
            timeOut: 2000,
          });
          this.closeDialog();
          let that = this;
          setTimeout(function () { that.logout(); }, 500);
        } else {
          this.errorMessage = 'Something went wrong. Please try after sometime.';
          this.toaster.error(this.errorMessage, "", {
            timeOut: 2000,
          });
        }
      }, (error: any) => {
        this.loginLoader = false;
        if (error.error.message != null && error.error.message != '') {
          this.errorMessage = error.error.message;
        }
        else {
          this.errorMessage = 'Something went wrong. Please try after sometime.';

        }
        this.toaster.error(this.errorMessage, "", {
          timeOut: 2000,
        });
      }
      );
    }
  }

}
