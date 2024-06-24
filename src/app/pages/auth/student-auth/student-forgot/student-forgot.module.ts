import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentForgotRoutingModule } from './student-forgot-routing.module';
import { StudentForgotComponent } from './student-forgot.component';
import { MainSharedModule } from 'src/app/pages/main/main-shared/main-shared.module';


@NgModule({
  declarations: [
    StudentForgotComponent
  ],
  imports: [
    CommonModule,
    StudentForgotRoutingModule,
    MainSharedModule
  ]
})
export class StudentForgotModule { }
