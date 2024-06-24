import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSignupRoutingModule } from './admin-signup-routing.module';
import { AdminSignupComponent } from './admin-signup.component';
import { MainSharedModule } from 'src/app/pages/main/main-shared/main-shared.module';


@NgModule({
  declarations: [
    AdminSignupComponent
  ],
  imports: [
    CommonModule,
    AdminSignupRoutingModule,
    MainSharedModule
  ]
})
export class AdminSignupModule { }
