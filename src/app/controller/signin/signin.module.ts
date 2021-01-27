import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
//import { AuthenticationRoutingModule } from "./authentication-routing.module";
//import { Page500Component } from "./page500/page500.component";
//import { Page404Component } from "./page404/page404.component";
//import { SigninComponent } from "./signin/signin.component";
//import { SignupComponent } from "./signup/signup.component";
//import { LockedComponent } from "./locked/locked.component";
//import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AuthenticationService } from "../../authentication/services/authentication.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
//import { ChangepasswordComponent } from "./changepassword/changepassword.component";
//import { CoporateApplicationFormComponent } from "./coporate-application-form/coporate-application-form.component";
//import { StartupApplicationFormComponent } from "./startup-application-form/startup-application-form.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatProgressBarModule } from '@angular/material/progress-bar';
//import { RegisterComponent } from './register/register.component';
//import { StartUpRegisterComponent } from './start-up-register/start-up-register.component';

import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
//import { SingupPageHeaderComponent } from './singup-page-header/singup-page-header.component';
//import { GuestRegisterComponent } from './guest-register/guest-register.component';
//import { RequiredsignDirectiveModule } from '../util/directive/text-count.directive';

import { SigninRoutingModule } from '../signin/signin-routing.module';
import { SigninnComponent } from '../signin/signin.component';
@NgModule({
  declarations: [
    SigninnComponent
    /* Page500Component,
    Page404Component,
    SigninComponent,
    SignupComponent,
    LockedComponent,
    ForgotPasswordComponent,
    ChangepasswordComponent,
    CoporateApplicationFormComponent,
    StartupApplicationFormComponent,
    RegisterComponent,
    StartUpRegisterComponent,
    SingupPageHeaderComponent,
    GuestRegisterComponent */
  ],
  imports: [
    SigninRoutingModule,
    MatGoogleMapsAutocompleteModule,
    CommonModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule,
    //AuthenticationRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MaterialFileInputModule,
    MultiSelectAllModule,
    MatProgressBarModule,
    //RequiredsignDirectiveModule
  ],
  providers: [AuthenticationService],
})
export class SigninModule { }

