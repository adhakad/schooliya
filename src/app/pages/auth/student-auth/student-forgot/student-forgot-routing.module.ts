import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentForgotComponent } from './student-forgot.component';

const routes: Routes = [
  { path: '', component: StudentForgotComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentForgotRoutingModule { }
