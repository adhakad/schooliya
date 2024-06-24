import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherStudentClsRoutingModule } from './teacher-student-cls-routing.module';
import { TeacherStudentClsComponent } from './teacher-student-cls.component';
import { TeacherSharedModule } from '../teacher-shared/teacher-shared.module';


@NgModule({
  declarations: [
    TeacherStudentClsComponent
  ],
  imports: [
    CommonModule,
    TeacherStudentClsRoutingModule,
    TeacherSharedModule
  ]
})
export class TeacherStudentClsModule { }
