import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { userRoles, UsecaseSolutoinTypes, discussionType, redirectSessions } from 'src/app/shared/constants/enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { DateFormatService } from 'src/app/shared/services/date-format.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RouterService } from 'src/app/shared/services/router.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage.service';
import { SharedVarService } from 'src/app/shared/services/shared-var.service';
import { environment } from 'src/environments/environment';
import { UserAddRemoveEmitterService } from '../../frontend-dashboard/user-add-remove.service';
import { FrontEndService } from '../../services/front-end.service';
import { PromoteEmitterService } from '../promote-emmitter-service';
//import * as Editor from '../../../../assets/js/plugins/ckeditor5-baloon-block/ckeditor';
import { PromotePopupComponent } from "./../promote-popup/promote-popup.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from "sweetalert2";
declare var $: any;
@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.sass"],
})
export class OverviewComponent implements OnInit {
  isGuest = false;
  authenticated = false;
  selectInd = 1;
  isStartup: boolean = false;
  isDeleted: boolean = false;
  color: ThemePalette = "accent";
  @ViewChild("tabGroup") private tabGroup;
  @ViewChild("techSelect") techSelect: any;
 // public Editor = Editor;
  userRoles: any = userRoles;
  ckEditorConfig: any = environment.EditorConfig;
  discTypeFilter: any = "";
  selectedDescType: any = "";
  discussionType: any = discussionType;
  donwnloadPath = environment.services.files.downloadAttachments;
  selectedAttachments = [];
  addToDisusbtn: MatProgressButtonOptions = <MatProgressButtonOptions>(
    environment.addToDiscBtnConfig
  );
  publishBtn: MatProgressButtonOptions = <MatProgressButtonOptions>(
    environment.publishBtnConfig
  );
  updateChanges: boolean = false;
  industries: any = [];
  industry: any = "";
  industriesLoaders: boolean = false;
  editTitle: any = "";
  isTitleEditable: boolean = false;
  availabeDiscType: any = [];
  ucsForm: FormGroup;
  ucsId: any = "";
  ucs_type: any = "";
  ucs_user_role: any = "";
  moduleTitle = "Solution";
  uscType: any = "";
  overViewDetails: any = "";
  overViewLoader: boolean = false;
  shortDesc: any = "";
  longDesc: any = "";
  ucsTitle = "";
  userId = this.localStorageService.userDetails._id;
  updateLoader: boolean = false;
  isTagSelected: boolean = false;
  isIndustryDisabled: boolean = false;
  industryDisabled: boolean = false;
  isFunctionDisabled: boolean = false;
  isTechoDisabled: boolean = true;
  selectedTechno = [];
  functions: any = [];
  technologies: any = [];
  errorMessage = "";
  tags: any = "";
  publishedStatus = "";
  ucsType = "";
  searchText = "";
  piplineSearchText = "";
  initSelectedTag = { key: "selecttag", value: "Select Tag(s)" };
  items: any = [this.initSelectedTag];
  selectedtags: any = [];
  isPublishButtonClicked: boolean = false;
  selectedPipeline: any = "";
  selectedDiscussion: any = "";
  testimonialsArray: any = [];
  videosArray: any = [];
  public isSampleEditable: boolean = false;
  messageToSend = "";
  uscList: any = [];
  viewNotifi: boolean = false;
  viewNotifiSession = redirectSessions.viewNotifiSession;
  viewDisucss = redirectSessions.viewDisucss;
  publishBtnLoader: boolean = false;
  uscDtl: any = "";
  viewUcsDetails: boolean = false;
  ucsDetailsLoader: boolean = false;
  techlogies: any = [];
  shortError: boolean = false;
  shortDescError: boolean = false;
  tagsError: boolean = false;
  casestudyError: boolean = false;
  technoError: boolean = false;
  industryError: boolean = false;
  functionError: boolean = false;
  ucstitleMinLength = 5;
  titleMaxLength = 100;
  shortDescIsEnabled: boolean = false;
  longDescIsEnabled: boolean = false;
  ucsLoader: boolean = false;
  ucsFetchType: any = "";
  tabTitle: any = "";
  tagSelectIsEnable: boolean = false;
  showSearchBox: boolean = false;
  showDescSearchBox: boolean = false;
  showPublishBtn: boolean = false;
  promoteLoader: boolean = false;
  initUcsLoader: boolean = false;
  resourseLoader: boolean = true;
  resourceList: any = [];
  testimonial1: boolean = false;
  testimonial2: boolean = false;
  addtesti: boolean = false;
  addtesti1: boolean = false;
  subtesti: boolean = false;
  subcuttesti1: boolean = false;
  subtractTesti: boolean = false;
  documentList: any = [];
  getfilename: any = "";
  urlSafe: SafeResourceUrl;
  url1Safe: SafeResourceUrl;
  @Input() ucsLength: number;
  @Input() isUcsPromoted: boolean;
  @Output() publicStatusUpdate: EventEmitter<any> = new EventEmitter<any>();
  modalRef: BsModalRef;
  @Input() isEditable: any;
  checkvaluetype: any;
  value: any;
  competitors: boolean = false;
  enterprisePainPoint: boolean = false;
  maturityStage: boolean = false;
  //silentPoints: boolean = false;
  contributeToROI: boolean = false;
  marqueeCustomers: boolean = false;
  customerTestimonials1: boolean = false;
  totalCustomers: boolean = false;
  videoUrl: boolean = false;
  roi: boolean = false;
  enabled: boolean = true;
  disabled: boolean;
  selectedResource: any = "";
  isFileSelected: boolean = false;
  selectedFileName: any = "";
  publishFormSubmitted: boolean = false;
  checkLenth: any = "";
  iconValue: boolean = false;
  ckeConfig: any;
  mycontent: string;
  log: string = '';




