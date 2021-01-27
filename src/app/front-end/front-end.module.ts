import { MatDialogModule } from '@angular/material/dialog';
import { FilterPipe, filterDiscussionPipe, filterPipeLinesPipe } from "./../shared/services/pipes";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrontEndService } from "./services/front-end.service";
import { FrontendRoutingModule } from "./frontend-routing.module";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { EditUcsComponent } from "./edit-ucs/edit-ucs.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import { MatListModule } from "@angular/material/list";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressButtonsModule } from "mat-progress-buttons";
import { FrontendDashboardComponent } from "./frontend-dashboard/frontend-dashboard.component";
//import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { OrgProfileComponent } from "./org-profile/org-profile.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { AuthenticationService } from "../authentication/services/authentication.service";
import { MatGoogleMapsAutocompleteModule } from "@angular-material-extensions/google-maps-autocomplete";
import { AddChatTopicComponent } from './edit-ucs/add-chat-topic/add-chat-topic.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangePasswordComponent } from './org-profile/change-password/change-password.component';
import { AttachmentsComponent } from './edit-ucs/attachments/attachments.component';
import { SupportComponent } from './support/support.component';
import { UcsDetailsComponent } from './ucs-details/ucs-details.component';
import { MatChipsModule } from '@angular/material/chips';
import { SharePopupComponent } from './frontend-dashboard/share-popup/share-popup.component';
import { UserListPopupComponent } from './frontend-dashboard/user-list-popup/user-list-popup.component';
import { UscDetailsSidebarComponent } from './ucs-details/usc-details-sidebar/usc-details-sidebar.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { ClipboardModule } from 'ngx-clipboard';
import {AutosizeModule} from 'ngx-autosize';

import { OverviewComponent } from './edit-ucs/overview/overview.component';
import { SolutionsComponent } from './edit-ucs/solutions/solutions.component';
import { PipelineComponent } from './edit-ucs/pipeline/pipeline.component';
import { ResourcesComponent } from './edit-ucs/resources/resources.component';
import { DiscussionComponent } from './edit-ucs/discussion/discussion.component';
import { EvaluateComponent } from './edit-ucs/evaluate/evaluate.component';
import {MatMenuModule} from '@angular/material/menu';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { Global } from '../shared/models/global.model';
import { RequiredsignDirectiveModule } from '../util/directive/text-count.directive';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {UsdOnlyDirectiveModule} from '../util/directive/currency-commas.pipe';
import {PercentageMaskDirectiveModule} from '../util/directive/percentage-mask.directive';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [
    FrontendDashboardComponent,
    EditUcsComponent,
    FilterPipe,
    filterDiscussionPipe,
    filterPipeLinesPipe,
    OrgProfileComponent,
    UserProfileComponent,
    AddChatTopicComponent,
    ChangePasswordComponent,
    AttachmentsComponent,
    SupportComponent,
    UcsDetailsComponent,
    SharePopupComponent,
    UserListPopupComponent,
    UscDetailsSidebarComponent,
    OverviewComponent,
    SolutionsComponent,
    PipelineComponent,
    ResourcesComponent,
    DiscussionComponent,
    EvaluateComponent
  ],
  imports: [
    ScrollingModule,
    CKEditorModule,
    HighlightModule,
    MatProgressButtonsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgSelectModule,
    MatListModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FrontendRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatGoogleMapsAutocompleteModule,
    MatDialogModule,
    MatChipsModule,
    MatSlideToggleModule,
    CarouselModule.forRoot(),
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    ClipboardModule,
    AutosizeModule,
    MatMenuModule,
    RequiredsignDirectiveModule,
    TooltipModule.forRoot(),
    UsdOnlyDirectiveModule,
    PercentageMaskDirectiveModule
  ],
  providers: [Global,FrontEndService, AuthenticationService, {
    provide: HIGHLIGHT_OPTIONS,
    useValue: {
      fullLibraryLoader: () => import('highlight.js'),
    }
  }],
})
export class FrontEndModule { }
