import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmitCardComponent } from './admit-card.component';

const routes: Routes = [
  { path: '', component: AdmitCardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardRoutingModule { }
