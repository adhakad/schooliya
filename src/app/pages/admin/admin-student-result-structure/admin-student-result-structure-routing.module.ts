import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStudentResultStructureComponent } from './admin-student-result-structure.component';

const routes: Routes = [
  { path: '', component: AdminStudentResultStructureComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStudentResultStructureRoutingModule { }
