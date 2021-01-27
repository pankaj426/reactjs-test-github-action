import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup,Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { RouterService } from '../../shared/services/router.service';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { RightSidebarComponent } from '../../layout/right-sidebar/right-sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { AppComponent } from '../../app.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  public errorMessage: string='';
  public successMessage: string='';
  public loginLoader : boolean=false;
  changePasswordForm: FormGroup;
  returnUrl: string;
  hide = true;
  token='';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private AuthenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private localStorageService: LocalStorageService,
  ) {}
  ngOnInit() {
    if(this.localStorageService.userDetails){
      this.confirmationBox();
      return false;
    }
    this.route.params.subscribe(params => {
     this.token = params.token != null && params.token !== undefined ? params.token : ""
    });
    this.changePasswordForm = this.formBuilder.group(
      {
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
  redirectToLogin(){
    this.routerService.RedirectToLogin();
  }

  onSubmit() {
    this.loginLoader=true;
    this.AuthenticationService.makeFormTouched(this.changePasswordForm);
    if (this.changePasswordForm.invalid) {
      this.loginLoader=false;
      return;
    } else {
      this.errorMessage = '';
      this.successMessage='';
      let  data={
        "token":this.token,
        "password":this.changePasswordForm.value.password,
        "confirm_password":this.changePasswordForm.value.cpassword
        }
      this.AuthenticationService.changePasswordAPI(data).pipe().subscribe((result:any) => {
        this.loginLoader=false;
        if (result.message == "success") {
            this.successMessage='Your password has been reset successfully';
            let that=this;
            setTimeout(function(){ that.redirectToLogin(); }, 3000);
            
        } else {
          this.errorMessage = 'Something went wrong. Please try after sometime.';
        }
      }, (error:any) => {
        this.loginLoader=false;
        if (error.error.message != null && error.error.message != '') {
          this.errorMessage = error.error.message;
          this.redirectToLogin();
        }
        else {
          this.errorMessage = 'Something went wrong. Please try after sometime.';
          this.redirectToLogin();
        }
      }
      );
    }
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
