import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninnComponent } from './signin.component';
const routes: Routes = [
  {
    path: '',
    component: SigninnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigninRoutingModule { }

