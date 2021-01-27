import { CommonService } from './../../shared/services/common.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { PhoneNumberValidator } from './../../shared/services/PhoneNumberValidator';
/* import { } from '@types/googlemaps'; */
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidatorFn,
  FormControl,
} from "@angular/forms";
import { SessionStorageService } from "../../shared/services/session-storage.service";
import { RouterService } from "../../shared/services/router.service";
import { orgStatus, orgTypes } from "../../shared/constants/enum";
import { environment } from "../../../environments/environment";
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FrontEndService } from 'src/app/front-end/services/front-end.service';
import { ToastrService } from 'ngx-toastr';
import { noWhitespaceValidator,  } from 'src/app/shared/models/no-whitespace-validator';
//countryCodes
//countries =environment.services.

/* interface Industries {
  key: string;
  value: string;
} */
interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: "app-startup-application-form",
  templateUrl: "./startup-application-form.component.html",
  styleUrls: ["./startup-application-form.component.scss"],
})
export class StartupApplicationFormComponent implements OnInit {
  @ViewChild('industrySelect') industrySelect: any;
  attachmentsArrayEnv = environment.attachmentsArray;
  country:any;
  logo = [
    { title: "Logo", attachments: [ {details:"",doc_name:"", uploaded:false}], error: false, errorMsg: "", id: 1, uploaded:false }];
    uploadResLoader = false;
  public errorMessage: string = "";
  public successMessage: string = "";
  private orgStatus = orgStatus;
  private orgTypes = orgTypes;
  startUpform: FormGroup;
  submitted = false;
  submitValue = {};
  selectedCountry;
  selectedPhoneNumber = "";
  returnUrl: string;
  genricError = false;
  startupLoader = false;
  images = [];
  uploadingImage = [];
  id: any;
  moreLinkedInField = 0;
  uploadImages() { }
  public selectedAddress: PlaceResult;
  selectedUserLocation: any = '';
  selectedstartupLocation: any = '';
  paidCustomers:string;
  paidCustomersGreaterRevenue:string;
  annualRecurringRevenue:string;
  patentDetails:string;
  custmersPOC:string;
  pilotProjects:string;
  otherInformation:string;
  applicantEmailsField :any = [];
  dpss = false;
  getFlags(flagName) {
    return this.commonService.getFlags(flagName);

  }
  hideSeletePanel() {
    this.industrySelect.close();
  }
  countryCodes: Codes[] = environment.countries;
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
  industry: any = "";
  constructor(
    private localStorageService: LocalStorageService,
    private frontEndService: FrontEndService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private AuthenticationService: AuthenticationService,
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private commonService: CommonService
  ) { }
  onAutocompleteLocationSelected(result: PlaceResult, type = "user") {
    if (type == "user") {
      this.selectedUserLocation = result["address_components"];
    }
    if (type == "startup") {
      this.selectedstartupLocation = result["address_components"];;
    }
  }
  onLocationSelected(location: Location, type = "user") {
    if (type == "user") {

    }
  }


  public attachmentsArray = [];
  initAttachment() {
    this.attachmentsArray = this.attachmentsArrayEnv
  }
  fileUpoadTest: File = null;
  uploadFileToActivity(fileUpoadTest, index) {
    this.attachmentsArray[index]["error"] = false;
    this.attachmentsArray[index]["errorMsg"] = "";
    let attachedData = {
      doc_name: null,
      ext: null,
      uploding: true,
      uploaded: false,
      details: null,
    };


    this.attachmentsArray[index]["attachments"].push(attachedData);
    let lastinsetedDataIndex =
      this.attachmentsArray[index]["attachments"].length - 1;

    setTimeout(() => {
      let doc_name = fileUpoadTest.name;

      let fileExt = doc_name;
      let ext = fileExt.split(".").pop();

      const formData: FormData = new FormData();

      formData.append("file", fileUpoadTest, doc_name);
      formData.append("title", this.attachmentsArray[index]["title"]);
      formData.append("category", "attachments");

      this.AuthenticationService.uploadDocs(formData).subscribe(
        (data: any) => {
          this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
            "uploding"
          ] = false;
          if (data.statusCode == 200) {
            this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
              "details"
            ] = data.body[0];
            this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
              "doc_name"
            ] = doc_name;
            this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
              "ext"
            ] = ext;
            this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
              "uploaded"
            ] = true;
          } else {
            this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
              "uploaded"
            ] = false;
            this.attachmentsArray[index]["error"] = true;
            this.attachmentsArray[index]["errorMsg"] = data.message;
          }
          // do something, if upload success
        },
        (error) => {
          this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
            "uploding"
          ] = false;
          this.attachmentsArray[index]["attachments"][lastinsetedDataIndex][
            "uploaded"
          ] = false;
          this.attachmentsArray[index]["error"] = true;
          this.attachmentsArray[index]["errorMsg"] = error.error.message;
        }
      );
    }, 500);
  }

  isAllDocUploaded() {
    let errorCounter = 0;
    for (let jk = 0; jk < this.attachmentsArray.length; jk++) {
      if (this.attachmentsArray[jk]["attachments"].length < 1) {
        this.attachmentsArray[jk]["error"] = true;
        this.attachmentsArray[jk]["errorMsg"] =
          this.attachmentsArray[jk]["title"] + " is required";
        errorCounter++;
      }
    }
    if (errorCounter > 0) {
      return false;
    } else {
      ``;
      return true;
    }
  }

  handleFileInput(files: FileList, index) {
    this.fileUpoadTest = files.item(0);
    if (this.fileUpoadTest) {
      const file = this.fileUpoadTest;
      if (this.commonService.chkValidFileExt(file)) {
        if (file.size > 20971520) {
          this.attachmentsArray[index]["error"] = true;
          this.attachmentsArray[index]["errorMsg"] =
            "Your upload file size is too big!";
        } else {
          let isVideoFileValidationError: boolean = false;
          if (this.attachmentsArray[index]["id"] == 3) {


            if (!this.commonService.isVideoFile(file)) {


              isVideoFileValidationError = true; this.attachmentsArray[index]["error"] = true;
              this.attachmentsArray[index]["errorMsg"] =
                "Only video files are acceptable!";
            } else {

              if (file.size > 61440000) {
                isVideoFileValidationError = true;
                this.attachmentsArray[index]["error"] = true;
                this.attachmentsArray[index]["errorMsg"] =
                  "Your upload file size is too big!";
              }else{
                isVideoFileValidationError = false;
              }  }
          } else {
            isVideoFileValidationError = false;
          }
          if (!isVideoFileValidationError) {
            this.uploadFileToActivity(this.fileUpoadTest, index);
          }

        }
      } else {
        this.attachmentsArray[index]["error"] = true;
        this.attachmentsArray[index]["errorMsg"] =
          "Please uplad file with valid extensions.!";
      }
    }
  }

  handleLogoInput(files) {

   let fileUpoadTest = null;
    fileUpoadTest = files.item(0);
    if (fileUpoadTest) {
      let file = fileUpoadTest;
      if (this.commonService.chkValidImageFileExt(file)) {
        if (file.size > 200000) {
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
        this.toaster.error("Please upload image only.!", "", {
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
        if (data.statusCode == 200) {
            this.logo[0]["attachments"][0][
              "details"
            ] = data.body[0];
            this.logo[0]["attachments"][0][
              "doc_name"
            ] = doc_name;
            this.logo[0]["attachments"][0][
              "uploaded"
            ] = true;
        } else {

          this.logo[0].error = true;
          this.logo[0].errorMsg = "Something went wrong. Please try after sometime.";

        }
      },
      (error) => {
        this.fileUpoadTest = null;
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

  deleteLogo(){
    this.logo[0]['attachments']=[];
    this.logo[0].uploaded = false;
  }
  deleteAnArray(index, ai) {
    this.attachmentsArray[index]["attachments"].splice(ai, 1);
    this.attachmentsArray[index]["attachments"][ai]["uploding"] = false;
    this.attachmentsArray[index]["attachments"][ai]["uploaded"] = false;
  }


  foundersLinkedInFields : any = [];
  problemSolvingfields: any = [];
  solutionProvidefields: any = [];
  currentPayingClientsfields: any = [];
  fetchMasterType: any = 'getCountries';
  countryLoader: boolean = false;
  countries: any = [];
  states: any = [];
  statesLoader: boolean = false;
  maxField: any = 5;
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
  /* getCountries() {
    this.countries = [];
    this.AuthenticationService
      .getMasters(this.fetchMasterType, '')
      .pipe()
      .subscribe(
        (result: any) => {
          this.countryLoader = false;
          if (result.message == "success") {
            this.countries = result.body;
          } else {
            this.countries = [];
          }
        },
        (error: any) => {
          this.countryLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.countries = [];
          } else {
            this.countries = [];
          }
        }
      );

  } */
  redirectToLogin() {
    this.routerService.RedirectToLogin();
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        let id = params.id
        this.id = id ? id : "";
      } else {
        this.routerService.redirectToStartUpApplicationAppy();
      }
    });
    this.attachmentsArrayEnv = environment.attachmentsArray;
    this.initAttachment();
    this.industry = [{ key: "", value: "Select Industry" }];

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.startUpform = this.formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(80), Validators.minLength(3),]],
      //startupLocation: ["", Validators.required],
      //fullname: ["", Validators.required],
      description: ["",[Validators.required,Validators.maxLength(500), Validators.minLength(3),Validators.pattern(/^((?!\s{2,}).)*$/)]],
      //phoneNumber: ["", [Validators.required,PhoneNumberValidator(this.selectedCountry),  this._validatePhoneNumberInput.bind(this)]],

      //industry: [this.industry, Validators.required],
      //userLocation: ["", Validators.required],
      /*  country: ["", Validators.required],
       state: ["", Validators.required], */
      applicant_email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      website: ["", [Validators.required, Validators.pattern(reg)]],
      //problemSolving: this.formBuilder.array([]),
      //solutionProvide: this.formBuilder.array([]),
      //currentPayingClients: this.formBuilder.array([]),
      //knowAboutCorpGini: ["", Validators.required],
      foundersLinkedIn :this.formBuilder.array([]),
      paidCustomers: ["", Validators.compose([Validators.required])],
      paidCustomersGreaterRevenue: ["", Validators.compose([Validators.required])],
      annualRecurringRevenue: ["", Validators.required],

      patentDetails: ["", Validators.compose([Validators.required,Validators.maxLength(500), Validators.minLength(3),noWhitespaceValidator])],
      custmersPOC:["", Validators.compose([Validators.required,Validators.maxLength(500), Validators.minLength(3)])],
      pilotProjects:["", Validators.compose([Validators.required,Validators.maxLength(500), Validators.minLength(3)])],
      otherInformation:["",[Validators.required,Validators.maxLength(500), Validators.minLength(3)]],
    });
    this.addmore("","foundersLinkedIn");
    this.getIndustries()
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
  this.startUpform.controls['phoneNumber'].setValue('');
}
formatPhoneNumber(event: any): void {
  let inputValue: any = this.startUpform.controls['phoneNumber'].value;
  let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);

  if(phoneNumber){
    this.selectedPhoneNumber = phoneNumber.number;
    this.startUpform.controls['phoneNumber'].setValue(phoneNumber.formatInternational());
  }
}
  get f() {
    return this.startUpform.controls;
  }

  /*  onChangeCountry(countryId: any) {
     if (countryId) {
       this.states = [];
       this.fetchMasterType = 'getStates'
       this.AuthenticationService
         .getMasters(this.fetchMasterType, countryId)
         .pipe()
         .subscribe(
           (result: any) => {
             this.statesLoader = false;
             if (result.message == "success") {
               this.states = result.body;
             } else {
               this.states = [];
             }
           },
           (error: any) => {
             this.statesLoader = false;
             if (error.error.message != null && error.error.message != "") {
               this.states = [];
             } else {
               this.states = [];
             }
           }
         );
     } else {
       this.states = [];
     }
   } */
  get problemSolving() {
    return this.startUpform.get('problemSolving') as FormArray;
  }
  get solutionProvide() {
    return this.startUpform.get('solutionProvide') as FormArray;
  }
  get currentPayingClients() {
    return this.startUpform.get('currentPayingClients') as FormArray;
  }
  get foundersLinkedIn() {
    return this.startUpform.get('foundersLinkedIn') as FormArray;
  }
  insertAt(array, index, elements) {
    array.splice(index, 0, ...elements);
  }
  /* addmore(item, fieldName  ) {
    if(this.foundersLinkedInFields.length > 4){
      this.toaster.error("", "Maximum five linkedIn links are allowed.", {
        timeOut: 2000,

      }
      );
      return;
    }
    if (fieldName == "foundersLinkedIn") {
      this.foundersLinkedInFields.push(item);
    }
    const control = <FormArray>this.startUpform.get(fieldName);
    //control.push(this.patchValues(item))
    control.insert(this.foundersLinkedInFields, this.patchValues(item));
    this.moreLinkedInField ++;
  } */

  addmore(item, fieldName) {
    const fixVal = this.foundersLinkedIn.controls.length + 1
    if(fixVal >= 6){
      this.toaster.error("", "Maximum five linkedIn links are allowed.", {
        timeOut: 2000,
      }
      );
      return;
    }
    if(fixVal <= 5 ) {
/*       this.moreLinkedInField = this.orgProfile.founder_linkedin_profiles.length;
    this.checklenth = this.applicantEmailsField.length +  this.moreLinkedInField; */
    if (fieldName == "linkedInProfile") {
      this.applicantEmailsField.push(item);
    }
    const control = <FormArray>this.startUpform.get(fieldName);
    //control.push(this.patchValues(item))
    control.insert(this.applicantEmailsField, this.patchValues(item));
    this.moreLinkedInField ++;
    console.log(this.moreLinkedInField)
    }
  }
  patchValues(value) {
    return this.formBuilder.control(value)
  }
  remove(index, fieldName = "problemSolving") {
    if (fieldName == "foundersLinkedIn") {
      this.foundersLinkedInFields.splice(index, 1);
      this.foundersLinkedIn.removeAt(index);
    }
    if (fieldName == "problemSolving") {
      this.problemSolvingfields.splice(index, 1);
      this.problemSolving.removeAt(index);
    }
    if (fieldName == "solutionProvide") {
      this.solutionProvidefields.splice(index, 1);
      this.solutionProvide.removeAt(index);
    }
    if (fieldName == "currentPayingClients") {
      this.currentPayingClientsfields.splice(index, 1);
      this.currentPayingClients.removeAt(index);
    }

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
      this.startupLoader =false;
    } else {
      this.genricError = true;
      this.startupLoader =false;
    }
    return this.genricError;
  }

  getCountryCode(){

    this.country =   this.countryCodes.find((element)=>{ if(element.code == this.selectedCountry){return true}});


   }
  submit() {
    //this.getCountryCode();
    this.submitted = true;
    this.startupLoader= true;
    let frm = this.startUpform.value;

    //let countryCode = this.country.dial_code;
    let userLocation = "";
    let startupLocation = "";
    if (this.selectedUserLocation != '') {
      userLocation = this.selectedUserLocation;
    }
    if (this.selectedstartupLocation != '') {
      startupLocation = this.selectedstartupLocation;
    }
    let email = frm.applicant_email;
    let domain = email.replace(/.*@/, "");
    let type = this.orgTypes.startups;
    let mobileNumber =
      /*     frm.countryCode.dial_code + */
      "";
    let status = this.orgStatus.approvalPending;
    /*  frm["type"] = type;
     frm["status"] = status;
     frm["domain"] = domain; */
    // stop here if form is invalid

    let data_send = {
      usc_id: this.id,
      name: frm.name,
      fullname: "",
      type:type,
      mobile_number:"",
      industry: "",
      email: frm.applicant_email,
      website: frm.website,
      description: frm.description,
      data: "",
      logo: "",

      domain: domain,

      status: status,

      founder_linkedin_profiles: frm.foundersLinkedIn,
      additional_fields: {
        Problem_your_startup_is_solving: "",
        Solution_your_startup_is_providing: "",
        Current_Paying_Clients: "",
        How_did_you_come_to_know_about_CorpGini: "",
        /*  city: frm.city, */
        country_code: "",
        /*country: frm.country,
        state: frm.state, */
        userLocation: "",
        orgLocation: "",

        paidCustomers: frm.paidCustomers.trim,
        paidCustomersGreaterRevenue:frm.paidCustomersGreaterRevenue,
        annualRecurringRevenue:frm.annualRecurringRevenue,
        patentDetails:frm.patentDetails.trim(),
        custmersPOC:frm.custmersPOC.trim(),
        pilotProjects:frm.pilotProjects.trim(),
        otherInformation:frm.otherInformation.trim(),
      }
    };
    if ( frm.otherInformation=="" ||frm.custmersPOC=="" ||frm.otherInformation==""||frm.otherInformation=="") {
      this.startupLoader =false;
      return;
    }
    if (
      this.startUpform.invalid ||
      this.isGenericEmail(email) == true
    ) {
     this.startupLoader =false;
      return;
    }

    else {
      this.AuthenticationService.applicationForm(data_send)
        .pipe()
        .subscribe(
          (result) => {
            this.startupLoader = false;
            this.initAttachment();
            if (result != null) {
              this.successMessage = result.message;
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            this.initAttachment();
            this.startupLoader = false;
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

  AcceptsAlphabets(event: any) {

    const pattern = /^[A-z]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  stringify(obj)
  {
    return JSON.stringify(obj.errors);
  }

  showInfobox() {
    this.dpss = !this.dpss
    var element = document.getElementById("dpss_text");
    setTimeout(() => {
      if (this.dpss) {
        var h = document.getElementById('someDiv').offsetHeight;
        h = h + 35
        if (h) {
          element.style.setProperty("padding-top", + h + "px", "important");
        }
      } else {
        element.style.removeProperty('padding-top');
      }
    }, 200);
  }



}
