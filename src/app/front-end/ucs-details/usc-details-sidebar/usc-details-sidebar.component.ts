import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../../assets/js/plugins/ckeditor5-baloon-block/ckeditor';
@Component({
  selector: 'app-usc-details-sidebar',
  templateUrl: './usc-details-sidebar.component.html',
  styleUrls: ['./usc-details-sidebar.component.sass']
})
export class UscDetailsSidebarComponent implements OnInit {
  @Input('details') ucsDetails: any;
  @Input('tech') techlogy: any;
  industry: any = "";
  function: any = "";
  techlogies: any = "";
  summary: any = "";
  contributeToROI: any = "";
  enterprisePainPoint: any = "";
  competitors: any = "";
  tags: any = [];
  maturityStage: any;
  silentPoints: any;
  testimonials: any;
  custestimonials: any = [];
  productExplainerVideos: any = "";
  productExplainerVideos1: any = "";
  annualrecurringrevenue: any;
  rolofsolution: any;
  totalnumberofcustomers: any;
  marquee_customers: any;
  urlSafe: SafeResourceUrl;
  url1Safe: SafeResourceUrl;
  public Editor = Editor;
  public isDisabled = false;
  ckEditorConfig: any = environment.EditorConfig;
  donwnloadPath = environment.services.files.downloadAttachments;
  public baseUrl = environment.services.files.downloadAttachments;
  casestudy: any;
  shortdescription: any;
  longdescription:string;
  constructor(
    public sanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {
    
    this.toggleDisabled();
    if (this.ucsDetails) {
      this.industry = this.ucsDetails.industries.join(", ");
      this.function = this.ucsDetails.functions.join(", ");
      this.techlogies = this.techlogy;
      this.tags = this.ucsDetails.tags;
      if(this.ucsDetails.type == 'solution') {
        this.summary= this.ucsDetails.additional_fields.summary?this.ucsDetails.additional_fields.summary:" ";
        this.contributeToROI=this.ucsDetails.additional_fields.contributeToROI;
        this.enterprisePainPoint=this.ucsDetails.additional_fields.enterprisePainPoint;
        this.competitors=this.ucsDetails.additional_fields.competitors;
        this.maturityStage = this.ucsDetails.additional_fields.maturityStage;
        this.silentPoints =this.ucsDetails.additional_fields.silentPoints;
        this.testimonials=this.ucsDetails.testimonials;
        this.productExplainerVideos=this.ucsDetails.product_explainer_videos.productExplainerVideos;
        this.productExplainerVideos1 =this.ucsDetails.product_explainer_videos.productExplainerVideos1;
        this.annualrecurringrevenue =this.ucsDetails.annual_recurring_revenue;
        this.rolofsolution =this.ucsDetails.rol_of_solution;
        this.totalnumberofcustomers =this.ucsDetails.total_number_of_customers;
        this.marquee_customers =this.ucsDetails.marquee_customers;
        this.casestudy=this.ucsDetails.case_study_attachments;
        this.custestimonials= this.ucsDetails.testimonials;

        if(this.productExplainerVideos != '') {
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.getVideoUrl(this.productExplainerVideos)
      
          );
        }
        if(this.productExplainerVideos1 != '') {
          this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.getVideoUrl(this.productExplainerVideos1)
          );
        }
      } else {
        this.shortdescription =this.ucsDetails.short_description;
        this.longdescription =this.ucsDetails.long_description;
      }
    }
  }
  toggleDisabled() {
    this.isDisabled = !this.isDisabled
}
  getVideoUrl(actualValue){
    if(actualValue.indexOf('vimeo.com')>0){
      return 'https://player.vimeo.com/video/'+(actualValue.split('/'))[actualValue.split('/').length - 1];
    } else{
      return actualValue.replace("/watch?v=","/embed/").split("&")[0]
    }
  }
  
  getDownloadDocumentPath() {
    window.open(
      this.donwnloadPath + "download/" + this.casestudy,
      "_blank" // <- This is what makes it open in a new window.
    );
  }

  isMp4Url(urlSafe) {
    return urlSafe && urlSafe.changingThisBreaksApplicationSecurity && urlSafe.changingThisBreaksApplicationSecurity.indexOf('.mp4') > 0;
  }
}
