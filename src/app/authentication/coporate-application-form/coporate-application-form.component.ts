import { Component, OnInit, ViewChild } from "@angular/core";
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
import { orgStatus, orgTypes } from "../../shared/constants/enum";
import { CommonService } from '../../shared/services/common.service';
import { environment } from "../../../environments/environment";
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { FrontEndService } from 'src/app/front-end/services/front-end.service';
import { ToastrService } from 'ngx-toastr';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { PhoneNumberValidator } from './../../shared/services/PhoneNumberValidator';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
/* interface Industries {
  key: string;
  value: string;
} */
interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: "app-coporate-application-form",
  templateUrl: "./coporate-application-form.component.html",
  styleUrls: ["./coporate-application-form.component.scss"],
})
export class CoporateApplicationFormComponent implements OnInit {
  @ViewChild('industrySelect') industrySelect: any;
  public baseUrl = environment.services.files.downloadAttachments;
  country: any;
  logo = [
    { title: "Logo (png, jpg, jpeg of max size 1 MB)", attachments: [{ details: "", doc_name: "", uploaded: false }], error: false, errorMsg: "", id: 1, path: "", doc_name: "", uploaded: false }];
  uploadResLoader = false;
  public errorMessage: string = "";
  public successMessage: string = "";
  private orgStatus = orgStatus;
  private orgTypes = orgTypes;
  corporateForm: FormGroup;
  ucsId: any = "";
  submitted = false;
  filetitle: any = [];
  returnUrl: string;
  genricError = false;
  corporateLoader = false;
  selectedCountry;
  selectedPhoneNumber;
  submitFormLoader: boolean = false;
  data = { dataObject: [] };
  nationalNumber: any;
  industries: any = [
    { key: "retail", value: "Retail" },
    { key: "tex_fas_jew", value: "Textile Fashion Jewelry" },
    { key: "manufacturing", value: "Manufacturing (Industry 4.0)" },
    { key: "agri_food", value: "Agriculture and Food" },
    { key: "finacialTech", value: "financial Technology" },
    { key: "infra_const", value: "Infra & Construction" },
    { key: "pharma_healt", value: "Pharma & HealthCare" },
    { key: "others", value: "Others" },
  ];
  public selectedAddress: PlaceResult;
  selectedUserLocation: any = '';
  selectedCorpLocation: any = '';
  onAutocompleteLocationSelected(result: PlaceResult, type = "user") {
    if (type == "user") {
      this.selectedUserLocation = result["address_components"];
    }
    if (type == "corp") {
      this.selectedCorpLocation = result["address_components"];
    }
  }
  onLocationSelected(location: Location, type = "user") {
    if (type == "user") {

    }
  }
  fileUpoadTest: File = null;
  handleLogoInput(files) {
    this.fileUpoadTest = null;
    this.fileUpoadTest = files.item(0);
    if (this.fileUpoadTest) {
      let file = this.fileUpoadTest;
      if (this.commonService.chkValidImageFileExt(file)) {
        if (file.size > 1048576) {
          this.toaster.error("Your upload file size is too big!", "", {
            timeOut: 3000,
          });
        } else {
          if (this.commonService.isValidResourceFile(file)) {
            this.uploadResources(file);
          } else {
            this.toaster.error("Only image,pdf and video files are acceptable!", "", {
              timeOut: 3000,
            });
          }

        }
      } else {
        this.toaster.error("Please upload image file only.!", "", {
          timeOut: 3000,
        });
      }
    }
  }

  uploadResources(fileUpoadTest) {

    this.logo[0].error = false;
    this.logo[0].errorMsg = "";
    this.uploadResLoader = true;
    let errorMessage = "";
    let doc_name = fileUpoadTest.name;
    const formData: FormData = new FormData();
    let size = this.frontEndService.formatBytes(fileUpoadTest.size);
    formData.append("file", fileUpoadTest, doc_name);
    formData.append("title", this.logo[0]["title"]);
    formData.append("category", "attachments");
    this.AuthenticationService.uploadDocs(formData).subscribe(
      (data: any) => {
        this.uploadResLoader = false;
        this.logo[0]["uploaded"] = true;
        this.fileUpoadTest = null;
        if (data.statusCode == 200) {
          this.logo[0].path = data.body[0].path.substring(1);
          // this.logo[0]["attachments"][0]["details"]= data.body[0];
          window["document"]["querySelector"]('[type=file]')["value"] = '';
          this.logo[0].doc_name = doc_name;
          this.logo[0]["attachments"][0][
            "uploaded"
          ] = true;
          this.filetitle = data.body[0].file;
        } else {

          this.logo[0].error = true;
          this.logo[0].errorMsg = "Something went wrong. Please try after sometime.";

        }
      },
      (error) => {
        this.uploadResLoader = false;
        this.logo[0].error = true;

        if (error.error.message != null && error.error.message != "") {
          this.logo[0].errorMsg = error.error.message;
        } else {
          this.logo[0].errorMsg = "Something went wrong. Please try after sometime.";

        }
      }
    );
  }
  deleteLogo() {
    this.logo[0]['attachments'] = [];
    this.logo[0].doc_name = '';
    this.logo[0].uploaded = false;
  }

  getFlags(flagName) {
    return this.commonService.getFlags(flagName);

  }

