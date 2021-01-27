import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl, AbstractControl
} from "@angular/forms";
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { RouterService } from "../../shared/services/router.service";

import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { PhoneNumberValidator } from './../../shared/services/PhoneNumberValidator';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import Swal from 'sweetalert2';
import { RightSidebarComponent } from '../../layout/right-sidebar/right-sidebar.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { AppComponent } from '../../app.component';

interface Industries {
  key: string;
  value: string;
}

interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  selectedCountry:any;
  selectedPhoneNumber:any;
  public errorMessage: string = "";
  public successMessage: string = "";
  public id: string;
  public code: string;
  public tokenNotFound: boolean = true;
  public token: any = "";
  registerLoader = false;
  registerForm: FormGroup;
  location = '';
  submitted = false;
  data = [];
  ucs_id = "";
  industry = [];
  recivedData = false;
  orgId = "";
  uniqueCode = "";
  type = "";
  email = "";
  fullname = "";
  phoneNumber = "";
  applyEmail = "";
  isInvitedUser: boolean = false;
  industries: Industries[] = [
    { key: "retail", value: "Retail" },
    { key: "tex_fas_jew", value: "Textile Fashion Jewelry" },
    { key: "manufacturing", value: "Manufacturing (Industry 4.0)" },
    { key: "agri_food", value: "Agriculture and Food" },
    { key: "finacialTech", value: "financial Technology" },
    { key: "infra_const", value: "Infra & Construction" },
    { key: "pharma_healt", value: "Pharma & HealthCare" },
    { key: "others", value: "Others" },
  ];
  countryCodes: Codes[] = environment.countries;
  country:any;
  countryCode:any;
  nationalNumber: any;
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private AuthenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
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
  getApplicationDetails(data_send) {
    this.AuthenticationService.corporateRegisterGetDetail(data_send)
      .pipe()
      .subscribe(
        (result) => {
          if (result != null) {
            
            let results = result.body[0];
            this.getSelectedCountryCode(results.additional_fields.countryCode).then(data=>{
        
              this.selectedCountry = this.countryCode.code;
            })
            this.recivedData = true;
            this.orgId = results._id;
            this.uniqueCode = results.unique_code;
            this.type = results.type;
            let fullname = results.fullname;
            let phoneNumber = results.mobile_number;
            this.location = results.additional_fields.userLocation;
            let isfullNameDisabled: boolean = true;
            let isphoneNoDisabled: boolean = true;
            
            let applicant_email = results.applicant_email;
            if (this.isInvitedUser) {
              isfullNameDisabled = false
              isphoneNoDisabled = false
              fullname = "";
              phoneNumber = "";
              applicant_email = this.applyEmail
            }

            
            this.fullname = fullname;
            this.phoneNumber = phoneNumber;
            this.registerForm = this.formBuilder.group(
              {
                name: [{ value: results.name, disabled: true }],
                fullname: [
                  { value: this.fullname, disabled: isfullNameDisabled },
                  Validators.required,
                ],
                phoneNumber: [this.phoneNumber, [Validators.required,PhoneNumberValidator(this.selectedCountry),  this._validatePhoneNumberInput.bind(this)]],
  
                email: [{ value: applicant_email, disabled: true }],
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
            this.industry = [results.industry];
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
  this.registerForm.controls['phoneNumber'].setValue('');
} 

formatPhoneNumber(event: any): void {
  let inputValue: any = this.registerForm.controls['phoneNumber'].value;
  let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
  if(phoneNumber && phoneNumber.nationalNumber) {
    this.nationalNumber = phoneNumber.nationalNumber
  }
  if (phoneNumber) {
    this.selectedPhoneNumber = phoneNumber.number;
    this.registerForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
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
    this.registerForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
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

  ngOnInit() {
    if(this.localStorageService.userDetails){
      this.confirmationBox();
      return false;
    }
    this.route.params.subscribe((params) => {
      this.isInvitedUser = false;
      this.token =
        params.token != null && params.token !== undefined ? params.token : "";
      if (this.token) {
        this.tokenNotFound = false;
        let decodedToken = atob(this.token);
        let splitToken = decodedToken.split(":");
        this.ucs_id = splitToken[3]; 
        let email = "";
        let unique_code = "";
        email = splitToken[0];
        this.applyEmail = email;
        unique_code = splitToken[1];
        if (splitToken.length > 2) {
          this.isInvitedUser = true;
          this.applyEmail = splitToken[2];
        }
        let details = {
          email: btoa(email),
          unique_code: btoa(unique_code),
        };
      
        this.getApplicationDetails(details);
        this.industry = [{ key: "", value: "Select Industry" }];
      } else {
        this.tokenNotFound = true;
      }
    });

  }
  get f() {
    return this.registerForm.controls;
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
    if (this.registerForm.value.fullname) {
      fullname = this.registerForm.value.fullname;
    }
    if (this.registerForm.value.email) {
      applyEmail = this.registerForm.value.email;
    }
    if (this.registerForm.value.phoneNumber) {
      phoneNumber = this.registerForm.value.phoneNumber;
    }
    this.submitted = true;
    let data_send = {
      fullname: fullname,
      type: this.type,
      email: applyEmail,
      mobile: phoneNumber,
      password: this.registerForm.value.password,
      organization: { org_id: this.orgId, role_name: this.type },
      unique_code: this.uniqueCode,
      ucs_id : this.ucs_id,
      country_code : this.country.dial_code,
      user_location: this.location
    };
    if (this.registerForm.invalid) {
      return;
    } else {
      this.errorMessage = "";
      this.successMessage = "";
      this.AuthenticationService.sendRegisterDetail(data_send)
        .pipe()
        .subscribe(
          (result) => {
            this.registerLoader = false;
            if (result != null) {
              this.successMessage =
                "Your The X Future membership registration is successful";
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
