import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'patterncheck'
})
export class PatterncheckPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let return_ = value ? /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/.test(value) : null;
    return return_;
  }

}
