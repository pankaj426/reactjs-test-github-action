import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../shared/services/common.service';
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "../../authentication/services/authentication.service";

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
import { orgStatus, orgTypes, userRoles } from "../../shared/constants/enum";
import { environment } from "../../../environments/environment";
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { FrontEndService } from './../services/front-end.service';
import PlaceResult = google.maps.places.PlaceResult;
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { RouterService } from 'src/app/shared/services/router.service';
import { Global } from 'src/app/shared/models/global.model';

interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: 'app-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})
export class OrgProfileComponent implements OnInit,AfterViewInit{

  @ViewChild('industrySelect') industrySelect: any;

  public baseUrl = environment.services.files.downloadAttachments;
  public attachmentsArrayEnv = environment.attachmentsArray;
  donwnloadPath = environment.services.files.downloadAttachments;
  userId = this.localStorageService.userDetails._id;
  logo = [
    { title: "Logo", attachments: [ {details:"",doc_name:"", uploaded:false}], error: false, errorMsg: "", id: 1, uploaded:false,path:"" , doc_name:""}];
    uploadResLoader = false;
  public errorMessage: string = "";
  public successMessage: string = "";
  private orgStatus = orgStatus;
  public orgTypes = orgTypes;
  public selectedOrgType = "";
  public userSelectedRoles = this.localStorageService.userDetails.roles;
  startUpform: FormGroup;
  submitted = false;
  submitValue = {};
  returnUrl: string;
  genricError = false;
  startupLoader = false;
  images = [];
  uploadingImage = [];
  checklenth: any;
  uploadImages() { }
  moreLinkedInField = 0;
  public selectedAddress: PlaceResult;
  selectedUserLocation: any = '';
  selectedstartupLocation: any = '';
  orgProfile: any = ""
  userRoles = userRoles
  dpss = false
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
  orgProfileLoader: boolean = false;
  getOrgProfile() {
    this.orgProfileLoader = true;
    this.orgProfile = "";
    this.frontEndService
      .getOrgProfile()
      .pipe()
      .subscribe(
        (result: any) => {
          this.orgProfileLoader = false;
          if (result.statusCode == 200) {
            this.getIndustries();
            this.orgProfile = result.body[0];
            this.selectedOrgType = this.orgProfile.type;
            let formData = this.orgProfile;
            this.initStatupForm(formData)
          } else {
            this.orgProfile = "";
          }
        },
        (error: any) => {
          this.orgProfileLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.orgProfile = "";
          } else {
            this.orgProfile = "";
          }
        }
      );

  }
  constructor(
    private sessionStorageService: SessionStorageService,
    private routerService: RouterService,
    private formBuilder: FormBuilder,
    private AuthenticationService: AuthenticationService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private frontEndService: FrontEndService,
    private toaster: ToastrService,
    private global: Global,
  ) { }
  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
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
    if (this.selectedOrgType == this.orgTypes.corporate) {
      return true;
    } else {
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
        return true;
      }
    }

  }
  isVideoFile(file: File): boolean {
    let _validFileExtensions = [
      "mp3",
      "wmv",
      "mp4",
      "avi",
      "flv",
      "mov",
      "webm",
      "mkv",
      "vob",
      "ogg",
      "ogv",
      "m4p",
      "m4v",
      "mpg",
      "mp2",
      "mpeg",
      "mpe",
      "3gp",
      "3g2"
    ];
    let doc_name = file.name;
    let fileExt = doc_name;
    let ext = fileExt.split(".").pop();
    return _validFileExtensions.includes(ext);
  }
  handleFileInput(files: FileList, index) {
    var _validFileExtensions = [
      "docm",
      "dotm",
      "dotx",
      "odt",
      "rtf",
      "txt",
      "csv",
      "xls",
      "xlsb",
      "xlsx",
      "mp3",
      "jpg",
      "jpeg",
      "bmp",
      "gif",
      "png",
      "ppt",
      "pptx",
      "rtf",
      "pdf",
      "wmv",
      "doc",
      "docx",
      "mp4",
      "avi",
      "flv",
      "txt",
      "mov"
    ];
    this.fileUpoadTest = files.item(0);
    if (this.fileUpoadTest) {
      const file = this.fileUpoadTest;
      let doc_name = file.name;

      let fileExt = doc_name;
      let ext = fileExt.split(".").pop();

      if (_validFileExtensions.includes(ext)) {
        if (file.size > 20971520) {
          this.attachmentsArray[index]["error"] = true;
          this.attachmentsArray[index]["errorMsg"] =
            "Your upload file size is too big!";
        } else {
          let isVideoFileValidationError: boolean = false;
          if (this.attachmentsArray[index]["id"] == 3) {
            if (!this.isVideoFile(file)) {
              isVideoFileValidationError = true; this.attachmentsArray[index]["error"] = true;
              this.attachmentsArray[index]["errorMsg"] =
                "Only video files are acceptable!";
            } else { isVideoFileValidationError = false; }
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

  deleteAnArray(index, ai) {
    this.attachmentsArray[index]["attachments"].splice(ai, 1);
    this.attachmentsArray[index]["attachments"][ai]["uploding"] = false;
    this.attachmentsArray[index]["attachments"][ai]["uploaded"] = false;
  }

  applicantEmailsField :any = [];
  problemSolvingfields: any = [];
  solutionProvidefields: any = [];
  currentPayingClientsfields: any = [];
  fetchMasterType: any = 'getCountries';
  countryLoader: boolean = false;
  countries: any = [];
  states: any = [];
  statesLoader: boolean = false;
  maxField: any = 5;

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
  removeMatSelected(index, fieldName = 'industry') {
    let formValue = this.startUpform.get(fieldName).value;
    formValue.splice(index, 1);
    this.startUpform.get(fieldName).setValue(formValue);

  }
  formatAddress(address) {
    let address_components = address;/* [{ long_name: "Jaipur", short_name: "Jaipur" },
    { long_name: "Jaipur", short_name: "Jaipur" },
    { long_name: "Rajasthan", short_name: "RJ" },
    { long_name: "India", short_name: "IN" }
    ]; */
    let formatedAddress = ""
    if (address_components.length > 0) {
      formatedAddress = address_components[1]["long_name"] + ", " + address_components[2]["long_name"] + ", " + address_components[3]["long_name"] + ".";
    }
    return formatedAddress
  }
  compareItems(i1, i2) {
    return i1 && i2 && i1.key === i2.key;
  }
  initStatupForm(data = '') {
    this.industry = [{ key: "", value: "Select Industry" }];
    let name = "";
    this.maxField = 5;
    let startupLocation = "";
    let description = "";
    let industry = this.industry;
    let website = "";
    let problemSolving = [];
    let solutionProvide = [];
    let currentPayingClients = [];
    let dt: any = "";
    let logo = "";
    let founder_linkedin_profiles = [];
    let annualRecurringRevenue = "";
    let targetSectors="";
    let totalCustomers = "";
    let marqueeCustomers= "";
    dt = data;
    console.log("founder_linkedin_profiles", dt.founder_linkedin_profiles);
    if (dt != '') {
       if(dt.logo != ''){
        this.logo = dt.logo;
        this.logo[0].doc_name = dt.logo[0].doc_name;
       }

      name = dt.name;
      description = dt.description;
      annualRecurringRevenue = dt.additional_fields.annualRecurringRevenue;
      founder_linkedin_profiles = dt.founder_linkedin_profiles.length>0?dt.founder_linkedin_profiles:[""];
      startupLocation = dt.additional_fields.orgLocation;
      targetSectors=dt.additional_fields.targetSectors;

      if(dt.additional_fields.totalCustomers!=""){
      totalCustomers = dt.additional_fields.totalCustomers;
      }else{
        totalCustomers =  localStorage.getItem('totalCustomers');
      }
      marqueeCustomers=dt.additional_fields.marqueeCustomers;
      if (Array.isArray(startupLocation)) {
        if (startupLocation.length > 0) {
          startupLocation = this.formatAddress(startupLocation);
        }
      } else {
        if (typeof startupLocation === 'object') {
          startupLocation = this.formatAddress(startupLocation["address_components"]);
        }
      }
      if (this.selectedOrgType == this.orgTypes.startups) {
        description = dt.description;
        this.attachmentsArray = [];
        for (let i = 0; i < dt.data.length; i++) {
          let attachData = dt.data[i]
          attachData["id"] = i + 1;
          this.attachmentsArray.push(attachData)
        }
      }
      website = dt.website;
      //startupLocation=dt.additional_fields.orgLocation;
      this.industry = dt.industry;
      industry = this.industry;

    }

    if (this.selectedOrgType == this.orgTypes.startups) {


      if (this.localStorageService.userDetails.roles == this.userRoles.startupGuestUser) {


      this.startUpform = this.formBuilder.group({

       name: [name],
       //startupLocation: [{value:startupLocation, disabled:true} ],
      //  Validators.pattern(/^[a-zA-Z0-9!? ]*$/)

       //description: [description,[Validators.required,Validators.maxLength(500)]],
       description: [description, Validators.compose([Validators.required,Validators.maxLength(500), Validators.minLength(3),])],
       linkedInProfile:this.formBuilder.array(founder_linkedin_profiles),
       targetSectors:[targetSectors,[Validators.required,Validators.maxLength(80),Validators.minLength(3),Validators.pattern(/^((?!\s{,2}).)*$/)]],
       totalCustomers:[totalCustomers,[Validators.required,Validators.pattern(/^((?!\s{2,}).)*$/),Validators.pattern('^[1-9][0-9]*$')]],
       marqueeCustomers:[marqueeCustomers,[Validators.required, Validators.maxLength(80), Validators.minLength(3), Validators.pattern(/^((?!\s{2,}).)*$/)]],
       annualRecurringRevenue:[annualRecurringRevenue,[Validators.required]],
      });
      //  linkedInProfile:this.formBuilder.array(founder_linkedin_profiles),
      //  targetSectors: [targetSectors, Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/),Validators.maxLength(80)])],
      //  totalCustomers:[totalCustomers,Validators.required,Validators.pattern("^(?!\s|.*\s$).*$")],
      //  marqueeCustomers:[marqueeCustomers,Validators.required,this.global.AlphaPatternWithSpace],
      // annualRecurringRevenue: [annualRecurringRevenue, Validators.compose([Validators.required, Validators.pattern(/^\s*$/), Validators.pattern(this.global.AlphaNumericPattern)])],
      // annualRecurringRevenue:[{value:annualRecurringRevenue},Validators.required,Validators.pattern(this.global.AlphaNumericPattern)],

       //industry: [{value:industry, disabled:true} ],
       //logo : [{value:this.logo, disabled:true}] ,

       //website: [{ value: website, disabled: true }/* website, Validators.required */],
       //problemSolving: this.formBuilder.array([]),
       //solutionProvide: this.formBuilder.array([]),
       //currentPayingClients: this.formBuilder.array([])/* ,
     //knowAboutCorpGini: ["", Validators.required], */

      }else{

      this.startUpform = this.formBuilder.group({

        name: [name, [Validators.required, Validators.maxLength(80), Validators.minLength(3)]],
       //startupLocation: [{value:startupLocation, disabled:true} ],

       description: [description,[Validators.required,Validators.maxLength(500), Validators.minLength(3),Validators.pattern(/^((?!\s{2,}).)*$/)]],
       linkedInProfile:this.formBuilder.array(founder_linkedin_profiles),
       targetSectors:[targetSectors,[Validators.required,Validators.maxLength(80),Validators.minLength(3),Validators.pattern(/^((?!\s{,2}).)*$/)]],
       totalCustomers:[totalCustomers,[Validators.required,Validators.pattern(/^((?!\s{2,}).)*$/),Validators.pattern('^[1-9][0-9]*$')]],
       marqueeCustomers:[marqueeCustomers,[Validators.required, Validators.maxLength(80), Validators.minLength(3), Validators.pattern(/^((?!\s{2,}).)*$/)]],
       annualRecurringRevenue:[annualRecurringRevenue,[Validators.required]],
      });
      }


    } else if (this.selectedOrgType == this.orgTypes.corporate) {
      if (this.userSelectedRoles == this.userRoles.corporateGuestUser) {
        this.startUpform = this.formBuilder.group({
          name: [ {value: name , disabled:true} ],
          startupLocation: [startupLocation],
          industry: [{value:industry, disabled:true}],
          website: [{ value: website, disabled: true }/* website, Validators.required */],
          logo :  [{value : this.logo , disabled:true}] ,
        });
      }else{
        this.startUpform = this.formBuilder.group({
          name: [ name, Validators.required ],
          startupLocation: [startupLocation, Validators.required],
          industry: [industry, Validators.required],
          website: [{ value: website, disabled: true }/* website, Validators.required */],
          logo : [this.logo,Validators.required] ,
        });
      }
    }
    /* if (this.userSelectedRoles == this.userRoles.corporateUser || this.userSelectedRoles == this.userRoles.startupUser) {
      this.startUpform.disable();
    } */
    if (this.localStorageService.userDetails.roles == this.userRoles.startupGuestUser) {
    this.startUpform.disable();
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
             this.toaster.error("Only image files are acceptable!", "", {
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
         if (data.statusCode == 200) {

             this.logo[0].path = data.body[0].path.substring(1);
             window["document"]["querySelector"]('[type=file]')["value"] = '';
             //this.logo[0]["attachments"][0]["details"]= data.body[0];
             this.logo[0].doc_name = doc_name;
             this.logo[0]["attachments"][0][
               "uploaded"
             ] = true;
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
  deleteLogo(){
   this.logo[0]['attachments'] = [];
    this.logo[0].uploaded = false;
    this.logo[0].doc_name = "";
    this.frontEndService
      .deleteLogo()
      .pipe()
      .subscribe(
        (result: any) => {

          if (result.statusCode == 200) {
            this.logo[0].path="";
            this.logo[0].doc_name = "";
            this.toaster.success("Logo deleted sucessfully.", "", {
              timeOut: 2000,
            });
          }


        },
        (error: any) => {

          if (error.error.message != null && error.error.message != "") {
            this.toaster.error(error.error.message, "", {
              timeOut: 2000,
            });
          }
        }
      );
  }
  selectOrgType() {
    this.userRoles = userRoles;
    if (this.localStorageService.userDetails.roles == this.userRoles.corporateGuestUser || this.localStorageService.userDetails.roles == this.userRoles.corporateAdmin || this.localStorageService.userDetails.roles == this.userRoles.corporateUser) {
      this.selectedOrgType = this.orgTypes.corporate;
      if (this.localStorageService.userDetails.roles == this.userRoles.corporateAdmin) {
        this.userSelectedRoles = this.userRoles.corporateAdmin;
      }

      if (this.localStorageService.userDetails.roles == this.userRoles.corporateGuestUser) {
        this.userSelectedRoles = this.userRoles.corporateGuestUser;
      }
      if (this.localStorageService.userDetails.roles == this.userRoles.corporateUser) {
        this.userSelectedRoles = this.userRoles.corporateUser;
      }
    } else if (this.localStorageService.userDetails.roles == this.userRoles.startupGuestUser ||this.localStorageService.userDetails.roles == this.userRoles.startupAdmin || this.localStorageService.userDetails.roles == this.userRoles.startupUser) {
      this.selectedOrgType = this.orgTypes.startups;
      if (this.localStorageService.userDetails.roles == this.userRoles.startupAdmin) {
        this.userSelectedRoles = this.userRoles.startupAdmin;
      }

      if (this.localStorageService.userDetails.roles == this.userRoles.startupGuestUser) {
        this.userSelectedRoles = this.userRoles.startupGuestUser;
      }
      if (this.localStorageService.userDetails.roles == this.userRoles.startupUser) {
        this.userSelectedRoles = this.userRoles.startupUser;
      }
    }
  }
  ngOnInit() {
    this.attachmentsArrayEnv = environment.attachmentsArray;


    this.selectOrgType();
    this.initAttachment();
    this.getOrgProfile();
    setTimeout(() => {
      this.initStatupForm();
    }, 100)

  }

  ngAfterViewInit(){

  }
  get f() {
    return this.startUpform.controls;
  }
  /* onChangeCountry(countryId: any) {
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
  get linkedInProfile() {
    return this.startUpform.get('linkedInProfile') as FormArray;
  }
  insertAt(array, index, elements) {
    array.splice(index, 0, ...elements);
  }
  addmore(item = "", fieldName = "problemSolving") {
    const fixVal = this.linkedInProfile.controls.length + 1
    if(fixVal >= 6){
      this.toaster.error("", "Maximum five linkedIn links are allowed.", {
        timeOut: 2000,
      }
      );
      return;
    }
    if(fixVal <= 5 ) {
      this.moreLinkedInField = this.orgProfile.founder_linkedin_profiles.length;
    this.checklenth = this.applicantEmailsField.length +  this.moreLinkedInField;
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
    } else {
      this.genricError = true;
    }
    return this.genricError;
  }
  remove(index, fieldName)
  {
    if (fieldName == "linkedInProfile") {
      this.applicantEmailsField.splice(index, 1);
      this.linkedInProfile.removeAt(index);
    }
  }
  onSubmit() {
    this.submitted = true;
    let frm = this.startUpform.value;
    let orgName = this.orgProfile.name;
    let orgWebSite = this.orgProfile.website;
    if (frm.name != "" && frm.name != null) {
      orgName = frm.name;
    }

    let type = this.selectedOrgType
    let data_send: any = {}
    if (type == this.orgTypes.startups) {
      data_send = {
        name: orgName.trim(),
        type: type.trim(),
        unique_code : this.orgProfile.unique_code,
        founder_linkedin_profiles: frm.linkedInProfile,
        domain: this.orgProfile.domain,
        description: frm.description.trim(),
        status: this.orgProfile.status.trim(),
        logo: this.logo,
        fullname: this.orgProfile.fullname.trim(),
        email: this.orgProfile.applicant_email.trim(),
        website: orgWebSite.trim(),
        mobile_number: this.orgProfile.mobile_number.trim(),
        industry: this.orgProfile.industry,
        data:this.orgProfile.data,
        additional_fields: {
          Problem_your_startup_is_solving: this.orgProfile.additional_fields.Problem_your_startup_is_solving.trim(),
          Solution_your_startup_is_providing: this.orgProfile.additional_fields.Solution_your_startup_is_providing.trim(),
          Current_Paying_Clients: this.orgProfile.additional_fields.Current_Paying_Clients.trim(),
          How_did_you_come_to_know_about_CorpGini: this.orgProfile.additional_fields.How_did_you_come_to_know_about_CorpGini.trim(),
          countryCode: this.orgProfile.additional_fields.countryCode,
          orgLocation: this.orgProfile.additional_fields.orgLocation.trim(),
          targetSectors:frm.targetSectors.trim(),
          totalCustomers:frm.totalCustomers.trim(),
          marqueeCustomers:frm.marqueeCustomers.trim(),
          annualRecurringRevenue:frm.annualRecurringRevenue.trim(),
        }
      };
    } else if (type == this.orgTypes.corporate) {
      let orgName = this.orgProfile.name.trim();
      let orgWebSite = this.orgProfile.website.trim();
      let orgLocation = this.orgProfile.additional_fields.userLocation;
      if (frm.name != "" && frm.name != null) {
        orgName = frm.name.trim();

      }
      if (frm.website != "" && frm.website != null) {
        orgWebSite = frm.website.trim();
      }
      if (frm.startupLocation != "" && frm.startupLocation != null) {
        orgLocation = frm.startupLocation.trim();
      }

      data_send = {
        name: orgName.trim(),
        fullname: this.orgProfile.fullname.trim(),
        type: type,
        email: this.orgProfile.applicant_email.trim(),
        website: orgWebSite.trim(),
       // startupLocation:orgstartupLocation,
        mobile_number: this.orgProfile.mobile_number.trim(),
        industry: frm.industry,
        domain: this.orgProfile.domain.trim(),
        description: null,
        data: null,
        logo: this.logo,
        status: this.orgProfile.status.trim(),
        additional_fields: {
          Problem_your_startup_is_solving: null,
          Solution_your_startup_is_providing: null,
          Current_Paying_Clients: null,
          How_did_you_come_to_know_about_CorpGini: null,
          countryCode: this.orgProfile.additional_fields.countryCode.trim(),
          orgLocation: orgLocation.trim(),

        }
      };
    }
    if (this.startUpform.invalid) {
      return;
    }
    else {
      this.startupLoader = true;
      this.frontEndService.orgUpdate(data_send)
        .pipe()
        .subscribe(
          (result: any) => {
            this.startupLoader = false;
            //this.initAttachment();
            if (result.statusCode == 200) {
              // this.getOrgProfile();
              if(type == this.orgTypes.corporate){
              localStorage.setItem("companyname",orgName);
                if(document.getElementById("compnyheader")) {
                  document.getElementById("compnyheader").innerHTML = orgName;
                }
              }
              if(this.orgProfile.type == this.orgTypes.startups){
                this.sessionStorageService.setUserAuthDetails(result.body);
                this.sessionStorageService.setUserDetails(result.body);
                localStorage.setItem("companyname",orgName);
                if(document.getElementById("compnyheader")) {
                  document.getElementById("compnyheader").innerHTML = orgName;
                }
                this.routerService.RedirectToStartupDashboard();
              }
              this.toaster.success(result.message, "", {
                timeOut: 2000,
              });
            } else {
              this.errorMessage =
                "Something went wrong. Please try after sometime.";
              this.toaster.error(this.errorMessage, "", {
                timeOut: 2000,
              });
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
            this.toaster.error(this.errorMessage, "", {
              timeOut: 2000,
            });
          }
        );
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