  constructor(
    private userAddRemoveEmitterService: UserAddRemoveEmitterService,
    private sessionStorageService: SessionStorageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private modalService: BsModalService,
    private routerService: RouterService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private frontEndService: FrontEndService,
    private toaster: ToastrService,
    public dateFormatService: DateFormatService,
    private varService: SharedVarService,
    public dialog: MatDialog,
    public commonService: CommonService,
    public authenticationService: AuthenticationService,
    public promoteEmitter: PromoteEmitterService,
    public sanitizer: DomSanitizer
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  ngOnInit(): void {
    this.ucsForm = this.fb.group({
      summary: ["", [Validators.required,Validators.maxLength(500), Validators.minLength(3)]],
      enterprisePainPoint: ["", [Validators.required,Validators.maxLength(500), Validators.minLength(3)]],
      competitors: ["", [Validators.required,Validators.maxLength(500), Validators.minLength(3)]],
      maturityStage: ["", [Validators.required,Validators.maxLength(500), Validators.minLength(3)]],
 /*      silentPoints: ["", [Validators.required,Validators.maxLength(500), Validators.minLength(3)]], */
      contributeToROI: ["", [Validators.required,Validators.maxLength(500), Validators.minLength(3)]],
      customerTestimonials: ["", [Validators.required,Validators.maxLength(250), Validators.minLength(3)]],
      customerTestimonials1: ["", [Validators.maxLength(250), Validators.minLength(3)]],
      customerTestimonials2: ["", [Validators.maxLength(250), Validators.minLength(3)]],

      marqueeCustomers: [""],
      productExplainerVideos: [""],
      productExplainerVideos1: [""],
      annualRevenue: [""],
      roi: ["", [Validators.required]],
      totalCustomers: ["", [Validators.required,Validators.maxLength(10), Validators.pattern('^[1-9][0-9]*$')]],
      industry: [{ value: this.industries, disabled: false }, Validators.required,],
      function: [{ value: this.functions, disabled: this.dropdwonEabelDisable() }, Validators.required],
      techonolgy: [
        { value: this.selectedTechno, disabled: this.dropdwonEabelDisable() },
        Validators.required,
      ],
      selectedtags: [
        { value: this.selectedtags, disabled: this.dropdwonEabelDisable() },
        Validators.required,
      ],
      shortDesc: [{ value: "", disabled: this.dropdwonEabelDisable() },],
      longDesc: [{ value: "", disabled: this.dropdwonEabelDisable() },],
    });

    this.ucsId = localStorage.getItem("ucs_id");
    this.ucs_type = localStorage.getItem("ucs_type");
    this.ucs_user_role = localStorage.getItem("ucs_user_role");

    if (
      this.ucs_user_role == userRoles.startupGuestUser ||
      this.ucs_user_role == userRoles.corporateGuestUser
    ) {
      this.isGuest = true;
    }
    this.isStartup == false;
    if (this.promoteEmitter.subsVar == undefined) {
      this.promoteEmitter.subsVar = this.promoteEmitter.promoteEmitter.subscribe(
        (value) => {
          this.isUcsPromoted = value.val;
          this.isDeleted = value.val;
          this.promoteEmitter.subsVar = undefined;
          setTimeout(() => {
            this.ref.detectChanges();
          }, 500);
        }
      );
    }

    if (this.userAddRemoveEmitterService.subsVar == undefined) {
      this.userAddRemoveEmitterService.subsVar = this.userAddRemoveEmitterService.userAddEmitter.subscribe(
        (value) => {
          this.userAddRemoveEmitterService.subsVar = undefined;
          this.overViewDetails.sharedUsers = value.value;
        }
      );

      this.userAddRemoveEmitterService.subsVar = this.userAddRemoveEmitterService.userRemoveEmitter.subscribe(
        (value) => {
          this.userAddRemoveEmitterService.subsVar = undefined;
          this.overViewDetails.sharedUsers.splice(value.userIndex, 1);
        }
      );
    }

    $("body").addClass("bg-change");
    this.selectedAttachments = [];
    this.industries = [];
    this.functions = [];
    this.technologies = [];
    this.items = [];
    if (this.ucsId) {
      //this.initUcslist();
      this.iniModule();
      this.initAvailabelTypes();
      this.viewOverview();
    } else {
      this.ucsId = "";
      this.redirectUser();
    }
    this.dropdwonEabelDisable();

  }

  ngAfterViewInit() {
    this.getResourses();
  }

  config = {
    class: 'modal-dialog-centered modal-md startup-profile-modal', backdrop: false, keyboard: true
  }

  openModal(template: TemplateRef<any>, value: any) {
    this.selectedResource = "";
    this.isFileSelected = false;
    this.selectedFileName = "";
    this.checkvaluetype = value;
    this.modalRef = this.modalService.show(template, this.config);
  }
  closeDialog() {
    this.modalRef.hide()
  }

  initUcslist() {
    this.iniModule();
    this.getUcsDetails();
  }
  initAvailabelTypes() {
    this.availabeDiscType = [
      {
        key: "",
        value: "All",
        activeClass: "active",
        class: "all",
      },
      {
        key: this.discussionType.question,
        value: "Question",
        activeClass: "",
        class: "info",
      },
      {
        key: this.discussionType.idea,
        value: "Idea",
        activeClass: "",
        class: "idea",
      },
      {
        key: this.discussionType.challenge,
        value: "Challenge",
        activeClass: "",
        class: "challenge",
      },
      {
        key: this.discussionType.comment,
        value: "Comment",
        activeClass: "",
        class: "comment",
      },
    ];
  }

  addNewTag(name) {
    return name;
  }
  iniModule() {
    if (
      this.localStorageService.userDetails.roles == userRoles.startupAdmin ||
      this.localStorageService.userDetails.roles == userRoles.startupUser ||
      this.localStorageService.userDetails.roles == userRoles.startupGuestUser
    ) {
      this.isStartup = true;
    } else if (
      this.localStorageService.userDetails.roles == userRoles.corporateAdmin ||
      this.localStorageService.userDetails.roles == userRoles.corporateUser ||
      this.localStorageService.userDetails.roles == userRoles.corporateGuestUser
    ) {
      this.isStartup = false;
    }
    if (this.ucs_type == "solution") {
      this.moduleTitle = "Solution";
      this.ucsFetchType = "usecase";
      this.tabTitle = "Use Case";
    } else if (this.ucs_type == "usecase") {
      this.moduleTitle = "Use Case";
      this.ucsFetchType = "solution";
      this.tabTitle = "Solutions";
    }
    this.uscType = this.frontEndService.getUserRoleType();
  }
  initUcsForm(data) {
    if (data.type == 'solution') {
       if (data.additional_fields) {
        //this.ucsForm.controls["marqueeCustomers"].setValue(data.marquee_customers);

         this.ucsForm.controls["annualRevenue"].setValue(
          data.annual_recurring_revenue
        );
        this.ucsForm.controls["totalCustomers"].setValue(
          data.total_number_of_customers
        );
        if(data.total_number_of_customers ==""){
          this.ucsForm.controls["totalCustomers"].setValue(
            data.total_number_of_customers = this.localStorageService.userDetails.organization[0].additional_fields.totalCustomers

          );
        }
        if(data.marquee_customers ==""){
          this.ucsForm.controls["marqueeCustomers"].setValue(
            data.marquee_customers = this.localStorageService.userDetails.organization[0].additional_fields.marqueeCustomers

          );
        }
         if(data.annual_recurring_revenue ==""){
          this.ucsForm.controls["annualRevenue"].setValue(
            data.annual_recurring_revenue = this.localStorageService.userDetails.organization[0].additional_fields.annualRecurringRevenue

          );
        }
      } else {
        let annualRevenue = this.localStorageService.userDetails.organization[0].additional_fields.annualRecurringRevenue ? this.localStorageService.userDetails.organization[0].additional_fields.annualRecurringRevenue : "";
        let totalCustomers = this.localStorageService.userDetails.organization[0].additional_fields.totalCustomers ? this.localStorageService.userDetails.organization[0].additional_fields.totalCustomers : "";
         let marqueeCustomers = this.localStorageService.userDetails.organization[0].additional_fields.marqueeCustomers ? this.localStorageService.userDetails.organization[0].additional_fields.marqueeCustomers : "";
        this.ucsForm.controls["marqueeCustomers"].setValue(marqueeCustomers);

        this.ucsForm.controls["annualRevenue"].setValue(
          annualRevenue
        );
        this.ucsForm.controls["totalCustomers"].setValue(
          totalCustomers
        );
      }
      this.ucsForm.controls["productExplainerVideos"].setValue(
        data.product_explainer_videos.productExplainerVideos
      );
      this.ucsForm.controls["productExplainerVideos1"].setValue(
        data.product_explainer_videos.productExplainerVideos1
      );


      this.ucsForm.controls["customerTestimonials1"].setValue(
        data.testimonials.customerTestimonials1
      );
      this.ucsForm.controls["customerTestimonials2"].setValue(
        data.testimonials.customerTestimonials2
      );
      if (data.testimonials.customerTestimonials1 == "" && data.testimonials.customerTestimonials2 != "") {
        this.ucsForm.controls["customerTestimonials1"].setValue(
          data.testimonials.customerTestimonials2
        );
        this.ucsForm.controls["customerTestimonials2"].setValue("");
        this.addtesti = true;
        this.subtesti = true;
        this.testimonial1 = true;
        this.addtesti1 = false;
        this.subcuttesti1 = false;
        this.testimonial2 = false;
      } else if (data.testimonials.customerTestimonials1 == "" && data.testimonials.customerTestimonials2 == "") {
        this.addtesti = false;
        this.subtesti = false;
        this.testimonial1 = false;
        this.addtesti1 = false;
        this.subcuttesti1 = false;
        this.testimonial2 = false;
      } else if (data.testimonials.customerTestimonials1 != "" && data.testimonials.customerTestimonials2 == "") {
        this.addtesti = true;
        this.subtesti = true;
        this.testimonial1 = true;
        this.addtesti1 = false;
        this.subcuttesti1 = false;
        this.testimonial2 = false;
      } else if (data.testimonials.customerTestimonials1 != "" && data.testimonials.customerTestimonials2 != "") {
        this.addtesti = true;
        this.subtesti = true;
        this.testimonial1 = true;
        this.addtesti1 = true;
        this.subcuttesti1 = true;
        this.testimonial2 = true;
      }



      this.ucsForm.controls["summary"].setValue(data.additional_fields.summary);
      this.ucsForm.controls["enterprisePainPoint"].setValue(
        data.additional_fields.enterprisePainPoint
      );
      this.ucsForm.controls["competitors"].setValue(
        data.additional_fields.competitors
      );
      this.ucsForm.controls["maturityStage"].setValue(
        data.additional_fields.maturityStage
      );
 /*      this.ucsForm.controls["silentPoints"].setValue(
        data.additional_fields.silentPoints
      ); */
      this.ucsForm.controls["contributeToROI"].setValue(
        data.additional_fields.contributeToROI
      );
      this.ucsForm.controls["customerTestimonials"].setValue(
        data.testimonials.customerTestimonials
      );
       if(this.ucsForm.controls["marqueeCustomers"].value == ""){
         this.ucsForm.controls["marqueeCustomers"].setValue(
           this.localStorageService.userDetails.organization[0].additional_fields.marqueeCustomers
         );
       }

      this.ucsForm.controls["roi"].setValue(data.rol_of_solution);

      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getVideoUrl(data.product_explainer_videos.productExplainerVideos)
      );
      this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getVideoUrl(data.product_explainer_videos.productExplainerVideos1)
      );
    } else {
      this.ucsForm.controls["shortDesc"].setValue(data.short_description);
      this.ucsForm.controls["longDesc"].setValue(data.long_description);
    }

