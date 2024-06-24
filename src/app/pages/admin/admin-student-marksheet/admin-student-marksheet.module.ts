import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminStudentMarksheetRoutingModule } from './admin-student-marksheet-routing.module';
import { AdminStudentMarksheetComponent } from './admin-student-marksheet.component';


@NgModule({
  declarations: [
    AdminStudentMarksheetComponent
  ],
  imports: [
    CommonModule,
    AdminStudentMarksheetRoutingModule
  ]
})
export class AdminStudentMarksheetModule { }
