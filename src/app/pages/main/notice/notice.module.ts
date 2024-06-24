import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeRoutingModule } from './notice-routing.module';
import { NoticeComponent } from './notice.component';
import { MainSharedModule } from '../main-shared/main-shared.module';


@NgModule({
  declarations: [
    NoticeComponent
  ],
  imports: [
    CommonModule,
    NoticeRoutingModule,
    MainSharedModule
  ]
})
export class NoticeModule { }