     if(this.ucsForm.controls["totalCustomers"].value == ""){
       this.ucsForm.controls["totalCustomers"].setValue(
         this.localStorageService.userDetails.organization[0].additional_fields.totalCustomers
       );
     }
    this.ucsForm.controls["industry"].setValue(data.industries[0]);
    this.ucsForm.controls["function"].setValue(data.functions[0]);
    this.ucsForm.controls["techonolgy"].setValue(data.technologies);
    this.ucsForm.controls["selectedtags"].setValue(data.tags);
  }
  getVideoUrl(actualValue) {
    if (actualValue.indexOf('vimeo.com') > 0) {
      return 'https://player.vimeo.com/video/' + (actualValue.split('/'))[actualValue.split('/').length - 1];
    }
    else {
      return actualValue.replace("/watch?v=", "/embed/").split("&")[0]
    }
  }
  isRedirectSession(viewNotifi) {
    if (localStorage.getItem(viewNotifi)) {
      return true;
    } else {
      return false;
    }
  }
  youtubeUrlChange(event) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(event.target.value));
  }
  photoURL() {
    return this.sanitizer.bypassSecurityTrustUrl(this.overViewDetails.product_explainer_videos.productExplainerVideos1[1].url);
  }
  youtubeUrlChange1(event) {
    this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(event.target.value));
  }
  getUcsDetails() {
    let rediectSessions: any = {};
    this.overViewLoader = true;
    //this.overViewDetails = "";
    let isViewNotification: boolean = false;
    let viewDisucss = false;
    if (this.isRedirectSession(this.viewNotifiSession)) {
      isViewNotification = true;
      rediectSessions[this.viewNotifiSession] = isViewNotification;
    }
    if (this.isRedirectSession(this.viewDisucss)) {
      viewDisucss = true;
      rediectSessions[this.viewDisucss] = viewDisucss;
    }
    this.overViewDetails = "";
    this.frontEndService
      .getUcsDetails(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.overViewLoader = false;
          if (result.statusCode == 200) {
            this.overViewDetails = result.body[0];
            this.getfilename = result.body[0].case_study_attachments;
            if (this.overViewDetails.technologies[0] != 0 &&
              this.overViewDetails.technologies != null &&
              this.overViewDetails.technologies.length > 0
            ) {
              this.selectedTechno = this.overViewDetails.technologies;
            }
            this.ucsTitle = this.overViewDetails.title;
            this.editTitle = this.ucsTitle;
            this.publishedStatus = this.overViewDetails.status;
            this.ucsType = this.overViewDetails.type;
            this.isUcsPromoted = this.overViewDetails.is_promoted;
            let tags = [];
            if (this.overViewDetails.tags.length > 0) {
              tags = this.overViewDetails.tags;
            }
            if (tags.length > 0) {
              this.tags = tags;
              this.checkLenth = tags.length;
            }
            this.selectedtags = this.tags;
            this.initUcsForm(this.overViewDetails);
            if (rediectSessions == "") {
              this.initUcsLoader = false;
              if (this.publishedStatus == "published") {
                this.backToUscList();
              } else {
                this.viewOverview();
              }
            } else {
              // thinkknoneed
              this.listTag(rediectSessions);
            }
            this.frontEndService
              .deleterelevantdata(this.ucsId)
              .pipe()
              .subscribe(
                (result: any) => {
                  if (result.message == "success") {
                  } else {
                    this.errorMessage = "Something went wrong. Please try after sometime.";
                  }
                },
                (error: any) => {
                  if (
                    error.error.message != null &&
                    error.error.message != ""
                  ) {
                  } else {
                    this.errorMessage = "Something went wrong. Please try after sometime.";
                  }
                }
              );
          } else {
            this.overViewDetails = "";
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.overViewDetails = "";
          this.ucsId = "";
          this.redirectUser();
          if (error.error.message != null && error.error.message != "") {
            this.errorMessage = error.error.message;
            this.overViewDetails = "";
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
            this.overViewDetails = "";
          }
        }
      );
  }
  patchValues(value) {
    return this.fb.control(value);
  }

  remove(index, fieldName = "problemSolving") {
    if (fieldName == "problemSolving") {
      this.testimonialsArray.splice(index, 1);
      this.customerTestimonials.removeAt(index);
    }
    if (fieldName == "productExplainerVideos") {
      this.videosArray.splice(index, 1);
      this.productExplainerVideos.removeAt(index);
    }
  }

  get customerTestimonials() {
    return this.ucsForm.get("customerTestimonials") as FormArray;
  }

  get productExplainerVideos() {
    return this.ucsForm.get("productExplainerVideos") as FormArray;
  }
  tagsLoader: boolean = false;
  listTag(rediectSessions = "") {
    this.tagsLoader = true;
    this.items = [];
    this.frontEndService
      .getTags()
      .pipe()
      .subscribe(
        (result: any) => {
          this.tagsLoader = false;
          if (result.message == "success") {
            let items = result.body;
            this.frontEndService.setTagList(items).then(
              (value) => {
                this.items = value;
                if (rediectSessions != "") {
                  if (rediectSessions[this.viewNotifiSession]) {
                    //this.viewPipline()
                  } else if (rediectSessions[this.viewDisucss]) {
                    //this.viewDiscussion()
                  }
                }
              },
              (error) => {
                this.viewRedirectContent(this.viewDisucss);
                this.viewRedirectContent(this.viewNotifiSession);
                this.items = items;
              }
            );
          } else {
            this.viewRedirectContent(this.viewDisucss);
            this.viewRedirectContent(this.viewNotifiSession);
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.viewRedirectContent(this.viewDisucss);
          this.viewRedirectContent(this.viewNotifiSession);
          this.tagsLoader = false;
          if (error.error.message != null && error.error.message != "") {
          } else {
            this.errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        }
      );
  }
  viewRedirectContent(viewNotifi) {
    if (this.isRedirectSession(viewNotifi)) {
      this.removeRedirectSession(viewNotifi);
      this.initUcsLoader = false;
    }
  }
  removeRedirectSession(viewNotifi) {
    if (this.isRedirectSession(viewNotifi)) {
      sessionStorage.removeItem(viewNotifi);
    }
  }
  viewOverview() {
    if (this.industries.length == 0) {
      this.getIndustries();
    }
    if (this.functions.length == 0) {
      this.getFunctions();
    }
    if (this.technologies.length == 0) {
      this.getTechonologies();
    }
    if (this.items.length == 0) {
      this.listTag();
    }
    this.showSearchBox = false;
    this.showDescSearchBox = false;
    this.showPublishBtn = true;
    this.getUcsDetails();
    this.varService.setValue(true);
  }

  getIndustries() {
    this.industriesLoaders = true;
    this.industries = [];
    let data = { type: "industries" };
    this.authenticationService
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
  functionLoader: boolean = false;
  getFunctions() {
    this.functionLoader = true;
    this.functions = [];
    let data = { type: "function" };
    this.authenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.functionLoader = false;
          if (result.statusCode == 200) {
            this.functions = result.body;
          } else {
            this.functions = [];
          }
        },
        (error: any) => {
          this.functionLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.functions = [];
          } else {
            this.functions = [];
          }
        }
      );
  }
  technoLoader: boolean = false;
  getTechonologies() {
    this.technoLoader = true;
    this.technologies = [];
    let data = { type: "technologies" };
    this.authenticationService
      .getMasters(data)
      .pipe()
      .subscribe(
        (result: any) => {
          this.technoLoader = false;
          if (result.statusCode == 200) {
            this.technologies = result.body;
          } else {
            this.technologies = [];
          }
        },
        (error: any) => {
          this.technoLoader = false;
          if (error.error.message != null && error.error.message != "") {
            this.technologies = [];
          } else {
            this.technologies = [];
          }
        }
      );
  }

  backToUscList() {
    this.viewUscList();
  }

  viewUscList() {
    this.viewUcsDetails = false;
    this.techlogies = [];
    this.ucsDetailsLoader = false;
    this.uscDtl = "";
    this.showSearchBox = true;
    this.showDescSearchBox = false;
    this.showPublishBtn = false;
    this.varService.setValue(true);
  }

  redirectUser() {
    if (this.authService.isAuthenticated()) {
      if (this.localStorageService.userDetails.roles == userRoles.cgAdmin) {
        this.RedirectDashboard();
      } else if (
        this.localStorageService.userDetails.roles == userRoles.startupAdmin ||
        this.localStorageService.userDetails.roles == userRoles.startupUser ||
        this.localStorageService.userDetails.roles == userRoles.startupGuestUser
      ) {
        this.redirectToStartupDashboard();
      } else if (
        this.localStorageService.userDetails.roles == userRoles.corporateAdmin ||
        this.localStorageService.userDetails.roles == userRoles.corporateUser ||
        this.localStorageService.userDetails.roles ==
        userRoles.corporateGuestUser
      ) {
        this.redirectToCorpDashboard();
      }
    }
  }

  redirectToStartupDashboard() {
    this.routerService.RedirectToStartupDashboard();
  }
  redirectToCorpDashboard() {
    this.routerService.RedirectToCorpDashboard();
  }
  RedirectDashboard() {
    this.routerService.redirectToCorpApplication();
  }
  checkAtleastOnEditable() {
    let noOfPristine = 0;
    let returnVal = false;
    let formKyes = Object.keys(this.ucsForm.controls);
    let i = 0;
    Object.values(this.ucsForm.controls).forEach((control) => {
      if (control["pristine"] == false) {
        this.saveUcsNew(formKyes[i]);
        this.ucsForm.controls[formKyes[i]].markAsPristine();
      }
      i++;
    });
    /*if (noOfPristine > 0) {
      this.toaster.success(
        "Information is saved successfully.","",{
          timeOut: 3000,
      });
      returnVal = true;
    }*/
    return returnVal;
  }
  saveUcsNew(name) {
    this.tagsError = false;
    this.shortDescError = false;
    this.functionError = false;
    this.industryError = false;
    let isInvalid: boolean = false;
    this.isPublishButtonClicked = false;
    if (name == "shortDesc") {
      let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
      if (shortDesc == "" || shortDesc == null) {
        this.toaster.error("Short description cannot be blank!", "", {
          timeOut: 2000,
        });
        isInvalid = true;
        this.shortDescError = true;
      } else {
        if (shortDesc.length > 500) {
          this.toaster.error(
            "Short description must not contains more then 500 characters!", "", {
            timeOut: 2000,
          });
          isInvalid = true;
          this.shortDescError = true;
        }
      }
    } else if (name == "longDesc") {
    } else if (name == "industry") {
      let industry = this.ucsForm.controls["industry"].value;
      if (industry == null || industry == undefined || industry == "") {
        this.toaster.error("Please select industry!", "", {
          timeOut: 2000,
        });
        this.industryError = true;
        isInvalid = true;
      }
    } else if (name == "function") {
      let funct = this.ucsForm.controls["function"].value;
      if (funct == null || funct == undefined || funct == "") {
        this.toaster.error("Please select function!", "", {
          timeOut: 2000,
        });
        isInvalid = true;
        this.functionError = true;
      }
    } else if (name == "selectedtags") {
      let selectedtags = this.ucsForm.controls["selectedtags"].value;

      if (selectedtags.length == 1) {
        if (selectedtags.value) {
          let seltags = selectedtags.value[0];
          if (seltags.key == "") {
            selectedtags = [];
          }
        }
      }
      if (
        selectedtags == null ||
        selectedtags == undefined ||
        selectedtags == "" ||
        selectedtags.length == 0
      ) {
        this.toaster.error("Please select at least one tag.", "", {
          timeOut: 2000,
        });
        this.tagsError = true;
        isInvalid = true;
      } else if (selectedtags.length > 3 && this.isStartup == true) {
        if (
          this.localStorageService.userDetails.roles ==
          userRoles.startupAdmin ||
          this.localStorageService.userDetails.roles == userRoles.startupUser
        ) {
          this.toaster.error("Maximum 3 tags are allowed.", "Tags not saved!", {
            timeOut: 2000,
          });
          isInvalid = true;
        }
      }
    } else if (name == "techonolgy") {
    }
    else if (name == "title") {
      let editTitle: any = this.editTitle;
      if (editTitle == "" && editTitle == null) {
        this.toaster.error("Please provide title!", "", {
          timeOut: 2000,
        });
        isInvalid = true;
      } else {
        if (!(editTitle.length >= this.ucstitleMinLength)) {
          this.toaster.error("Title must be at least " + this.ucstitleMinLength + " characters long.", "", {
            timeOut: 3000,
          });
          isInvalid = true;
        } else if (editTitle.length >= this.titleMaxLength) {
          this.toaster.error(
            "Title must not be greater " + this.titleMaxLength + " characters.", "", {
            timeOut: 3000,
          });
          isInvalid = true;
        }
      }
    } else if (name == "productExplainerVideos") {
      let productExplainerVideos = this.ucsForm.controls["productExplainerVideos"].value;
      if (productExplainerVideos != "") {
        if (!productExplainerVideos.match(/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/igm)) {
          this.toaster.error(
            "Please enter a valid URL", "", {
            timeOut: 3000,
          });
          // this.ucsForm.controls['productExplainerVideos'].setValue(this.overViewDetails.product_explainer_videos.productExplainerVideos);
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(""));
          isInvalid = true;
          return false;
        } else {
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(this.ucsForm.controls["productExplainerVideos"].value));
        }
      } else {
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(""));
      }
    } else if (name == "productExplainerVideos1") {
      let productExplainerVideos1 = this.ucsForm.controls["productExplainerVideos1"].value;
      if (productExplainerVideos1 != "") {
        if (!productExplainerVideos1.match(/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/igm)) {
          this.toaster.error(
            "Please enter a valid URL", "", {
            timeOut: 3000,
          });
          this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(""));
          // this.ucsForm.controls['productExplainerVideos1'].setValue(this.overViewDetails.product_explainer_videos.productExplainerVideos1);
          isInvalid = true;
          return false;

        } else {
          this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(this.ucsForm.controls["productExplainerVideos1"].value));
        }
      } else {
        this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.getVideoUrl(""));
      }
    } else if (name == "summary") {
      if (!this.ucsForm.get('summary').valid) {
        return false;
      }
    } else if (name == "enterprisePainPoint") {
      if (!this.ucsForm.get('enterprisePainPoint').valid) {
        return false;
      }
    } else if (name == "competitors") {
      if (!this.ucsForm.get('competitors').valid) {
        return false;
      }
    } else if (name == "maturityStage") {
      if (!this.ucsForm.get('maturityStage').valid) {
        return false;
      }
    } /* else if (name == "silentPoints") {
      if (!this.ucsForm.get('silentPoints').valid) {
        return false;
      }
    } */ else if (name == "contributeToROI") {
      if (!this.ucsForm.get('contributeToROI').valid) {
        return false;
      }
    } else if (name == "customerTestimonials") {
      if (!this.ucsForm.get('customerTestimonials').valid) {
        return false;
      }
    } else if (name == "customerTestimonials1") {
      if (!this.ucsForm.get('customerTestimonials1').valid) {
        return false;
      }
    } else if (name == "customerTestimonials2") {
      if (!this.ucsForm.get('customerTestimonials2').valid) {
        return false;
      }
    }  else if (name == "roi") {
      if (!this.ucsForm.get('roi').valid) {
        return false;
      }
    }  else if (name == "totalCustomers") {
      if (!this.ucsForm.get('totalCustomers').valid) {
        return false;
      }
    }

    if (!isInvalid) {
      this.updateucs().then(
        (res) => {
          if (res == 200) {
            if (!(name == "title")) {
              this.toaster.success("Information is saved successfully", "", {
                timeOut: 2000,
              });
              //this.makeEabelDisableForm(name, "disable");
            } else {
              this.toaster.success("Title updated successfully!", "", {
                timeOut: 2000,
              });
              this.isTitleEditable = false;
            }
          }
        },
        (error) => {
          this.isTitleEditable = false;
        }
      );
    }
  }

  updateucs() {
    return new Promise((resolve, reject) => {
      let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
      let longDesc = this.ucsForm.controls["longDesc"].value.trim();
      let industry = this.overViewDetails.industries[0];
      let funct = this.overViewDetails.functions[0];
      let techonolgy = this.overViewDetails.technologies;
      let selectedtags = this.overViewDetails.tags;
      let case_study_attachments = this.getfilename;
      let summary = this.ucsForm.controls["summary"].value.trim();
      let enterprisePainPoint = this.ucsForm.controls["enterprisePainPoint"].value.trim();
      let competitors = this.ucsForm.controls["competitors"].value.trim();
      let maturityStage = this.ucsForm.controls["maturityStage"].value.trim();
      //let silentPoints = this.ucsForm.controls["silentPoints"].value;
      let contributeToROI = this.ucsForm.controls["contributeToROI"].value.trim();
      let customerTestimonials = this.ucsForm.controls["customerTestimonials"].value.trim();
      let customerTestimonials1 = this.ucsForm.controls["customerTestimonials1"].value.trim();
      let customerTestimonials2 = this.ucsForm.controls["customerTestimonials2"].value.trim();
      let marqueeCustomers = this.ucsForm.controls["marqueeCustomers"].value.trim();
      let productExplainerVideos = this.ucsForm.controls["productExplainerVideos"].value.trim();
      let productExplainerVideos1 = this.ucsForm.controls["productExplainerVideos1"].value.trim();
      let annualRevenue = this.ucsForm.controls["annualRevenue"].value.trim();
      let roi = this.ucsForm.controls["roi"].value.trim();
      let totalCustomers = this.ucsForm.controls["totalCustomers"].value.trim();
      if (this.ucsForm.controls["industry"].value != "") {
        industry = this.ucsForm.controls["industry"].value;
      }
      if (this.ucsForm.controls["function"].value != "") {
        funct = this.ucsForm.controls["function"].value;
      }
      if (this.ucsForm.controls["techonolgy"].value) {
        techonolgy = this.ucsForm.controls["techonolgy"].value;
        if (techonolgy.length == 1) {
          if (techonolgy.value) {
            let selTechnoo = techonolgy.value[0];
            if (selTechnoo.key == "") {
              techonolgy = [];
            }
          }
        }
      }
      if (this.ucsForm.controls["selectedtags"].value) {
        selectedtags = this.ucsForm.controls["selectedtags"].value;
        if (selectedtags.length == 1) {
          if (selectedtags.value) {
            let seltags = selectedtags.value[0];
            if (seltags.key == "") {
              selectedtags = [];
            }
          }
        }
      }
      if (selectedtags) {
        let tags = selectedtags.join(",");
        selectedtags = tags;
      }
      let ucsTitle = this.editTitle != "" ? this.editTitle : this.ucsTitle;
      let data = {
        ucs_id: this.ucsId,
        user_id: this.userId,
        type: this.uscType,
        title: ucsTitle,
        short_description: shortDesc,
        long_description: longDesc,
        tags: selectedtags,
        status: this.publishedStatus,
        industries: [industry],
        functions: [funct],
        technologies: techonolgy,
        annual_recurring_revenue: annualRevenue,
        rol_of_solution: roi,
        total_number_of_customers: totalCustomers,
        marquee_customers: marqueeCustomers,
        case_study_attachments: case_study_attachments,
        product_explainer_videos: {
          productExplainerVideos,
          productExplainerVideos1,
        },
        testimonials: {
          customerTestimonials,
          customerTestimonials1,
          customerTestimonials2,
        },
        additional_fields: {
          summary: summary,
          enterprisePainPoint: enterprisePainPoint,
          competitors: competitors,
          maturityStage: maturityStage,
          //silentPoints: silentPoints,
          contributeToROI: contributeToROI,
        },
      };
      this.frontEndService
        .ucsUpdate(data)
        .pipe()
        .subscribe(
          (result: any) => {
            /*  this.overViewLoader=true; */
            if (result.statusCode == 200) {
              let updatedTerm = "Solution";
              if (this.uscType == UsecaseSolutoinTypes.solution) {
                updatedTerm = "Solution";
              }
              if (this.uscType == UsecaseSolutoinTypes.usecase) {
                updatedTerm = "Use case";
              }
              if (this.isPublishButtonClicked == true) {
                this.toaster.success(
                  updatedTerm + " has been published successfully!", "", {
                  timeOut: 2000,
                });
              } else { }
              this.isPublishButtonClicked = false;
              this.publishBtnLoader = false;
              resolve(result.statusCode);
              /* this.viewOverview(); */
            } else {
              reject(result.statusCode);
              this.isPublishButtonClicked = false;
              this.publishBtnLoader = false;
              this.errorMessage = "Something went wrong. Please try after sometime.";
            }
          },
          (error: any) => {
            reject(-1);
            this.isPublishButtonClicked = false;
            this.publishBtnLoader = false;
            if (error.error.message != null && error.error.message != "") {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = "Something went wrong. Please try after sometime.";
            }
          }
        );
    });
  }

  makeEabelDisableForm(name, flag) {
    this.technoError = false;
    if (this.ucs_user_role == userRoles.corporateGuestUser || this.ucs_user_role == userRoles.startupGuestUser) {
      this.ucsForm.controls[name].disable();
      this.ucsForm.controls[name].markAsPristine();
      this.toaster.error("As a guest user you cannot make changes.", "", {
        timeOut: 2000,
      });
    } else if ((name == 'industry' || name == 'function' || name == 'techonolgy' || name == 'selectedtags')
      && (this.ucsLength > 0 && this.publishedStatus == 'published')) {
      this.industryDisabled = true;
      this.ucsForm.controls[name].disable();
      this.ucsForm.controls[name].markAsPristine();
      this.toaster.error("You can't modify Industries, Functions, Technologies and Tags after getting a match.", "", {
        timeOut: 2000,
      });
    } else {
      if (flag == "enable") {

        if (name == "industry") {
          this.isIndustryDisabled = true;
        }
        if (name == "function") {
          this.isFunctionDisabled = true;
        }
        if (name == "techonolgy") {
          this.isTechoDisabled = false;
        }
        if (name == "selectedtags") {
          this.tagSelectIsEnable = true;
        }
        if (name == "shortDesc") {
          this.shortDescIsEnabled = true;
        }
        if (name == "longDesc") {
          this.longDescIsEnabled = true;
        }
        this.ucsForm.controls[name].enable();
        // $("#" + name).focus();
        $("#" + name).click();
      } else if (flag == "disable") {
        if (name == "industry") {
          this.isIndustryDisabled = false;
        }
        if (name == "function") {
          this.isFunctionDisabled = false;
        }
        if (name == "techonolgy") {
          this.isTechoDisabled = true;
        }
        if (name == "selectedtags") {
          this.tagSelectIsEnable = false;
        }
        if (name == "shortDesc") {
          this.shortDescIsEnabled = false;
        }
        if (name == "longDesc") {
          this.longDescIsEnabled = false;
        }
        this.ucsForm.controls[name].disable();
        this.ucsForm.controls[name].markAsPristine();
      }


    }
  }


  // close(event) {
  //   debugger;
  //   console.log(event);
  //  // this.iconValue =event.value;


  // }


  checkValue(val: any, controlName) {
    let chkVal = val;
    if (controlName == "shortDesc") {
      if (chkVal.trim() == "") {
        this.shortDescError = true;
      } else {
        this.shortDescError = false;
      }
    }
    if (controlName == "selectedtags") {
      if (chkVal.length == 0) {

        this.tagsError = false;
        return false;
      } else {
        if (chkVal.length > 3) {
          if (
            this.localStorageService.userDetails.roles ==
            userRoles.startupAdmin ||
            this.localStorageService.userDetails.roles == userRoles.startupUser
          ) {

            this.tagsError = true;
          } else {
            this.tagsError = false;
          }
        } else {
          this.tagsError = false;
        }
      }
    }
    if (controlName == "industry") {
      if (chkVal == "" || chkVal == null || chkVal == undefined) {
        this.industryError = true;
      } else {
        this.industryError = false;
      }
    }
    if (controlName == "function") {
      if (chkVal == "" || chkVal == null || chkVal == undefined) {
        this.functionError = true;
      } else {
        this.functionError = false;
      }
    }
    this.checkLenth = this.ucsForm.controls["selectedtags"].value.length;
    // if (this.checkLenth == 1) {
    //   this.toaster.error(
    //     "you can't delete all tags!", "", {
    //     timeOut: 2000,
    //   });
    // }

  }

  stopPromoting(isUcsPromoted) {
    let DialogConfig = {
      data: {
        ucsId: this.ucsId,
        checkbox: true,
        isUcsPromoted: isUcsPromoted,
        isDeleted: !isUcsPromoted,
        title: this.ucsTitle,
      },
      width: "544px",
      panelClass: "cust-share-modal",
    };
    const dialogRef = this.dialog.open(PromotePopupComponent, DialogConfig);
  }

  publish(type) {
    console.log(this.ucsForm.value)
    this.publishFormSubmitted = true;
    if (
      this.localStorageService.userDetails.roles !=
      userRoles.corporateGuestUser &&
      this.localStorageService.userDetails.roles != userRoles.startupGuestUser
    ) {
      this.isPublishButtonClicked = false;
      this.tagsError = false;
      this.shortDescError = false;
      this.shortError = false;
      this.casestudyError = false;
      this.functionError = false;
      this.technoError = false;
      this.industryError = false;
      this.enterprisePainPoint = false;
      this.competitors = false;
      this.maturityStage = false;
      //this.silentPoints = false;
      this.contributeToROI = false;
      this.marqueeCustomers = false;
      this.customerTestimonials1 = false;
      this.totalCustomers = false;
      this.videoUrl = false;
      this.roi = false;
      this.selectedtags = this.overViewDetails.tags;
      let selectedtags = this.overViewDetails.tags;
      let shortDesc = this.ucsForm.controls["shortDesc"].value.trim();
      let industry = this.overViewDetails.industries[0];
      let funct = this.overViewDetails.functions[0];
      let techonolgy = this.overViewDetails.technologies;
      let case_study_attachments = this.getfilename;
      let summary = this.ucsForm.controls["summary"].value.trim();
      let enterprisePainPoint = this.ucsForm.controls["enterprisePainPoint"].value.trim();
      let competitors = this.ucsForm.controls["competitors"].value.trim();
      let maturityStage = this.ucsForm.controls["maturityStage"].value.trim();
      //let silentPoints = this.ucsForm.controls["silentPoints"].value;
      let contributeToROI = this.ucsForm.controls["contributeToROI"].value.trim();
      let customerTestimonials = this.ucsForm.controls["customerTestimonials"].value.trim();
      let marqueeCustomers = this.ucsForm.controls["marqueeCustomers"].value.trim();
      let productExplainerVideos = this.ucsForm.controls["productExplainerVideos"].value.trim();
      let annualRevenue = this.ucsForm.controls["annualRevenue"].value.trim();
      let roi = this.ucsForm.controls["roi"].value.trim();
      let totalCustomers = this.ucsForm.controls["totalCustomers"].value.trim();
      if (this.ucsForm.controls["industry"].value != "") {
        industry = this.ucsForm.controls["industry"].value;
      }
      if (this.ucsForm.controls["function"].value != "") {
        funct = this.ucsForm.controls["function"].value;
      }
      if (this.ucsForm.controls["selectedtags"].value) {
        selectedtags = this.ucsForm.controls["selectedtags"].value;
        if (selectedtags.length == 1) {
          if (selectedtags.value) {
            let selTechnoo = selectedtags.value[0];
            if (selTechnoo.key == "") {
              selectedtags = [];
            }
          }
        }
      }
      if (this.ucsForm.controls["techonolgy"].value) {
        techonolgy = this.ucsForm.controls["techonolgy"].value;
        if (techonolgy.length == 1) {
          if (techonolgy.value) {
            let selTechnoo = techonolgy.value[0];
            if (selTechnoo.key == "") {
              techonolgy = [];
            }
          }
        }
      }
      if ((
        selectedtags.length < 1 ||
        techonolgy.length.length < 1 ||
        industry == null ||
        industry == undefined ||
        industry == "" ||
        techonolgy.lenth < 1 ||
        funct == null ||
        funct == undefined ||
        funct == "" ||
        summary == "" ||
        // case_study_attachments == null ||
        // case_study_attachments == undefined ||
        // case_study_attachments == "" ||
        enterprisePainPoint == "" ||
        competitors == "" ||
        maturityStage == "" ||
        customerTestimonials == "" ||
        //silentPoints == "" ||
        contributeToROI == ""  ||
        totalCustomers == ""
        ) && this.overViewDetails.type == 'solution' && this.overViewDetails.type != 'usecase') {

        if (selectedtags.length < 1) {
          this.tagsError = true;
        }
        if (techonolgy.length < 1) {
          this.technoError = true;
        }
        if (summary == "" || summary == null) {
          this.shortDescError = true;
        }
        if (enterprisePainPoint == "" || enterprisePainPoint == null) {
          this.enterprisePainPoint = true;
        }
        if (competitors == "" || competitors == null) {
          this.competitors = true;
        }
        if (competitors == "" || competitors == null) {
          this.competitors = true;
        }
        if (maturityStage == "" || maturityStage == null) {
          this.maturityStage = true;
        }
        if (marqueeCustomers == "" || marqueeCustomers == null) {
          this.marqueeCustomers = true;
        }
        if (customerTestimonials == "" || customerTestimonials == null) {
          this.customerTestimonials1 = true;
        }
/*         if (silentPoints == "" || silentPoints == null) {
          this.silentPoints = true;
        } */
        if (contributeToROI == "" || contributeToROI == null) {
          this.contributeToROI = true;
        }
        // if (productExplainerVideos == "" || productExplainerVideos == null) {
        //   this.videoUrl = true;
        // }
        // if (case_study_attachments == "" || case_study_attachments == null || industry == undefined) {
        //   this.casestudyError = true;
        // }
        if (industry == null || industry == undefined || industry == "") {
          this.industryError = true;
        }
        if (funct == null || funct == undefined || funct == "") {
          this.functionError = true;
        }
      if (totalCustomers == "" || totalCustomers == null) {
          this.totalCustomers = true;
        }
       if (roi == "" || roi == null) {
          this.roi = true;
        }
        this.isPublishButtonClicked = false;
        this.publishBtnLoader = false;
        this.toaster.error(
          "Please fill mandatory fields to publish.", "", {
          timeOut: 5000,
        });
      } else if ((shortDesc == "" || shortDesc == null || selectedtags.length < 1 || techonolgy.length.length < 1 || industry == null || industry == undefined || industry == "" || techonolgy.lenth < 1 || funct == null || funct == undefined || funct == "") && this.overViewDetails.type != 'solution' && this.overViewDetails.type == 'usecase') {
        if (selectedtags.length < 1) {
          this.tagsError = true;
        }
        if (techonolgy.length < 1) {
          this.technoError = true;
        }
        if (shortDesc == "" || shortDesc == null) {
          this.shortError = true;
        }
        if (industry == null || industry == undefined || industry == "") {
          this.industryError = true;
        }
        if (funct == null || funct == undefined || funct == "") {
          this.functionError = true;
        }
        this.isPublishButtonClicked = false;
        this.publishBtnLoader = false;
        this.toaster.error(
          "Tags, Industry, Function, Technology and Short Description are mandatory to publish.", "", {
          timeOut: 5000,
        });
      } else {
        let isPending: boolean = false;
        if (selectedtags.length > 3 && this.isStartup == true) {
          this.toaster.error("Maximum 3 tags are allowed.", "", {
            timeOut: 2000,
          });
          isPending = true;
        }
        if (type == "solution" && this.ucsForm.invalid) {
          this.toaster.error(
            "Please fill mandatory fields to publish.", "", {
            timeOut: 5000,
          });
          return false;
        }
        if (type == "solution") {
          if (this.ucsForm.controls["productExplainerVideos"].value != "") {
            if (!this.ucsForm.controls["productExplainerVideos"].value.match(/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/igm)) {
              this.toaster.error(
                "Please enter a valid URL", "", {
                timeOut: 3000,
              });
              return false;

            }
          }

          if (this.ucsForm.controls["productExplainerVideos1"].value != "") {
            if (!this.ucsForm.controls["productExplainerVideos1"].value.match(/^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/igm)) {
              this.toaster.error(
                "Please enter a valid URL", "", {
                timeOut: 3000,
              });
              return false;
            }
          }

        }

        if (!isPending) {
          this.publishedStatus = "published";
          this.isPublishButtonClicked = true;
          this.publishBtnLoader = true;
          this.updateucs().then(
            (res) => {
              if (res == 200) {
                this.publicStatusUpdate.emit(this.publishedStatus);
                this.frontEndService
                  .checkrelevantdata(this.ucsId)
                  .pipe()
                  .subscribe(
                    (result: any) => {
                      if (result.message == "success") {
                      } else {
                        this.errorMessage = "Something went wrong. Please try after sometime.";
                      }
                    },
                    (error: any) => {
                      if (error.error.message != null && error.error.message != "") {
                      } else {
                        this.errorMessage =
                          "Something went wrong. Please try after sometime.";
                      }
                    }
                  );
              }
            },
            (error) => { }
          );
        }
      }
    } else {
      this.toaster.error("As a guest user you cannot make changes.", "", {
        timeOut: 2000,
      });
    }
  }

  getDownloadPath(path) {
    window.open(
      this.donwnloadPath + "download/resource/" + path,
      "_blank" // <- This is what makes it open in a new window.
    );
  }

  uploadResLoader: boolean = false;
  fileUpoadTest: File = null;
  uploadDocument(fileUpoadTest: File) {
    this.uploadResLoader = true;
    let errorMessage = "";
    let doc_name = fileUpoadTest.name;
    const formData: FormData = new FormData();
    let org_id = this.localStorageService.userDetails.organization_id;
    let size = this.frontEndService.formatBytes(fileUpoadTest.size);
    formData.append("ucs_id", this.ucsId);
    formData.append("org_id", org_id);
    formData.append("user_id", this.userId);
    formData.append("file", fileUpoadTest, doc_name);
    this.frontEndService.uploadDocuments(formData).subscribe(
      (data: any) => {
        this.uploadResLoader = false;
        this.fileUpoadTest = null;
        if (data.statusCode == 200) {
          this.toaster.success("Document uploaded successfully!", "", {
            timeOut: 2000,
          });
          this.casestudyError = false;
          this.documentList.unshift(data.body);
          this.getfilename = data.body[0].file;
          this.updateucs();
          //this.getResourses();
        } else {
          this.errorMessage =
            "Something went wrong. Please try after sometime.";
          this.toaster.error(errorMessage, "", {
            timeOut: 2000,
          });
        }
      },
      (error) => {
        this.fileUpoadTest = null;
        this.uploadResLoader = false;
        if (error.error.message != null && error.error.message != "") {
          errorMessage = error.error.message;
        } else {
          errorMessage = "Something went wrong. Please try after sometime.";
        }
        this.toaster.error(errorMessage, "", {
          timeOut: 3000,
        });
      }
    );
  }
  handle1FileInput(files: FileList) {
    this.fileUpoadTest = null;
    this.fileUpoadTest = files.item(0);
    if (this.fileUpoadTest) {
      let file = this.fileUpoadTest;
      if (this.commonService.chkValidDocumentFileExt(file)) {
        if (file.size > 20971520) {
          this.toaster.error("Your upload file size is too big!", "", {
            timeOut: 3000,
          });
        } else {
          if (this.commonService.chkValidDocumentFileExt(file)) {
            this.uploadDocument(file);
          } else {
            this.toaster.error("Only docx,pdf and pptx files are acceptable!", "", {
              timeOut: 3000,
            });
          }
        }
      } else {
        this.toaster.error("Please upload file only docx,pdf and pptx.!", "", {
          timeOut: 3000,
        });
      }
    }
  }

  getDownloadDocumentPath(path) {
    window.open(
      this.donwnloadPath + "download/" + path,
      "_blank" // <- This is what makes it open in a new window.
    );
  }

  addmoretestimonial(value: any) {

    if (this.subtesti) {
      this.addtesti1 = true;
      this.subcuttesti1 = true;
      this.testimonial2 = true;
    } else {
      this.addtesti = true;
      this.subtesti = true;
      this.testimonial1 = true;
    }
  }

  removeTestimonial(value: any) {
    if (value == 1) {
      if (this.testimonial2) {
        this.addtesti = true;
        this.subtesti = true;
        this.testimonial1 = true;

        this.addtesti1 = false;
        this.subcuttesti1 = false;
        this.testimonial2 = false;

        this.ucsForm.controls["customerTestimonials2"].value
        this.ucsForm.controls["customerTestimonials1"].setValue(this.ucsForm.controls["customerTestimonials2"].value);
        this.ucsForm.controls["customerTestimonials2"].setValue("");

      } else {
        this.addtesti = false;
        this.subtesti = false;
        this.testimonial1 = false;

        this.addtesti1 = false;
        this.subcuttesti1 = false;
        this.testimonial2 = false;

        this.ucsForm.controls["customerTestimonials1"].setValue("");
        this.ucsForm.controls["customerTestimonials2"].setValue("");

      }
    } else {
      this.addtesti = true;
      this.subtesti = true;
      this.testimonial1 = true;

      this.addtesti1 = false;
      this.subcuttesti1 = false;
      this.testimonial2 = false;
      this.ucsForm.controls["customerTestimonials2"].setValue("");

    }
  }

  getUrlonchange(path) {
    path = this.donwnloadPath + "download/resource/" + path;
    if (this.checkvaluetype == 1) {
      this.ucsForm.controls["productExplainerVideos"].setValue(path);
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getVideoUrl(path)
      );
    }
    if (this.checkvaluetype == 2) {
      this.ucsForm.controls["productExplainerVideos1"].setValue(path);
      this.url1Safe = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.getVideoUrl(path)
      );
    }
    this.updateucs();
    this.closeDialog();
  }

  isMp4Url(urlSafe) {
    return urlSafe && urlSafe.changingThisBreaksApplicationSecurity && urlSafe.changingThisBreaksApplicationSecurity.indexOf('.mp4') > 0;
  }



  getResourses() {
    this.resourseLoader = true;
    this.resourceList = [];
    let errorMessage = ""
    this.frontEndService
      .getResources(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          this.resourseLoader = false;
          if (result.statusCode == 200) {
            this.resourceList = result.body.filter(x => x.file.includes('.mp4'));
          } else {
            this.resourceList = [];
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          this.resourseLoader = false;
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
          this.resourceList = [];
        }
      );
  }
  dropdwonEabelDisable() {
    if (this.ucsLength > 0) {
      this.enabled = true;
    }
    else {
      this.enabled = false;
    }
  }

  // Get selected resources index
  changeResource(index, event, file) {
    this.selectedResource = "checkebox_" + index;
    if (event.target.checked) {
      this.isFileSelected = true;
      this.selectedFileName = file;
    } else {
      this.isFileSelected = false;
      this.selectedFileName = "";

    }
  }

  selectResource() {
    if (this.selectedFileName != "") {
      this.getUrlonchange(this.selectedFileName)
    }
  }

  // REmove uploaded resources
  removeRes(resId) {
    Swal.fire({
      title: '',
      text: "Are you sure you want to delete this case study attachment?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#46448B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        var ucsId = this.overViewDetails._id;
        this.frontEndService
          .deleteCaseStudyAttachment(ucsId)
          .pipe()
          .subscribe(
            (result: any) => {
              if (result.statusCode == 200) {
                this.toaster.success(result.message, "", {
                  timeOut: 2000,
                });
                this.getfilename = "";
                /* Swal.fire('Deleted!', 'Resource has been deleted.', 'success'); */
              } else {
                this.errorMessage =
                  "Something went wrong. Please try after sometime.";
                this.toaster.error(this.errorMessage, "", {
                  timeOut: 2000,
                });
              }
            },
            (error: any) => {
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
    });
  }


  fileAlreadyExist(event) {
    this.toaster.error("Please delete the uploaded attachment. To upload new attachment.", "", {
      timeOut: 2000,
    });
    return false;
  }

}

