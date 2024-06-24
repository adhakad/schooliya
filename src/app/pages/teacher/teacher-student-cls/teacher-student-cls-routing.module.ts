import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherStudentClsComponent } from './teacher-student-cls.component';

const routes: Routes = [
  { path: '', component: TeacherStudentClsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherStudentClsRoutingModule { }
