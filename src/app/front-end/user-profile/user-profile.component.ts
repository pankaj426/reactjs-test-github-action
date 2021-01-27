import { ToastrService } from 'ngx-toastr';
import { FrontEndService } from './../services/front-end.service';
import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import PlaceResult = google.maps.places.PlaceResult;
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { PhoneNumberValidator } from './../../shared/services/PhoneNumberValidator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
declare var $: any;

interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {
//  @Output() publicHeaderStatusUpdate: EventEmitter<any> = new EventEmitter<any>();
@Input() publicHeaderStatusUpdate: EventEmitter<any> = new EventEmitter<any>();
productInChild=[];
  userRole:any;
  country:any;
  countryCode:any;
  newCountryCode: any;
  selectedCountry:any="IN";
  selectedPhoneNumber="";
  settingsForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;
  profileLoader: boolean = false;
  profileDetails: any = "";
  errorMessage: any = "";
  selectedUserLocation: any = "";
  submitFormLoader: boolean = false;
  countryCodes: Codes[] = environment.countries;
  fullname: any;
  fullnames: void;
  nationalNumber: any;
  closeDialog(passingValue = 0): void {
    this.dialogRef.close(passingValue);
  }
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private frontEndService: FrontEndService,
    private toaster: ToastrService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
  ) { }

  getFlags(flagName) {
    return this.commonService.getFlags(flagName);

  }
  initProfileFrm(data) {

    let fullname = '';
    let email = '';
    let phoneNumber = '';
    let userLocation = '';
    let country_code:any ;
    if (data != '') {
      fullname = data.fullname;
      email = data.email;
      phoneNumber = data.mobile;
      this.nationalNumber = data.mobile
      /* console.log(this.nationalNumber.substr(0,this.nationalNumber.indexOf(' ')) ) */
      this.nationalNumber = this.nationalNumber.substr(this.nationalNumber.indexOf(' ')+1)
      //console.log(typeof(this.nationalNumber))
      //console.log(this.nationalNumber)
      userLocation = (data.userLocation == '' && this.localStorageService.userDetails.email == email)?
          this.localStorageService.userDetails.userLocation:data.userLocation;
      }
    this.settingsForm = this.formBuilder.group({
      fullname: [fullname,
        [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern(/^((?!\s{2,}).)*$/), Validators.pattern(/^[a-zA-Z!? ]*$/) ]
      ],
      // fullname: [fullname, Validators.required],
      email: [{ value: email, disabled: true }
        /*    email,
           [Validators.required, Validators.email, Validators.minLength(5)] */
      ],
      phoneNumber: [phoneNumber,
        [Validators.required,PhoneNumberValidator(this.selectedCountry),  this._validatePhoneNumberInput.bind(this)]
      ],

      userLocation: [userLocation, [Validators.maxLength(100), Validators.minLength(3), Validators.pattern(/^((?!\s{3,}).)*$/), Validators.pattern(/^[a-zA-Z0-9,)(-.!? ]*$/) ]]
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
    //phoneNumber.replaceAll("\\s+","").replaceFirst(this.selectedCountry,"");
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
  this.settingsForm.controls['phoneNumber'].setValue('');
}
/* formatPhoneNumber(event: any): void {
  let inputValue: any = this.settingsForm.controls['phoneNumber'].value;
  let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);

  if(phoneNumber){
    this.selectedPhoneNumber = phoneNumber.number;
    this.settingsForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
} */

formatPhoneNumber(event: any): void {
  let inputValue: any = this.settingsForm.controls['phoneNumber'].value;
  let phoneNumber: any;
  if(this.newCountryCode && this.newCountryCode[0].code) {
    phoneNumber = parsePhoneNumberFromString(inputValue, this.newCountryCode[0].code);
  }else {
    phoneNumber = parsePhoneNumberFromString(inputValue, this.selectedCountry);
  }
  if(phoneNumber && phoneNumber.nationalNumber) {
    this.nationalNumber = phoneNumber.nationalNumber
  }
  if (phoneNumber) {
    this.selectedPhoneNumber = phoneNumber.number;
    this.settingsForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
}

formatPhoneNumbers(inputVal: any): void {
  let inputValue: any = inputVal;
  let phoneNumber: any;
  if(this.newCountryCode && this.newCountryCode[0].code) {
    phoneNumber = parsePhoneNumberFromString(inputValue, this.newCountryCode[0].code);
  }else {
    phoneNumber = parsePhoneNumberFromString(inputValue, this.selectedCountry);
  }
  if(phoneNumber && phoneNumber.nationalNumber) {
    this.nationalNumber = phoneNumber.nationalNumber
  }
  if (phoneNumber) {
    this.selectedPhoneNumber = phoneNumber.number;
    this.settingsForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
}





  getUserProfile() {
    this.profileLoader = true;
    this.profileDetails = "";
    this.frontEndService.getUserProfile()
      .pipe()
      .subscribe(
        (result: any) => {

          this.profileLoader = false;
          if (result.statusCode == 200) {
            this.profileDetails = result.body[0];
            this.getSelectedCountryCode(this.profileDetails.country_code).then(data=>{

              //this.selectedCountry = this.countryCode.code;
              this.selectedCountry = this.profileDetails.country_code;
            })

        //    this.selectedCountry = this.profileDetails.country_code;

              this.profileDetails['userLocation'] = this.profileDetails.userLocation;
              this.initProfileFrm(this.profileDetails);
          } else {
            this.profileLoader = false;
            this.profileDetails = "";
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.profileLoader = false;
          this.profileDetails = "";
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }

/*    getCountryCode(data){

    return new Promise(resolve=>{
       let countryCode = this.countryCodes.find(element=>{  if(element.dial_code == data){return true;}});
      resolve(countryCode);
    })
   } */

  getCountryCode(){

    this.country =   this.countryCodes.find((element)=>{ if(element.code == this.selectedCountry){return true}});


   }

  getSelectedCountryCode(code){

    return new Promise(resolve=>{
      this.countryCode =   this.countryCodes.find((element)=>{ if(element.dial_code == code){return true}});
      resolve("data");
    })
   }
  ngOnInit() {
    this.initProfileFrm('');
    this.getUserProfile();
    console.log(this.localStorageService.userDetails);
    //console.log(this.countryCode)
    //console.log(this.selectedCountry)
    //console.log(this.countryCodes)

    this.newCountryCode = this.countryCodes.filter(x => x.code == this.selectedCountry) 
    console.log(this.newCountryCode)
  }
  makeEabelDisableForm(name, flag) {
    if (flag == "enable") {
      this.settingsForm.controls[name].enable();
      $('#' + name).focus();
    } else if (flag == "disable") {
      this.settingsForm.controls[name].disable();
    }
  }
  updateDetails() {
    this.submitFormLoader = true;
    if (this.settingsForm.invalid) {
      this.submitFormLoader = false
      return;
    } else {
      let countryCd;
    //  this.getCountryCode(this.selectedCountry).then(res=>{
      this.getCountryCode();
        //countryCd = res;
        let frmValue = this.settingsForm.value;
        let name = ""; let mobile = ""; let userLocation = ""; let email = this.profileDetails.email;
      //  let country_code = countryCd.dial_code;
        name = frmValue.fullname != null ? frmValue.fullname : this.profileDetails.fullname;

        mobile = frmValue.phoneNumber;
        userLocation = frmValue.userLocation
        if (this.selectedUserLocation != '') {
          userLocation = this.selectedUserLocation;
        }
        let data = {
          "name": name.trim(),
          "mobile": mobile.trim(),
          "userLocation": userLocation.trim(),
          "email": email.trim(),
          "country_code":this.selectedCountry
        };

        this.frontEndService
          .userUpdate(data)
          .pipe()
          .subscribe(
            (result: any) => {

              this.submitFormLoader = false;
              if (result.statusCode == 200) {
                localStorage.setItem("fullname", JSON.stringify(data.name));
               // this.publicHeaderStatusUpdate.emit(data.name);
            //    this.productInChild[data.name];
        //      if( document.getElementById("headename") !=null){

        //         document.getElementById("headename").innerHTML = data.name;
        //         document.getElementById("fsplitname").innerHTML = data.name.split(' ')[0].substr(0,1);
        //         if( data.name.split(' ')[1]!=undefined){
        //         document.getElementById("lsplitname").innerHTML = data.name.split(' ')[1].substr(0,1);
        //      }
        //     }
        //      if( document.getElementById("headeditename") !=null){

        //       document.getElementById("headeditename").innerHTML = data.name;
        //       document.getElementById("f2splitname").innerHTML = data.name.split(' ')[0].substr(0,1);
        //       if(data.name.split(' ')[1]==undefined)
        //       {
        //         document.getElementById("l2splitname").innerHTML='';
        //       }
        //       if( data.name.split(' ')[1]!=undefined)
        //       {
        //       document.getElementById("l2splitname").innerHTML = data.name.split(' ')[1].substr(0,1);
        //    }
        //  }

                this.dialogRef.close();
                window.location.reload();
                this.toaster.success(result.message, "", {
                  timeOut: 2000,

                }
                );
              } else {
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
                this.toaster.error(this.errorMessage, "", {
                  timeOut: 2000,
                });
              }
            },
            (error: any) => {
              this.submitFormLoader = false;
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
   //   });


    }
  }
  onAutocompleteLocationSelected(result: PlaceResult) {
    this.selectedUserLocation = result["address_components"];
  }
  onLocationSelected(location: Location) {
  }
  get f() {
    return this.settingsForm.controls;
  }

}
