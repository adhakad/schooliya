import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './side-navigation.component';
import { MaterialUiModule } from 'src/app/material/material-ui/material-ui.module';
import { StudentDashboardRoutingModule } from '../../student-dashboard/student-dashboard-routing.module';



@NgModule({
  declarations: [
    SideNavigationComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule,
    StudentDashboardRoutingModule
  ],
  exports:[
    SideNavigationComponent
  ]
})
export class SideNavigationModule { }
