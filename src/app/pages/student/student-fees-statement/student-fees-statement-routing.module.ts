import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentFeesStatementComponent } from './student-fees-statement.component';

const routes: Routes = [
  { path: '', component: StudentFeesStatementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentFeesStatementRoutingModule { }
