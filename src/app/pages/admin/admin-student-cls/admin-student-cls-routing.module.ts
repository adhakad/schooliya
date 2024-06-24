import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStudentClsComponent } from './admin-student-cls.component';

const routes: Routes = [
  { path: '', component: AdminStudentClsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStudentClsRoutingModule { }
