import { AbstractControl } from '@angular/forms';

export function validateConfigCode(
  control: AbstractControl
): { [key: string]: any } | null {
  const confNo = control.value;
  if (confNo) {
    //regex for configuration number
    const confValidation = /[PBF240|PBF480]{6}\/[T04|T07|T10|X04|X07|X10|M07|M14|Z07|Z14|M21|T01|X01|T15|T30|T50]{3}\-[STD|HOD|SHO|LBD|WAD|COD|HPP|SSS|HOS|SHS|LBS|WAS|COS]{3}\-[LW|FW]{2}\-[2H|4H|6H]{2}\-[P1|P2|P3|P4]{2}\-[XXX|APP|ATM|ATP|ATC]{3}\-[I|O|M]{1}\-[XX|PS]{2}/gm;
    if (confNo.match(confValidation)) {
      return null;
    } else {
      return { notConfigration: true };
    }
  }
}
