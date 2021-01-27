import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockedComponent } from "./locked/locked.component";
import { Page404Component } from "./page404/page404.component";
import { Page500Component } from "./page500/page500.component";
import { ChangepasswordComponent } from "./changepassword/changepassword.component";
import { CoporateApplicationFormComponent } from "./coporate-application-form/coporate-application-form.component";
import { StartupApplicationFormComponent } from "./startup-application-form/startup-application-form.component";
import { RegisterComponent } from "./register/register.component";
import { DetailsComponent } from "./details/details.component";
import { StartUpRegisterComponent } from "./start-up-register/start-up-register.component";
import { environment } from 'src/environments/environment';
import { GuestRegisterComponent} from './guest-register/guest-register.component';
let env = environment;

const home = env.home;
const homeBasePath = home.basePath;

const changePasswordBasePath = home.changePassword;
const signinBasePath = home.signin;
const forgotPasswordBasePath = home.forgotPassword;
const detailBasePath = home.details;
const corpAppForm = home.corpAppForm;
const startupAppForm = home.startupAppForm;
const corpRegistraion = home.corpRegistraion;
const startupRegistration = home.startupRegistration;
const registerStartupApp = home.registerStartupApp;
const guestRegistration = home.guestRegistrationForm;

const routes: Routes = [
  {
    path: changePasswordBasePath,
    component: ChangepasswordComponent,
  },
  {
    path: signinBasePath,
    component: SigninComponent,
  },
  {
    path: forgotPasswordBasePath,
    component: ForgotPasswordComponent,
  },
  {
    path: corpAppForm,
    component: CoporateApplicationFormComponent,
  },
  {
    path: registerStartupApp,
    component: StartupApplicationFormComponent,
  },
  {
    path: startupAppForm,
    component: StartupApplicationFormComponent,
  },
  {
    path: corpRegistraion,
    component: RegisterComponent,
  },
  {
    path: startupRegistration,
    component: StartUpRegisterComponent,
  },
  {
    path: detailBasePath,
    component: DetailsComponent,
  },
  {
    path: guestRegistration,
    component: GuestRegisterComponent,
  },
  {
    path: "locked",
    component: LockedComponent,
  },
  {
    path: "page404",
    component: Page404Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
  {
    path: "",
    redirectTo: signinBasePath,
    pathMatch: "full",
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule { }
