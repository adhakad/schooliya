import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSettingRoutingModule } from './admin-setting-routing.module';
import { AdminSettingComponent } from './admin-setting.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';


@NgModule({
  declarations: [
    AdminSettingComponent
  ],
  imports: [
    CommonModule,
    AdminSettingRoutingModule,
    AdminSharedModule
  ]
})
export class AdminSettingModule { }
