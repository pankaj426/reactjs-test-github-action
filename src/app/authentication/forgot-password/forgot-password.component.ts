import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { RouterService } from '../../shared/services/router.service';
import { SigninComponent } from '../signin/signin.component';
import { OrgTypesEnum } from '../../shared/constants/enum';
import Swal from 'sweetalert2';
import { RightSidebarComponent } from 'src/app/layout/right-sidebar/right-sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { AppComponent } from 'src/app/app.component';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
@Component({
  providers: [SigninComponent],
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  static authenticated = false;
  public orgTypes: any = OrgTypesEnum;

  public errorMessage: string = '';
  public loginLoader: boolean = false;
  forgotbuttondisable : boolean = false;
  public successMessage: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private AuthenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private signInComp: SigninComponent,
    private localStorageService: LocalStorageService,
  ) { }
  ngOnInit() {
    if(this.localStorageService.userDetails){
      this.confirmationBox();
      
    }
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.loginForm.controls;
  }
  redirectToLogin() {
    this.routerService.RedirectToLogin();
  }
  onSubmit() {
    this.loginLoader = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.AuthenticationService.makeFormTouched(this.loginForm);
    if (this.loginForm.invalid) {
      this.loginLoader = false;
      return;
    } else {
      this.forgotbuttondisable= true;
      this.AuthenticationService.forgotPassword(this.loginForm.value).pipe().subscribe((result: any) => {
        this.loginLoader = false;
        this.forgotbuttondisable= true;
        if (result.statusCode === 200) {
          this.successMessage = 'Email verification successful,a reset password link has been sent to your registered email address.';
        }
        let that = this;
        setTimeout(function () { that.redirectToLogin(); }, 3000);
      }, error => {
        this.loginLoader = false;
        this.errorMessage = error.error.message;
        this.forgotbuttondisable= false;
      }
      );
    }
  }
  goToApply(redirectValue) {
    this.signInComp.goToApply(redirectValue)
  }
  
confirmationBox(){
  HeaderComponent.authenticated = false;
  Swal.fire({
    title: '',
    html: 'You are logged on to the Enterprise Innovation platform with <b>'+this.localStorageService.userDetails.email+'</b>.<br>You can choose to re-login as a different user or you can continue to stay as <b>'+this.localStorageService.userDetails.email+'</b>',
    showCancelButton: true,
    confirmButtonColor: '#003265',
    cancelButtonColor: '#f44336',
    confirmButtonText: 'Relogin as different user',
    cancelButtonText: 'Continue as existing user',
    reverseButtons: true,
    allowOutsideClick: false
  }).then(result => {
    if (result.value) {
      RightSidebarComponent.authenticated = false;
      HeaderComponent.authenticated = false;
      AppComponent.authenticated = false;
      this.sessionStorageService.flushOnLogout();
      localStorage.clear();
      window.location.reload();      
    }else{
      this.routerService.RedirectToLogin();
    }
  });
  
}
}
