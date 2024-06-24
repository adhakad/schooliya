import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentLoginRoutingModule } from './student-login-routing.module';
import { StudentLoginComponent } from './student-login.component';
import { MainSharedModule } from 'src/app/pages/main/main-shared/main-shared.module';


@NgModule({
  declarations: [
    StudentLoginComponent
  ],
  imports: [
    CommonModule,
    StudentLoginRoutingModule,
    MainSharedModule
  ]
})
export class StudentLoginModule { }
