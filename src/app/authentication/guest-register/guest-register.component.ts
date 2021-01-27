import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { RouterService } from 'src/app/shared/services/router.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthenticationService } from "../services/authentication.service";
import { PhoneNumberValidator } from 'src/app/shared/services/PhoneNumberValidator';
import { environment } from 'src/environments/environment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import Swal from 'sweetalert2';
import { RightSidebarComponent } from 'src/app/layout/right-sidebar/right-sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { AppComponent } from 'src/app/app.component';
interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: 'app-guest-register',
  templateUrl: './guest-register.component.html',
  styleUrls: ['./guest-register.component.sass']
})


export class GuestRegisterComponent implements OnInit {

  public errorMessage: string = "";
  public successMessage: string = "";
  public id: string;
  public code: string;
  public tokenNotFound: boolean = true;
  selectedCountry;
  selectedPhoneNumber;
  registerLoader = false;
  guestRegisterForm: FormGroup;
  submitted = false;
  data = [];
  recivedData = false;
  orgId = "";
  uniqueCode = "";
  type = "";
  email = "";
  fullname = "";
  phoneNumber = "";
  token = "";
  applyEmail = "";
  ucs_id = "";
  invited_by = "";

  isInvitedUser: boolean = false;
  countryCodes: Codes[] = environment.countries;
  isInvitename: string;
  constructor(  private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private AuthenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private commonService: CommonService,
    private toaster: ToastrService,
    private localStorageService: LocalStorageService,) { }

    resolved(captchaResponse: string) {

    }
    private checkPasswords(group: FormGroup) {
      // here we have the 'passwords' group
      let pass = group.controls.password.value;
      let confirmPass = group.controls.cpassword.value;
  
      return pass === confirmPass ? null : { notSame: true };
    }
  
    getFlags(flagName) {
      return this.commonService.getFlags(flagName);
  
    }
    getApplicationDetails(data_send) {
      this.AuthenticationService.corporateRegisterGetDetail(data_send)
        .pipe()
        .subscribe(
          (result) => {
            if (result != null) {
              let results = result.body[0];
              this.recivedData = true;
              this.orgId = results._id;
              this.uniqueCode = results.unique_code;
              this.type = results.type;
              let email = results.applicant_email;
              let fullname = results.fullname;
              this.isInvitename =  results.isinvitename;
             
              let isfullNameDisabled: boolean = true;
            
              if (this.isInvitedUser) {
                isfullNameDisabled = false
                
                fullname = "";

                email = this.applyEmail
              }
              this.fullname = fullname;
           
              this.guestRegisterForm = this.formBuilder.group(
                {
                  fullname: [
                    { value: fullname, disabled: isfullNameDisabled },
                    Validators.required,
                  ],
                  email: [{ value: email, disabled: true }],
                  domain: [{ value: results.domain, disabled: true }],
                  password: [
                    "",
                    Validators.compose([
                      Validators.required,
                      Validators.pattern(
                        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
                      ),
                    ]),
                  ],
                  cpassword: ["", Validators.required],
                  //recaptcha: ["", Validators.required],
                },
                { validator: this.checkPasswords }
              );
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
    }
    get f() {
      return this.guestRegisterForm.controls;
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
    
    ngOnInit() {
      if(this.localStorageService.userDetails){
        this.confirmationBox();
        return false;
      }
      this.isInvitedUser = false;
      this.route.params.subscribe((params) => {
        this.token =
          params.token != null && params.token !== undefined ? params.token : "";
        if (this.token) {
          this.tokenNotFound = false;
          let decodedToken = atob(this.token);
          let splitToken = decodedToken.split(":");
          let email = splitToken[0];
          let unique_code = splitToken[1];
          this.ucs_id = splitToken[3];
          this.applyEmail = email;
          if (splitToken.length > 2) {
            this.isInvitedUser = true;
            this.applyEmail = splitToken[2];
          }
          let details = {
            email: btoa(email),
            unique_code: btoa(unique_code),
          };
          this.getApplicationDetails(details);
        } else {
          this.tokenNotFound = true;
        }
      });
    }
  
    
    _validatePhoneNumberInput(c: AbstractControl): object {
      let inputValue: string = c.value.toString();
      
      let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
      if(phoneNumber){
        if(phoneNumber.isValid()){
          return null;
        } else {
          return {
            phoneNumber: {
              valid: false
            }
          }
        }
      } else {
        return {
          phoneNumber: {
            valid: false
          }
        }
      }return phoneNumber;
   }
  
   resetPhoneNumber(event: any): void {
    this.guestRegisterForm.controls['phoneNumber'].setValue('');
  }
  formatPhoneNumber(event: any): void {
    let inputValue: any = this.guestRegisterForm.controls['phoneNumber'].value;
    let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
  
    if(phoneNumber){
      this.selectedPhoneNumber = phoneNumber.number;
      this.guestRegisterForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
    }
  }
    onSubmit() {
      let fullname = this.fullname;
      let applyEmail = this.applyEmail;
      if (this.guestRegisterForm.value.fullname) {
        fullname = this.guestRegisterForm.value.fullname;
      }
      if (this.guestRegisterForm.value.email) {
        applyEmail = this.guestRegisterForm.value.email;
      }
      
      this.submitted = true;
      let data_send = {
        fullname: fullname,
        type: this.type,
        email: applyEmail,
        password: this.guestRegisterForm.value.password,
        organization: { org_id: this.orgId, role_name: this.type },
        unique_code: this.uniqueCode,
        ucs_id : this.ucs_id,
  
      };
      if (this.guestRegisterForm.invalid) {
        return;
      } else {
        this.errorMessage = "";
        this.AuthenticationService.sendGuestRegisterDetail(data_send)
          .pipe()
          .subscribe(
            (result) => {
              this.registerLoader = false;
              if (result != null) {
                this.toaster.success(result.message, "", {
                  timeOut: 2000,
                });

                setTimeout(()=>{
                  this.router.navigate(["/authentication/signin"]);
                },50)
              } else {
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
              }
            },
            (error: any) => {
              this.registerLoader = false;
              if (error.error.message != null && error.error.message != "") {
                this.errorMessage = error.error.message;
              } else {
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
              }
            }
          );
      }
    }

}
