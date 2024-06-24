import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminStudentClsRoutingModule } from './admin-student-cls-routing.module';
import { AdminStudentClsComponent } from './admin-student-cls.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';


@NgModule({
  declarations: [
    AdminStudentClsComponent
  ],
  imports: [
    CommonModule,
    AdminStudentClsRoutingModule,
    AdminSharedModule
  ]
})
export class AdminStudentClsModule { }
