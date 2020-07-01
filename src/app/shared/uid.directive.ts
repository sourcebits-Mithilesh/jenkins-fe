import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[UIDConfiguration]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UidDirective,
      multi: true
    }
  ]
})
export class UidDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): { [key: string]: any } | null {
    //const srnoVal = control.value.toString();
    let srnoVal=control.value;
    if (srnoVal) {
      srnoVal=control.value.toString();
      const length = srnoVal.split('').length;
      const srno = srnoVal.split('');
      if (
        length === 7 &&
        srno[0] >= '1' &&
        srno[0] <= '9' &&
        srno[1] >= '0' &&
        srno[1] <= '9' &&
        srno[2] >= '0' &&
        srno[2] <= '9' &&
        srno[3] >= '0' &&
        srno[3] <= '9' &&
        srno[4] >= '0' &&
        srno[4] <= '9' &&
        srno[5] >= '0' &&
        srno[5] <= '9' &&
        srno[6] >= '0' &&
        srno[6] <= '9'
      ) {
        return null;
      }
      return { notUID: true };
    }
  }
}
