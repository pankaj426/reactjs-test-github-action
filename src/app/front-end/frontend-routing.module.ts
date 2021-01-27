import { UcsDetailsComponent } from './ucs-details/ucs-details.component';
import { SupportComponent } from './support/support.component';
import { ChangePasswordComponent } from './org-profile/change-password/change-password.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { environment } from "../../environments/environment";
import { AuthGuard } from '../shared/guards/auth-guard.service';
import { FrontendDashboardComponent } from './frontend-dashboard/frontend-dashboard.component';
import { EditUcsComponent } from "./edit-ucs/edit-ucs.component";

import { UserProfileComponent } from './user-profile/user-profile.component';
import { OrgProfileComponent } from './org-profile/org-profile.component';
import { OverviewComponent } from './edit-ucs/overview/overview.component';
import { SolutionsComponent } from './edit-ucs/solutions/solutions.component';
import { PipelineComponent } from './edit-ucs/pipeline/pipeline.component';
import { ResourcesComponent } from './edit-ucs/resources/resources.component';
import { DiscussionComponent } from './edit-ucs/discussion/discussion.component';
import { EvaluateComponent } from './edit-ucs/evaluate/evaluate.component';

const home = environment.home;
const signinBasePath = home.signin;
const frontendBasePath = environment.frontend.basePath.replace(environment.frontend.basePath, localStorage.getItem('company'));
function convertToSlug(Text) {
    return Text
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        ;
} const startupBasePath = environment.frontend.startup.basePath;
const corpBasePath = environment.frontend.corporate.basePath;
const satartupDashboard = frontendBasePath + environment.frontend.startup.dashboard;
const corporateDashboard = corpBasePath + "/" + environment.frontend.corporate.dashboard;
const corporateProfile = corpBasePath + "/" + environment.frontend.corporate.profile;
const corporateUserProfile = corpBasePath + "/" + environment.frontend.corporate.userProfile;
const corporateChangePass = corpBasePath + "/" + environment.frontend.corporate.changePass;
const starupProfile = startupBasePath + "/" + environment.frontend.startup.profile;
const startupUserProfile = startupBasePath + "/" + environment.frontend.startup.userProfile;
const startupChangePass = startupBasePath + "/" + environment.frontend.startup.changePass;
const startupSupport = startupBasePath + "/" + environment.frontend.startup.support;
const corporateSupport = corpBasePath + "/" + environment.frontend.corporate.support;
const overview = environment.frontend.overview;
const solution = environment.frontend.solution;
const pipeline = environment.frontend.pipeline;
const discussion = environment.frontend.discussion;
const resource = environment.frontend.resource;
const evaluate = environment.frontend.evaluate;
const editUcsPath = environment.frontend.editUcs;
const ucsDetailPath = environment.frontend.ucsDetail;
const routes: Routes = [
    {
        path: environment.frontend.startup.dashboard,
        component: FrontendDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: corporateDashboard,
        component: FrontendDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: corporateProfile,
        component: OrgProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: overview,
        component: OverviewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: evaluate,
        component: EvaluateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: pipeline,
        component: PipelineComponent,
        canActivate: [AuthGuard]
    },
    {
        path: discussion,
        component: DiscussionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: resource,
        component: ResourcesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: solution,
        component: SolutionsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: corporateUserProfile,
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: starupProfile,
        component: OrgProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: startupUserProfile,
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: corporateChangePass,
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: startupChangePass,
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: startupSupport,
        component: SupportComponent,
        canActivate: [AuthGuard]
    },
    {
        path: corporateSupport,
        component: SupportComponent,
        canActivate: [AuthGuard]
    },
    {
        path: editUcsPath,
        component: EditUcsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: ucsDetailPath,
        component: UcsDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "",
        redirectTo: signinBasePath,
        pathMatch: "full",
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class FrontendRoutingModule { }