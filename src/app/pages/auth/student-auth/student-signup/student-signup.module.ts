import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentSignupRoutingModule } from './student-signup-routing.module';
import { StudentSignupComponent } from './student-signup.component';
import { MainSharedModule } from 'src/app/pages/main/main-shared/main-shared.module';


@NgModule({
  declarations: [
    StudentSignupComponent
  ],
  imports: [
    CommonModule,
    StudentSignupRoutingModule,
    MainSharedModule
  ]
})
export class StudentSignupModule { }
