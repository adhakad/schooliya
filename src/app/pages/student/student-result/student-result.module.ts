import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentResultRoutingModule } from './student-result-routing.module';
import { StudentResultComponent } from './student-result.component';
import { StudentSharedModule } from '../student-shared/student-shared.module';


@NgModule({
  declarations: [
    StudentResultComponent
  ],
  imports: [
    CommonModule,
    StudentResultRoutingModule,
    StudentSharedModule
  ]
})
export class StudentResultModule { }
