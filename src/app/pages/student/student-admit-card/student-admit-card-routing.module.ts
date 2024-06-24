import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentAdmitCardComponent } from './student-admit-card.component';

const routes: Routes = [
  {path:'',component:StudentAdmitCardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentAdmitCardRoutingModule { }
