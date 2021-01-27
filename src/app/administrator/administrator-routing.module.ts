import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CorporateApplicationListComponent } from "./corporate/corporate-application-list/corporate-application-list.component";
import { environment } from "../../environments/environment";
import { StartupApplicationListComponent } from "./startups/startup-application-list/startup-application-list.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../shared/guards/auth-guard.service';
import { PromotionsComponent } from './corporate/promotions/promotions.component';
const home = environment.home;
const signinBasePath = home.signin;
const adminDashboard = environment.admin.dashboard;
const corpApplications =
  environment.admin.corporates.basePath +
  "/" +
  environment.admin.corporates.applications;
const startApplications =
  environment.admin.startups.basePath +
  "/" +
  environment.admin.startups.applications;
const corpPromotions = environment.admin.corporates.basePath + 
  "/" +
  environment.admin.corporates.promotions;
const routes: Routes = [
  {
    path: "",
    redirectTo: signinBasePath,
    pathMatch: "full",
  },
  {
    path: corpApplications,
    component: CorporateApplicationListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: startApplications,
    component: StartupApplicationListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: adminDashboard,
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: corpPromotions,
    component: PromotionsComponent,
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministratorRoutingModule { }
