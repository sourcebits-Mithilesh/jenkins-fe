import { ValidatorFn, AbstractControl } from '@angular/forms';

export const trimValidator: ValidatorFn = (control: AbstractControl) => {
  if (control.value) {
    if (control.value.startsWith(' ')) {
      return {
        trimError: true
      };
    }
    if (control.value.endsWith(' ')) {
      return {
        trimError: true
      };
    }

    return null;
  }
};
