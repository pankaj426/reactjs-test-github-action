import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SharedVarService } from './../../shared/services/shared-var.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { AuthenticationService } from './../services/authentication.service';
import { RouterService } from 'src/app/shared/services/router.service';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit {
  
  overViewDetails: any = "";
  ucsId = "";
  constructor(
    public VarService: SharedVarService, 
    private routerService: RouterService, 
    private toaster: ToastrService, 
    private AuthenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private titleService: Title, 
    private metaService: Meta) { }

  ngOnInit(): void {
    this.ucsId = "";
    this.route.params.subscribe((params) => {
      this.ucsId = params.id != null && params.id !== undefined ? params.id : "";
      if (this.ucsId != "" ) {
        this.getUcsDetail();
      }
    });
  }

  getUcsDetail() {
    this.overViewDetails = "";
    let errorMessage = "";
    this.AuthenticationService
      .ucsDetailsPage(this.ucsId)
      .pipe()
      .subscribe(
        (result: any) => {
          if (result.message == "success") {
            this.overViewDetails = result.body[0];
            this.titleService.setTitle(this.overViewDetails.title);
            this.metaService.addTag({ property: 'og:title', content: this.overViewDetails.title });
            this.metaService.addTag({ property: 'og:description', content: this.overViewDetails.short_description });
          } else {
            this.overViewDetails = "";
            errorMessage =
              "Something went wrong. Please try after sometime.";
          }
        },
        (error: any) => {
          if (error.error.message != null && error.error.message != "") {
            errorMessage = error.error.message;
            this.overViewDetails = "";
          } else {
            errorMessage =
              "Something went wrong. Please try after sometime.";
            this.overViewDetails = "";
          }
        }
      );
  }

}
