import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[SerialConfiguration]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SerialDirective,
      multi: true
    }
  ]
})
export class SerialDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): { [key: string]: any } | null {
    const srnoVal = control.value;
    if (srnoVal) {
      const length = control.value.split('').length;
      const srno = srnoVal.split('');
      const letters = /^[A-Z]+$/;
      const mMonth = /^[A-M]+$/;
      const num = /^[0-9]+$/;
      const currDate = new Date()
        .getFullYear()
        .toString()
        .substr(-2)
        .split('');
      if (
        length === 10 &&
        srno[0].match(letters) &&
        srno[1].match(letters) &&
        srno[2].match(num) &&
        srno[3].match(num) &&
        srno[4].match(mMonth) &&
        srno[5].match(num) &&
        srno[6].match(num) &&
        srno[7].match(num) &&
        srno[8].match(num) &&
        srno[9].match(num)
      ) {
        return null;
      }
      return { notSerial: true };
    }
  }
}
