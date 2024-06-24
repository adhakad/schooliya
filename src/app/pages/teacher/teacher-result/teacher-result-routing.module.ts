import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherResultComponent } from './teacher-result.component';

const routes: Routes = [
  { path: '', component: TeacherResultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherResultRoutingModule { }
