import { RouterService } from 'src/app/shared/services/router.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss'],
})
export class Page404Component implements OnInit {
  constructor(private routerService: RouterService) { }
  ngOnInit() { }
  redirectToLogin() {
    this.routerService.RedirectToLogin();
  }
}
