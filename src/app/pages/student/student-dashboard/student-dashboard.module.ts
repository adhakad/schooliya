import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDashboardRoutingModule } from './student-dashboard-routing.module';
import { StudentSharedModule } from '../student-shared/student-shared.module';
import { StudentDashboardComponent } from './student-dashboard.component';


@NgModule({
  declarations: [
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    StudentDashboardRoutingModule,
    StudentSharedModule
  ]
})
export class StudentDashboardModule { }
