import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { environment } from 'src/environments/environment';

import { DetailsComponent } from './details/details.component';


const routes: Routes = [
    {
      path: "detail/:id",
      component: DetailsComponent,
    }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class PublicRoutingModule { }