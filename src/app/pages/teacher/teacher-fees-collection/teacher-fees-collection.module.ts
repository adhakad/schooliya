import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherFeesCollectionRoutingModule } from './teacher-fees-collection-routing.module';
import { TeacherFeesCollectionComponent } from './teacher-fees-collection.component';
import { TeacherSharedModule } from '../teacher-shared/teacher-shared.module';


@NgModule({
  declarations: [
    TeacherFeesCollectionComponent
  ],
  imports: [
    CommonModule,
    TeacherFeesCollectionRoutingModule,
    TeacherSharedModule
  ]
})
export class TeacherFeesCollectionModule { }
