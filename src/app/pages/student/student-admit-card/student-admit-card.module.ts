import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentAdmitCardRoutingModule } from './student-admit-card-routing.module';
import { StudentAdmitCardComponent } from './student-admit-card.component';
import { StudentSharedModule } from '../student-shared/student-shared.module';


@NgModule({
  declarations: [
    StudentAdmitCardComponent
  ],
  imports: [
    CommonModule,
    StudentAdmitCardRoutingModule,
    StudentSharedModule
  ]
})
export class StudentAdmitCardModule { }
