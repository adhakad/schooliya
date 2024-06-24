import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentFeesStatementRoutingModule } from './student-fees-statement-routing.module';
import { StudentFeesStatementComponent } from './student-fees-statement.component';
import { StudentSharedModule } from '../student-shared/student-shared.module';


@NgModule({
  declarations: [
    StudentFeesStatementComponent
  ],
  imports: [
    CommonModule,
    StudentFeesStatementRoutingModule,
    StudentSharedModule
  ]
})
export class StudentFeesStatementModule { }
