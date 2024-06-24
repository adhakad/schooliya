import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherFeesCollectionComponent } from './teacher-fees-collection.component';

const routes: Routes = [
  { path: '', component: TeacherFeesCollectionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherFeesCollectionRoutingModule { }
