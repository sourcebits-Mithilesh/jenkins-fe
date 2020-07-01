import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appSelectValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SelectRequiredValidatorDirectiveDirective,
      multi: true
    }
  ]
})
export class SelectRequiredValidatorDirectiveDirective {
  validate(control: AbstractControl): { [key: string]: any } | null {
    const seletValue = control.value;
    if (seletValue === '-1') {
      return { defaultSelect: true };
    }
    return null;
  }
}
