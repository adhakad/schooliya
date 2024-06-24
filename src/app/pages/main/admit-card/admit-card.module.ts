import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmitCardRoutingModule } from './admit-card-routing.module';
import { AdmitCardComponent } from './admit-card.component';
import { MainSharedModule } from '../main-shared/main-shared.module';


@NgModule({
  declarations: [
    AdmitCardComponent
  ],
  imports: [
    CommonModule,
    AdmitCardRoutingModule,
    MainSharedModule
  ]
})
export class AdmitCardModule { }
