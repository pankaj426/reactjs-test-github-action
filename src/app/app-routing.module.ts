import { Page404Component } from './authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./shared/guards/auth-guard.service";
import { environment } from "../environments/environment";

import { FormsModule } from '@angular/forms';
const adminBasePath = environment.admin.basePath;
const homeBasePath = environment.home.basePath;
const frontendBasePath = environment.frontend.basePath.replace(environment.frontend.basePath, localStorage.getItem('company'));
const publicBasePath = environment.public.basePath;
function convertToSlug(Text) {
return Text
.replace(/ /g, '-')
.replace(/[^\w-]+/g, '')
;
}
const routes: Routes = [
{
path: adminBasePath,
loadChildren: () =>
import('./' + adminBasePath + '/' + adminBasePath + '.module').then(m => m.AdministratorModule),
canActivate: [AuthGuard]
},
{
path: homeBasePath,
loadChildren: () =>
import('./' + homeBasePath + '/' + homeBasePath + '.module').then(
m => m.AuthenticationModule
)
}
,
{
path: publicBasePath,
loadChildren: () =>
import('./public/public.module').then(
m => m.PublicModule
)
},
{
path: frontendBasePath,
loadChildren: () =>
import('./front-end/front-end' + '.module').then(
m => m.FrontEndModule
)
},
{
path: '',
redirectTo: homeBasePath,
pathMatch: 'full'
},
{
  path: 'signin-new',
  //canActivate:[AuthGuard],
  loadChildren: () => import('./controller/signin/signin.module').then(mod => mod.SigninModule)
},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
