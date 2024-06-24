import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOnlineAdmissionComponent } from './admin-online-admission.component';

const routes: Routes = [
  { path: '', component: AdminOnlineAdmissionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOnlineAdmissionRoutingModule { }
