import { CommonService } from './../../../shared/services/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";

import { OrgTypesEnum } from '../../../shared/constants/enum';
import { environment } from './../../../../environments/environment';


interface Industries {
  key: string;
  value: string;
}
interface Codes { name: string, dial_code: string, code: string }
@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent {
  
  @ViewChild('countryCodeSelect') industrySelect: any;
  donwnloadPath = environment.services.files.downloadAttachments;

  action: string;
  dialogTitle: string;
  application: any = "";
  orgId = "";
  uniqueCode = "";
  type = "";
  email = "";
  fullname = "";
  mobile_number = "";
  OrgType = OrgTypesEnum
  industry = [];
  details = [];
  description = "";
  countryCode: any = "";
  city = "";
  problemSolving: any = "";
  solutionProvide: any = "";
  knowAboutCorpGini: any = "";
  currentPayingClients: any = "";
  additionalFields: any = "";
  startupLocation: any = ""
  country:any;
  selectedCountry:any;
  totalCustomers: any = "";
  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/" + path,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  compareItems(i1, i2) {
    return i1 && i2 && i1.dial_code === i2.dial_code;
  }
  public attachmentsArray = [
    { title: "Sales Deck", attachments: [], error: false, errorMsg: "" },
    { title: "Case Study", attachments: [], error: false, errorMsg: "" },
    { title: "Product Explainer Video", attachments: [], error: false, errorMsg: "" }
  ]
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
  registerForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ApplicationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public commonService: CommonService
  ) {
    this.action = data.action;
    this.dialogTitle = data.profile.name;
    this.application = data;
    let results = data.profile;//result.body[0];
    this.details = data.profile;
    this.orgId = results._id;
    this.uniqueCode = results.unique_code;
    this.type = results.type;
    this.email = results.applicant_email;
    this.fullname = results.fullname;
    this.mobile_number = results.mobile_number;
    this.industry = results.industry;
    this.startupLocation = results.additional_fields.orgLocation;
    this.countryCode = results.additional_fields.countryCode;
    
    if (Array.isArray(this.startupLocation)) {
      if (this.startupLocation.length > 0) {
        this.startupLocation = this.formatAddress(this.startupLocation);
      }
    } else {
      if (typeof this.startupLocation === 'object') {
        this.startupLocation = this.formatAddress(this.startupLocation["address_components"]);
      }
    }
    if (this.type == this.OrgType.corporate) {
      this.registerForm = this.formBuilder.group(
        {
          name: [{ value: results.name, disabled: true }],
          startupLocation: [{ value: this.startupLocation, disabled: true }],
          fullname: [{ value: results.fullname, disabled: true }],
          countryCode: [{ value: this.countryCode, disabled: true }],
          phoneNumber: [{ value: this.mobile_number, disabled: true }],
          email: [{ value: results.applicant_email, disabled: true }],
          industry: [{ value: this.industry }],
          website: [{ value: results.website, disabled: true }],
        }
      );
    } else {
      this.description = results.description;
      this.city = results.additional_fields.city;
      this.problemSolving = results.additional_fields.Problem_your_startup_is_solving;
      this.solutionProvide = results.additional_fields.Solution_your_startup_is_providing;
      this.knowAboutCorpGini = results.additional_fields.How_did_you_come_to_know_about_CorpGini;
      this.currentPayingClients = results.additional_fields.Current_Paying_Clients;
      this.totalCustomers =results.additional_fields.totalCustomers;
      this.attachmentsArray = results.data;
      this.registerForm = this.formBuilder.group(
        {
          name: [{ value: results.name, disabled: true }],
          startupLocation: [{ value: this.startupLocation, disabled: true }],
          fullname: [{ value: results.fullname, disabled: true }],
          phoneNumber: [{ value: this.mobile_number, disabled: true }],
          email: [{ value: results.applicant_email, disabled: true }],
          industry: [{ value: this.industry }],
          website: [{ value: results.website, disabled: true }],
          description: [{ value: this.description, disabled: true }],
          countryCode: [{ value: this.countryCode, disabled: true }],
          city: [{ value: this.city, disabled: true }],
          problemSolving: [{ value: this.problemSolving, disabled: true }],
          solutionProvide: [{ value: this.solutionProvide, disabled: true }],
          knowAboutCorpGini: [{ value: this.knowAboutCorpGini, disabled: true }],
          currentPayingClients: [{ value: this.currentPayingClients, disabled: true }],
          totalCustomers: [{ value: this.totalCustomers, disabled: true }],
        }
      );
    }


  }
  getFlags(countryName) {
    return this.commonService.getFlags(countryName);
  }
  get f() {
    return this.registerForm.controls;
  }
  onNoClick(): void {
    this.dialogRef.close();
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

}
