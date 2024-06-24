import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavigationComponent } from './header-navigation.component';
import { MaterialUiModule } from 'src/app/material/material-ui/material-ui.module';
import { StudentDashboardRoutingModule } from '../../student-dashboard/student-dashboard-routing.module';



@NgModule({
  declarations: [
    HeaderNavigationComponent
  ],
  imports: [
    CommonModule,
    MaterialUiModule,
    StudentDashboardRoutingModule
  ],
  exports:[
    HeaderNavigationComponent
  ]
})
export class HeaderNavigationModule { }
