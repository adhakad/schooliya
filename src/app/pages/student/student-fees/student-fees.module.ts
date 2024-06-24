import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentFeesRoutingModule } from './student-fees-routing.module';
import { StudentFeesComponent } from './student-fees.component';
import { StudentSharedModule } from '../student-shared/student-shared.module';


@NgModule({
  declarations: [
    StudentFeesComponent
  ],
  imports: [
    CommonModule,
    StudentFeesRoutingModule,
    StudentSharedModule

  ]
})
export class StudentFeesModule { }
