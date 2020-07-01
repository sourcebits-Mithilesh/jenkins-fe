import { AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[noSpaceValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TrimspaceDirective,
      multi: true
    }
  ]
})
export class TrimspaceDirective {
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    const formValue = control.value;
    if (formValue) {
      if (formValue.startsWith(' ')) {
        return {
          trimError: true
        };
      }
      if (formValue.endsWith(' ')) {
        return {
          trimError: true
        };
      }

      return null;
    }
  }
}
