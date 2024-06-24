import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherResultRoutingModule } from './teacher-result-routing.module';
import { TeacherResultComponent } from './teacher-result.component';
import { TeacherSharedModule } from '../teacher-shared/teacher-shared.module';


@NgModule({
  declarations: [
    TeacherResultComponent
  ],
  imports: [
    CommonModule,
    TeacherResultRoutingModule,
    TeacherSharedModule
  ]
})
export class TeacherResultModule { }
