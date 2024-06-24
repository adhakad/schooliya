import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSettingClsComponent } from './admin-setting-cls.component';

const routes: Routes = [
  { path: '', component: AdminSettingClsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSettingClsRoutingModule { }
