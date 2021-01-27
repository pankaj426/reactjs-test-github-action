
import { Injectable } from '../../../../node_modules/@angular/core';
import { PromotionsComponent } from 'src/app/administrator/corporate/promotions/promotions.component';
//import { IUser } from '../models/user';
export class LocalStorageService {
  private readonly _authToken: string = 'accessToken';
  private readonly _userDetails: string = 'user_details';
  private readonly _marqueeCustomers: string = 'marqueeCustomers';
  constructor () { }

  get authToken(): string {
    if (localStorage.getItem(this._authToken) !== null) {
      return localStorage.getItem(this._authToken);
    }
    return null;
  }


  set authToken(value: string) {
    if (value !== null && value !== '' && value !== undefined) {
      localStorage.setItem(this._authToken, value);
    }
    else {
      if (localStorage.getItem(this._authToken) !== null) {
        localStorage.removeItem(this._authToken);
      }
    }
  }

  get userDetails() {
    if (localStorage.getItem(this._userDetails) !== null) {
      return JSON.parse(atob(localStorage.getItem(this._userDetails)));
    }
    return null;
  }

  set userDetails(value: any) {
    if (value !== null && value !== undefined) {
      localStorage.setItem(this._userDetails, btoa((unescape(encodeURIComponent(value)))));
    }
    else {
      if (localStorage.getItem(this._userDetails) !== null) {
        localStorage.removeItem(this._userDetails);
      }
    }
  }

  get marqueeCustomers() {
    if (localStorage.getItem(this._marqueeCustomers) !== null) {
      return JSON.parse(atob(localStorage.getItem(this._marqueeCustomers)));
    }
    return null;
  }

  set marqueeCustomers(value: any) {
    if (value !== null && value !== undefined) {
      localStorage.setItem(this._marqueeCustomers, btoa((unescape(encodeURIComponent(value)))));
    }
    else {
      if (localStorage.getItem(this._marqueeCustomers) !== null) {
        localStorage.removeItem(this._marqueeCustomers);
      }
    }
  }
  
}
