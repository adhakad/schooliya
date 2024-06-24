import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChunkPipe } from '../chunk.pipe';
import { ClassSuffixPipe } from '../class-suffix.pipe';
import { DateToWordsPipe } from '../date-to-words.pipe';



@NgModule({
  declarations: [
    ChunkPipe,
    ClassSuffixPipe,
    DateToWordsPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ChunkPipe,
    ClassSuffixPipe,
    DateToWordsPipe
  ]
})
export class SharedPipeModule { }
