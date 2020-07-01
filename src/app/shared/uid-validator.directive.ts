import { AbstractControl } from '@angular/forms';

export function validateUID(
  control: AbstractControl
): { [key: string]: any } | null {
  const srnoVal = control.value.toString();
  if (srnoVal) {
    const srno =  srnoVal.split('');
    if (
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