  getCountryCode() {

    this.country = this.countryCodes.find((element) => { if (element.code == this.selectedCountry) { return true } });


  }
  countryCodes: Codes[] = environment.countries;
  industry: any = "";
  constructor(
    private frontEndService: FrontEndService,
    private toaster: ToastrService,
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
  industriesLoaders: boolean = false;

  getIndustries() {
    this.industriesLoaders = true;
    this.industries = [];
    let data = { type: 'industries' };
    this.AuthenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.industriesLoaders = false;
          if (result.statusCode == 200) {
            this.industries = result.body;
          } else {
            this.industries = [];
          }
        },
        (error: any) => {
          this.industriesLoaders = false;
          if (error.error.message != null && error.error.message != "") {
            this.industries = [];
          } else {
            this.industries = [];
          }
        }
      );

  }
  // private checkGenricEmaillValidaion(group: FormGroup) {
  //   // here we have the 'passwords' group
  //   let applicant_email = group.controls.applicant_email.value;

  //   let notAllowedGenericEmail = [
  //     "yahoo",
  //     "gmail",
  //     "mailinator",
  //     "live",
  //     "rediffmail",
  //   ];
  //   let erro = false;

  //   for (let i = 0; i < notAllowedGenericEmail.length; i++) {
  //     if (applicant_email.includes(notAllowedGenericEmail[i])) {
  //       erro = true;
  //       break;
  //     } else {
  //       erro = false;
  //     }
  //   }

  //   return { isGenric: erro };
  // }
  redirectToLogin() {
    this.routerService.RedirectToLogin();
  }
  hideSeletePanel() {
    this.industrySelect.close();
  }
  ngOnInit() {
    this.industry = [{ key: "", value: "Select Industry" }];
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    this.corporateForm = this.formBuilder.group(
      {
        name: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^((?!\s{2,}).)*$/)]],
        fullname: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^((?!\s{2,}).)*$/), Validators.pattern(/^[a-zA-Z0-9!? ]*$/), Validators.pattern(/^[a-z A-Z]*$/)]],
        phoneNumber: ["", [Validators.required, PhoneNumberValidator(this.selectedCountry), this._validatePhoneNumberInput.bind(this)]],
        industry: [this.industry, Validators.required],
        applicant_email: [
          "",
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        website: ["", [Validators.required, Validators.pattern(reg)]],
        userLocation: ["", Validators.required],
        corporateLocation: ["", Validators.required]
        //recaptcha: ["", Validators.required],
      }
      // { validator: this.checkGenricEmaillValidaion }
    );
    this.getIndustries();
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
    let phoneNumber: any = parsePhoneNumberFromString(inputValue);
    if (phoneNumber) {
      if (phoneNumber.isValid()) {
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
    } return phoneNumber;
  }

  resetPhoneNumber(event: any): void {
    this.corporateForm.controls['phoneNumber'].setValue('');
  }
  formatPhoneNumber(event: any): void {
    let inputValue: any = this.corporateForm.controls['phoneNumber'].value;
    let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
    if(phoneNumber && phoneNumber.nationalNumber) {
      this.nationalNumber = phoneNumber.nationalNumber
    }
    if (phoneNumber) {
      this.selectedPhoneNumber = phoneNumber.number;
      this.corporateForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
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
      this.corporateForm.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
    }
  }

  get f() {
    return this.corporateForm.controls;
  }

  isGenericEmail(email): boolean {
    let checkEmail = email.replace(/.*@/, "");
    let notAllowedGenericEmail = [
      "yahoo.com",
      "gmail.com",
      "mailinator.com",
      "live.com",
      "rediffmail.com",
    ];

    if (notAllowedGenericEmail.indexOf(checkEmail) == -1) {
      this.genricError = false;
      this.corporateLoader = false;
      return false;

    } else {
      this.genricError = true;
      this.corporateLoader = false;
      return true;
    }

  }
  industryError: boolean = false;
  isPending: boolean = false;
  onSubmit() {
    this.corporateLoader = true;
    this.getCountryCode();

    let frm = this.corporateForm.value;

    let countryCode = this.country?this.country.dial_code:'';
    this.submitted = true;
    this.industryError == false;
    let email = frm.applicant_email;
    let domain = email.replace(/.*@/, "");
    let type = this.orgTypes.corporate;
    let status = this.orgStatus.approvalPending;
    /* this.corporateForm.value["type"] = type;
    this.corporateForm.value["status"] = status;
    this.corporateForm.value["domain"] = domain; */
    let userLocation = frm.userLocation;
    let corporateLocation = frm.corporateLocation;
    if (this.selectedUserLocation != '') {
      userLocation = this.selectedUserLocation;
    }
    if (this.selectedCorpLocation != '') {
      corporateLocation = this.selectedCorpLocation;
    }
    if (frm.industry.length > "0") {
      if (frm.industry.length == "1") {
        if (frm.industry[0]["key"] == "") {
          this.industryError = true;
          this.corporateLoader = false;
        } else {
          this.isPending = true;
          this.industryError = false;
          this.corporateLoader = true;
        }
      } else {
        this.isPending = true;
        this.industryError = false;
        this.corporateLoader = true;
      }
    } else {
      this.industryError = true;
    }
    if (this.isPending == true) {
      let data_send = {
        name: frm.name,
        fullname: frm.fullname,
        type: type,
        email: frm.applicant_email,
        website: frm.website,
        mobile_number: frm.phoneNumber,
        industry: frm.industry,
        domain: domain,
        description: null,
        data: null,
        status: status,
        logo: this.logo,
        additional_fields: {
          Problem_your_startup_is_solving: null,
          Solution_your_startup_is_providing: null,
          Current_Paying_Clients: null,
          How_did_you_come_to_know_about_CorpGini: null,
          countryCode: countryCode,
          /*  country: frm.country,
           state: frm.state, */
          userLocation: userLocation,
          orgLocation: corporateLocation
        },
      };
      // stop here if form is invalid
      this.AuthenticationService.makeFormTouched(this.corporateForm);
      if (this.corporateForm.invalid) {
        this.corporateLoader = false;
        return;
      } else {
        if (!this.isGenericEmail(email)) {
          this.errorMessage = "";
          this.successMessage = "";
          this.AuthenticationService.applicationForm(data_send)
            .pipe()
            .subscribe(
              (result) => {
                this.corporateLoader = false;
                if (result != null) {
                  this.successMessage = result.message;
                } else {
                  this.errorMessage =
                    "Something went wrong. Please try after sometime.";
                }
              },
              (error: any) => {
                this.corporateLoader = false;
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



  }
}
