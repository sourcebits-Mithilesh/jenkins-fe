import { AbstractControl } from '@angular/forms';

export function validateSerialNo(
  control: AbstractControl
): { [key: string]: any } | null {
  const srnoVal = control.value;
  if (srnoVal) {
    const length = control.value.split('').length;
    const srno = srnoVal.split('');
    const letters = /^[A-Z]+$/;
    const mMonth = /^[A-M]+$/;
    const num = /^[0-9]+$/;
    if (
      length === 10 &&
      // srno[0] >= '1' &&
      // srno[0] <= '9' &&
      // srno[1] >= '0' &&
      // srno[1] <= '9' &&
      // srno[2] >= '0' &&
      // srno[2] <= '9' &&
      // srno[3] >= '0' &&
      // srno[3] <= '9' &&
      // srno[4] >= '0' &&
      // srno[4] <= '9' &&
      // srno[5] >= '0' &&
      // srno[5] <= '9' &&
      // srno[6] >= '0' &&
      // srno[6] <= '9' &&
      // srno[7] === '.' &&
      srno[0].match(letters) &&
      srno[1].match(letters) &&
      srno[2].match(num) &&
      srno[3].match(num) &&
      srno[4].match(mMonth) &&
      srno[5].match(num) &&
      srno[6].match(num) &&
      srno[7].match(num) &&
      srno[8].match(num) &&
      srno[8].match(num)
    ) {
      return null;
    }
    return { notSerial: true };
  }
}
