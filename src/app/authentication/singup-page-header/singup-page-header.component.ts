import { RouterService } from './../../shared/services/router.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-singup-page-header',
  templateUrl: './singup-page-header.component.html',
  styleUrls: ['./singup-page-header.component.sass']
})
export class SingupPageHeaderComponent implements OnInit {
  @Input('title') title: any;
  constructor(public routerServices: RouterService) { }

  ngOnInit(): void {
  }
  redirectToLogin() {
    this.routerServices.RedirectToLogin();
  }
}
