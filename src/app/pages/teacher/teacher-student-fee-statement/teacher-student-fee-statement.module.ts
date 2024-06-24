import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherStudentFeeStatementRoutingModule } from './teacher-student-fee-statement-routing.module';
import { TeacherStudentFeeStatementComponent } from './teacher-student-fee-statement.component';
import { TeacherSharedModule } from '../teacher-shared/teacher-shared.module';


@NgModule({
  declarations: [
    TeacherStudentFeeStatementComponent
  ],
  imports: [
    CommonModule,
    TeacherStudentFeeStatementRoutingModule,
    TeacherSharedModule
  ]
})
export class TeacherStudentFeeStatementModule { }
