import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminOnlineAdmissionRoutingModule } from './admin-online-admission-routing.module';
import { AdminOnlineAdmissionComponent } from './admin-online-admission.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';


@NgModule({
  declarations: [
    AdminOnlineAdmissionComponent
  ],
  imports: [
    CommonModule,
    AdminOnlineAdmissionRoutingModule,
    AdminSharedModule
  ]
})
export class AdminOnlineAdmissionModule { }
