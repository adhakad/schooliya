import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationPageRoutingModule } from './notification-page-routing.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { NotificationPageComponent } from './notification-page.component';


@NgModule({
  declarations: [
    NotificationPageComponent
  ],
  imports: [
    CommonModule,
    NotificationPageRoutingModule,
    AdminSharedModule,
  ]
})
export class NotificationPageModule { }
