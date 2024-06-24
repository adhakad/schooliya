import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStudentResultComponent } from './admin-student-result.component';

const routes: Routes = [
  { path: '', component: AdminStudentResultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStudentResultRoutingModule { }
