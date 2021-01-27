import { SharedVarService } from './shared/services/shared-var.service';
import { FrontEndService } from './front-end/services/front-end.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgbModalConfig,
  NgbModal,
  NgbModule,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { DynamicScriptLoaderService } from './shared/services/dynamic-script-loader.service';
import { RightSidebarService } from './shared/services/rightsidebar.service';
import { HttpService } from "./shared/services/http.service";
import { SessionStorageService } from "./shared/services/session-storage.service";
import { RouterService } from "./shared/services/router.service";
import { AuthService } from "./shared/services/auth.service";
import { JwtModule, JwtModuleOptions } from "@auth0/angular-jwt";
import { ErrorHandlerService } from "./shared/services/error-handler.service";
import { DateParserFormaterService } from "./shared/services/date-parser-formater.service";
import { CommonService } from "./shared/services/common.service";
import { MatSelectModule } from "@angular/material/select";
import { LocalStorageService } from "./shared/services/local-storage.service";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaskModule } from 'ngx-mask';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgmCoreModule } from '@agm/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from "./shared/interceptors/token.interceptor";
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { RecaptchaModule } from 'ng-recaptcha';
import { AuthGuard } from './shared/guards/auth-guard.service';
import { DateFormatService } from './shared/services/date-format.service';
import { ToastrModule } from 'ngx-toastr';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ClipboardModule } from 'ngx-clipboard';
import { AutosizeModule } from 'ngx-autosize';
import { ModalModule } from 'ngx-bootstrap/modal';
/* 
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; */
// import { CarouselModule } from 'ngx-bootstrap/carousel';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};
export function tokenGetter() {
  return localStorage.getItem("accessToken");
}

const JWT_Module_Options: JwtModuleOptions = {
  config: {
    tokenGetter: tokenGetter
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent
  ],
  imports: [
    FlexLayoutModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAlmgP5aivpxh-n4YSGxPdVqHnKRo4o6qw',
      libraries: ['places']
    }),
    HighlightModule,
    MatGoogleMapsAutocompleteModule,
    BrowserModule,
    MatSelectModule,
    RecaptchaModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    ClickOutsideModule,
    MultiSelectAllModule,
    // CarouselModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }), // ToastrModule added
    /*   BsDropdownModule.forRoot(),
      NgxIntlTelInputModule, */
    NgxMaskModule.forRoot(),
    JwtModule.forRoot(JWT_Module_Options),
    ClipboardModule,
    AutosizeModule, 
    ModalModule.forRoot(),
    /* AgmCoreModule.forRoot(), */
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuard,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    },
    
    DynamicScriptLoaderService,
    RightSidebarService,
    NgbModalConfig,
    NgbModal,
    NgbActiveModal,
    HttpService,
    SessionStorageService,
    RouterService,
    AuthService,
    ErrorHandlerService,
    DateParserFormaterService,
    CommonService,
    LocalStorageService,
    DateFormatService,
    FrontEndService,
    SharedVarService
  ],
  entryComponents: [
    /* SimpleDialogComponent,
    DialogformComponent,
    BottomSheetOverviewExampleSheet, */
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
