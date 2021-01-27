import { Router, NavigationExtras } from "@angular/router";
import { CommonService } from "./common.service";
import { RoleType } from "../../shared/constants/enum";
import { LocalStorageService } from "./local-storage.service";
import { SessionStorageService } from "./session-storage.service";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
declare var $: any;
let env = environment;


const frontendBasePath = environment.frontend.basePath.replace(environment.frontend.basePath, localStorage.getItem('company'));
const publicBasePath = environment.public.basePath;
function convertToSlug(Text) {
    return Text
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        ;
}
const home = env.home;
const homeBasePath = home.basePath;
const signin = "/" + homeBasePath + "/" + home.signin;
const corpAppForm = "/" + homeBasePath + "/" + home.corpAppForm;
const startupAppForm = "/" + homeBasePath + "/" + home.startupAppForm.replace(":id", "");

const registerStartupApp = "/" + homeBasePath + "/" + home.registerStartupApp
const admin = env.admin;
const adminBasePath = admin.basePath;

const fortnend = env.frontend;
const forntBasePath = frontendBasePath;

const adminDashBoardBasePath = "/" + admin.dashboard;
const promotionPath = "/" + admin.corporates.promotions;
const corpBasePath = "/" + admin.corporates.basePath;
const startupsBasePath = "/" + admin.startups.basePath;
const adminDashBoardPath = "/" + adminBasePath + adminDashBoardBasePath;
const corpPromotionPath = "/" + adminBasePath + corpBasePath + promotionPath;
const corporatePath = "/" + adminBasePath + corpBasePath
const startupsPath = "/" + adminBasePath + startupsBasePath;

const corpAppPath = corporatePath + "/" + admin.corporates.applications;
const startupAppPath = startupsPath + "/" + admin.startups.applications;

const startupDashBoardPath = "/" + forntBasePath + "/" + fortnend.startup.dashboard;
//const corpDashBoardPath = "/" + forntBasePath + "/" + fortnend.corporate.basePath + "/" + fortnend.corporate.dashboard;
const corpDashBoardPath = "/" + forntBasePath + "/" + fortnend.corporate.dashboard;
const startupeditUcsPath = "/" + forntBasePath + "/" + fortnend.editUcs.replace(":editucs", "");
const UcsDetialPath = "/" + forntBasePath + "/" + fortnend.ucsDetail.replace(":id", "");
const corpPofile = "/" + forntBasePath + "/" + fortnend.corporate.basePath + "/" + fortnend.corporate.profile;
const corpUserProfile = "/" + forntBasePath + "/" + fortnend.corporate.basePath + "/" + fortnend.corporate.userProfile;
const corpChangePass = "/" + forntBasePath + "/" + fortnend.corporate.basePath + "/" + fortnend.corporate.changePass;
const corpSupport = "/" + forntBasePath + "/" + fortnend.corporate.basePath + "/" + fortnend.corporate.support;

const startupProfile = "/" + forntBasePath + "/" + fortnend.startup.basePath + "/" + fortnend.startup.profile;
const startupUserProfile = "/" + forntBasePath + "/" + fortnend.startup.basePath + "/" + fortnend.startup.userProfile;
const startupChangePass = "/" + forntBasePath + "/" + fortnend.startup.basePath + "/" + fortnend.startup.changePass;
const startupSupportPath = "/" + forntBasePath + "/" + fortnend.startup.basePath + "/" + fortnend.startup.support;

@Injectable({
    providedIn: "root"
})
export class RouterService {
    private readonly extras: NavigationExtras = { skipLocationChange: true };



    constructor(
        private router: Router,
        private commonService: CommonService,
        private LocalStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService
    ) { }
    private roleType = RoleType;

    public adminMenu: any = {
        dashboard: adminDashBoardPath,
        promotions: corpPromotionPath,
        corporates: corpAppPath,
        startups: startupAppPath
    }

    public RedirectHome() {
        this.router.navigate(["/"], { skipLocationChange: false });
    }
    
    public redirectToCorpApplication() {
        $('body').removeClass('bg-change');
        this.router.navigate([corpAppPath], { skipLocationChange: false });
    }
    public redirectToStartupApplication() {
        $('body').removeClass('bg-change');
        this.router.navigate([startupAppPath], { skipLocationChange: false });
    }
    public redirectToPromotions() {
        $('body').removeClass('bg-change');
        this.router.navigate([corpPromotionPath], { skipLocationChange: false });
    }
    public RedirectAdminDashboard() {
        let path = adminDashBoardPath;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public RedirectCorpSupport() {
        let path = corpSupport;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }

    public RedirectStartupSupport() {
        let path = startupSupportPath;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public RedirectToStartupDashboard() {
        let path = startupDashBoardPath;
        this.router.navigate([path], {
             skipLocationChange: false
            // skipLocationChange: true
        });
    }
    public redirectoEditditUcs(title, id) {
        $('body').addClass('bg-change');
        let path = startupeditUcsPath;
        this.router.navigate([path, title], {
            skipLocationChange: false
        });
    }
    public redirectoUcsDetail(id) {
        let path = UcsDetialPath;
        this.router.navigate([path, id], {
            skipLocationChange: false
        });
    }
    public RedirectToCorpDashboard() {
        let path = corpDashBoardPath;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    
    public RedirectToLogin() {
        let path = signin;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectToCorpApplicationAppy() {
        let path = corpAppForm;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectToStartUpApplicationAppy(id: any = "") {
        if (id != "") {
            let path = startupAppForm;
            this.router.navigate([path, id], {
                skipLocationChange: false
            });
        } else {
            let path = registerStartupApp
            this.router.navigate([path], {
                skipLocationChange: false
            });
        }
    }
    public redirectToCorpProfile() {
        let path = corpPofile;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectToCorpUserProfile() {
        let path = corpUserProfile;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectToStartupProfile() {
        let path = startupProfile;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectToStartupUserProfile() {
        let path = startupUserProfile;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectTostartupChangePass() {
        let path = startupChangePass;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public redirectTocorpChangePass() {
        let path = corpChangePass;
        this.router.navigate([path], {
            skipLocationChange: false
        });
    }
    public RedirectProfile() {
        this.commonService.smoothScroll();
        this.commonService.hideBreaCrumMenuOnResponsive();
        this.commonService.removeFixHeaderFromInnerPages();
        this.router.navigate(["/user/profile"], { skipLocationChange: false });
    }

    public RedirectChangePassword() {
        this.commonService.smoothScroll();
        this.commonService.hideBreaCrumMenuOnResponsive();
        this.commonService.removeFixHeaderFromInnerPages();
        this.router.navigate(["/user/change-password"], {
            skipLocationChange: false
        });
    }
    public redirectoEditditUcsOnNewPage(title, id) {
        $('body').addClass('bg-change');
        let path = startupeditUcsPath;
        let url = this.router.createUrlTree([path, title]);
        window.open(url.toString(), '_blank')
    }
    //---------------------------------------------------------------
    /* public RedirectDashboard() {
    this.commonService.smoothScroll();
    this.commonService.hideBreaCrumMenuOnResponsive();
    this.commonService.removeFixHeaderFromInnerPages();
    let path = "/user/dashboard";
    if (this.LocalStorageService.userDetails) {
    let loginUser: any = this.sessionStorageService.userDetails;
    if (loginUser.role_type == this.roleType.professional) {
    this.RedirectProDashboard();
    } else if (loginUser.role_type == this.roleType.channel_partner) {
    this.RedirectPartnerDashboard();
    } else {
    this.router.navigate([path], {
    skipLocationChange: false
    });
    }
    } else {
    this.router.navigate([path], {
    skipLocationChange: false
    });
    }
    } */

}