import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSignupComponent } from './admin-signup.component';

const routes: Routes = [
  { path: '', component: AdminSignupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSignupRoutingModule { }
