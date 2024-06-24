import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherPermissionsComponent } from './teacher-permissions.component';

const routes: Routes = [
  { path: '', component: TeacherPermissionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherPermissionsRoutingModule { }
