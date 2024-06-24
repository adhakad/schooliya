import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminStudentResultStructureRoutingModule } from './admin-student-result-structure-routing.module';
import { AdminStudentResultStructureComponent } from './admin-student-result-structure.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';


@NgModule({
  declarations: [
    AdminStudentResultStructureComponent
  ],
  imports: [
    CommonModule,
    AdminStudentResultStructureRoutingModule,
    AdminSharedModule
  ]
})
export class AdminStudentResultStructureModule { }
