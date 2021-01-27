import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService, private localStorageService: LocalStorageService) { }

  fileBaseUrl: string = environment.services.files.baseUrl + environment.services.files.profileImage;

  public isAuthenticated(): boolean {
    const token = this.localStorageService.authToken;
  
    // Check whether the token is expired and return
    // true or false
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    else {
      return false;
    }
  }


  public getUserDetails(): any {
    if (this.localStorageService.userDetails) {
      let loginUser = this.localStorageService.userDetails;
      loginUser.avatar = this.fileBaseUrl + loginUser.id + '/' + loginUser.avatar
      return loginUser;
    } else {
      return {}
    }
  }

}
