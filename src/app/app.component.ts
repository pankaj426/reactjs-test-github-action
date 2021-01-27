import { LocalStorageService } from './shared/services/local-storage.service';
import { AuthService } from './shared/services/auth.service';
import { Component , OnInit} from '@angular/core';
import {userRoles} from './shared/constants/enum';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  RouterEvent
} from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { RouterService } from './shared/services/router.service';
import { HeaderComponent } from './layout/header/header.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  currentUrl: string;
  showLoadingIndicatior = true;
  public userRoles=userRoles  ;
  static authenticated = false;
  classRefenrence = AppComponent;
  constructor(public _router: Router, location: PlatformLocation,public localStorageService:LocalStorageService,public authService: AuthService) {
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicatior = true;
        location.onPopState(() => {
          // window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicatior = false;
      }
      // if (this.currentUrl = 'signin') {
      //   HeaderComponent.authenticated= false;
      // }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit(){
    AppComponent.authenticated = this.authService.isAuthenticated();
  }

 
}
