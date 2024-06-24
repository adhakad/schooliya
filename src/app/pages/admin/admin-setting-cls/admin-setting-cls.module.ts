import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSettingClsRoutingModule } from './admin-setting-cls-routing.module';
import { AdminSettingClsComponent } from './admin-setting-cls.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';

@NgModule({
  declarations: [
    AdminSettingClsComponent,
  ],
  imports: [
    CommonModule,
    AdminSettingClsRoutingModule,
    AdminSharedModule,
  ]
})
export class AdminSettingClsModule { }
