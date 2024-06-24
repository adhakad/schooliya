import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultComponent } from './result.component';
import { MainSharedModule } from '../main-shared/main-shared.module';


@NgModule({
  declarations: [
    ResultComponent
  ],
  imports: [
    CommonModule,
    ResultRoutingModule,
    MainSharedModule
  ]
})
export class ResultModule { }
