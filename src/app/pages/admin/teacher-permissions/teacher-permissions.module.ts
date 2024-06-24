import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherPermissionsRoutingModule } from './teacher-permissions-routing.module';
import { TeacherPermissionsComponent } from './teacher-permissions.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';


@NgModule({
  declarations: [
    TeacherPermissionsComponent
  ],
  imports: [
    CommonModule,
    TeacherPermissionsRoutingModule,
    AdminSharedModule
  ]
})
export class TeacherPermissionsModule { }
