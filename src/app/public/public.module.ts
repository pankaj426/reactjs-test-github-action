import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthenticationService } from "../authentication/services/authentication.service";
import { DetailsComponent } from './details/details.component';
import { PublicRoutingModule } from "./public-routing.module";
@NgModule({
    declarations: [
     
      DetailsComponent
    ],
    imports: [
        
        PublicRoutingModule
    ],
    providers: [AuthenticationService],
  })
  export class PublicModule { }
  