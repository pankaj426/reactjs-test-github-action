import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { RouterService } from "../../shared/services/router.service";
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { PhoneNumberValidator } from './../../shared/services/PhoneNumberValidator';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import Swal from 'sweetalert2';
import { RightSidebarComponent } from 'src/app/layout/right-sidebar/right-sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { AppComponent } from 'src/app/app.component';
interface Codes { name: string, dial_code: string, code: string }

@Component({
  selector: "app-start-up-register",
  templateUrl: "./start-up-register.component.html",
  styleUrls: ["./start-up-register.component.sass"],
})


export class StartUpRegisterComponent implements OnInit {
  country :any;
  public errorMessage: string = "";
  public successMessage: string = "";
  public id: string;
  public code: string;
  public tokenNotFound: boolean = true;
  selectedCountry;
  selectedPhoneNumber;
  registerLoader = false;
  startupRegisterForm: FormGroup;
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
  countryCode:any;
  isInvitedUser: boolean = false;
  countryCodes: Codes[] = environment.countries;
  nationalNumber: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private AuthenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
  ) { }
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

  public noWhitespaceValidator(control: FormGroup) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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
            this.getSelectedCountryCode(results.additional_fields.countryCode).then(data=>{
        
              this.selectedCountry = this.countryCode.code;
            })
            this.uniqueCode = results.unique_code;
            this.type = results.type;
            let email = results.applicant_email;
            let fullname = results.fullname;
            let phoneNumber = results.mobile_number;
            let isfullNameDisabled: boolean = false;
            let isphoneNoDisabled: boolean = true;
            if (this.isInvitedUser) {
              isphoneNoDisabled = false
              fullname = "";
              phoneNumber = "";
              email = this.applyEmail
            }
            this.fullname = fullname;
            this.phoneNumber = phoneNumber;
            this.startupRegisterForm = this.formBuilder.group(
              {
                name: [{ value: results.name, disabled: true }],
                fullname: [
                  { value: fullname, disabled: isfullNameDisabled },
                  [Validators.required,Validators.maxLength(80), Validators.minLength(3), this.noWhitespaceValidator]
                ],
                email: [{ value: email, disabled: true }],
                domain: [{ value: results.domain, disabled: true }],
                phoneNumber: [this.phoneNumber,[Validators.required,PhoneNumberValidator(this.selectedCountry),  this._validatePhoneNumberInput.bind(this)]],
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
    return this.startupRegisterForm.controls;
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
      allowOutsideClick: false,
      background: "rgba(0, 0, 0, 1)",
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
  this.startupRegisterForm.controls['phoneNumber'].setValue('');
}
/* formatPhoneNumber(event: any): void {
  let inputValue: any = this.startupRegisterForm.controls['phoneNumber'].value;
  let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);

  if(phoneNumber){
    this.selectedPhoneNumber = phoneNumber.number;
    this.startupRegisterForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
} */

formatPhoneNumber(event: any): void {
  let inputValue: any = this.startupRegisterForm.controls['phoneNumber'].value;
  let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
  if(phoneNumber && phoneNumber.nationalNumber) {
    this.nationalNumber = phoneNumber.nationalNumber
  }
  if (phoneNumber) {
    this.selectedPhoneNumber = phoneNumber.number;
    this.startupRegisterForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
}

formatPhoneNumbers(inputVal: any): void {
  let inputValue: any = inputVal;
  let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
  if(phoneNumber && phoneNumber.nationalNumber) {
    this.nationalNumber = phoneNumber.nationalNumber
  }
  if (phoneNumber) {
    this.selectedPhoneNumber = phoneNumber.number;
    this.startupRegisterForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
}


getCountryCode(){

  this.country =   this.countryCodes.find((element)=>{ if(element.code == this.selectedCountry){return true}});


 }

 getSelectedCountryCode(code){

  return new Promise(resolve=>{
    this.countryCode =   this.countryCodes.find((element)=>{ if(element.dial_code == code){return true}});
    resolve("data");
  })
 }
  onSubmit() {
    this.getCountryCode();

    let fullname = this.fullname;
    let applyEmail = this.applyEmail;
    let phoneNumber = this.phoneNumber;
    if (this.startupRegisterForm.value.fullname) {
      fullname = this.startupRegisterForm.value.fullname;
    }
    if (this.startupRegisterForm.value.email) {
      applyEmail = this.startupRegisterForm.value.email;
    }
    if (this.startupRegisterForm.value.phoneNumber) {
      phoneNumber = this.startupRegisterForm.value.phoneNumber;
    }
    this.submitted = true;
    let data_send = {
      fullname: fullname,
      type: this.type,
      email: applyEmail,
      mobile: phoneNumber,
      password: this.startupRegisterForm.value.password,
      organization: { org_id: this.orgId, role_name: this.type },
      unique_code: this.uniqueCode,
      ucs_id : this.ucs_id,
      country_code : this.country.dial_code
    };
    if (this.startupRegisterForm.invalid) {
      return;
    } else {
      this.errorMessage = "";
      this.AuthenticationService.sendRegisterDetail(data_send)
        .pipe()
        .subscribe(
          (result) => {
            this.registerLoader = false;
            if (result != null) {
              /* this.sessionStorageService.setUserAuthDetails(result.body);
              this.sessionStorageService.setUserDetails(result.body); */
              this.successMessage = result.message;
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
