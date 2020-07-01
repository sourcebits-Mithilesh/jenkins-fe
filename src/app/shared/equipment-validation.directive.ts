import { Directive } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
  NG_ASYNC_VALIDATORS
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[uniqueSerial]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: EquipmentValidationDirective,
      multi: true
    }
  ]
})
export class EquipmentValidationDirective implements AsyncValidator {
  url = environment.BASE_URI;
  constructor(private http: HttpClient) {}
  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.http
      .post(`${this.url}/checkequipment`, { equipment_sn: control.value })
      .pipe(
        map(
          (users: any) => {
            return users &&
              users.status != 'Success' &&
              localStorage.getItem('equipmentSno') != control.value
              ? { uniqueSerial: true }
              : null;
          },
          err => {
            console.log('err', err);
          }
        )
      );
  }
}
