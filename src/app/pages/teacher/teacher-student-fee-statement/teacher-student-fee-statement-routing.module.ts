import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherStudentFeeStatementComponent } from './teacher-student-fee-statement.component';

const routes: Routes = [
  { path: '', component: TeacherStudentFeeStatementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherStudentFeeStatementRoutingModule { }
