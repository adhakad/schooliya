import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classSuffix'
})
export class ClassSuffixPipe implements PipeTransform {

  transform(classNumber: number): any {
    if (classNumber >= 4 && classNumber <= 12) {
      return `${classNumber}TH`;
    }
    if(classNumber==1){
      return `${classNumber}ST`;
    }
    if(classNumber==2){
      return `${classNumber}ND`;
    }
    if(classNumber==3){
      return `${classNumber}RD`;
    }
    if(classNumber==200){
      return `NURSERY`
    }
    if(classNumber==201){
      return `LKG`
    }
    if(classNumber==202){
      return `UKG`
    }
  }

}