import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentFeesComponent } from './student-fees.component';

const routes: Routes = [
  { path: '', component: StudentFeesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentFeesRoutingModule { }
