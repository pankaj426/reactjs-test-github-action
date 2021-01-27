import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdministratorRoutingModule } from "./administrator-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AdministratorService } from "./services/administrator.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CorporateApplicationListComponent } from './corporate/corporate-application-list/corporate-application-list.component';
import { ApplicationDetailsComponent } from './corporate/application-details/application-details.component';
import { StartupApplicationListComponent } from './startups/startup-application-list/startup-application-list.component';
import { DashboardComponent } from '../administrator/dashboard/dashboard.component'
import { MatDialogModule } from '@angular/material/dialog';

import { ChartsModule as chartjsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MorrisJsModule } from 'angular-morris-js';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PromotionsComponent } from './corporate/promotions/promotions.component';
import { RejectPopupComponent } from './reject-popup/reject-popup.component';
import { PomoationLinkPopupComponent } from './corporate/promotions/pomoation-link-popup/pomoation-link-popup.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ClipboardModule } from 'ngx-clipboard';
@NgModule({
  declarations: [
    CorporateApplicationListComponent,
    ApplicationDetailsComponent,
    StartupApplicationListComponent,
    DashboardComponent,
    PromotionsComponent,
    PomoationLinkPopupComponent,
    RejectPopupComponent
  ],
  imports: [
    CommonModule,
    HighlightModule,
    RecaptchaModule,
    FormsModule,
    ReactiveFormsModule,
    AdministratorRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MaterialFileInputModule,
    MultiSelectAllModule,
    MatProgressBarModule,
    MatDialogModule,
    chartjsModule,
    NgxEchartsModule,
    MorrisJsModule,
    PerfectScrollbarModule,
    NgApexchartsModule,
    ClipboardModule
  ],
  providers: [AdministratorService, {
    provide: HIGHLIGHT_OPTIONS,
    useValue: {
      fullLibraryLoader: () => import('highlight.js'),
    }
  }],
})
export class AdministratorModule { }
