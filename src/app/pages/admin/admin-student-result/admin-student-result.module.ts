import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStudentResultRoutingModule } from './admin-student-result-routing.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { AdminStudentResultComponent } from './admin-student-result.component';

@NgModule({
  declarations: [
    AdminStudentResultComponent,
  ],
  imports: [
    CommonModule,
    AdminStudentResultRoutingModule,
    AdminSharedModule,
  ]
})
export class AdminStudentResultModule { }
