import { Directive, Input } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
  NG_ASYNC_VALIDATORS
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[uniqueEmail]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: EmailValidationDirective,
      multi: true
    }
  ]
})
export class EmailValidationDirective implements AsyncValidator {
  createAuthHeader() {
    const token=localStorage.getItem('token')
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return { headers };
  }
  url = environment.BASE_URI;
  @Input('userId') userId:number;
  postData: {};
  constructor(private http: HttpClient) {}
  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    this.postData = { email: control.value};
    if(this.userId > 0){
       this.postData = { email: control.value,user_id : this.userId };
    }
    return this.http
      .post(`${this.url}/emailvalidate`, this.postData,this.createAuthHeader())
      .pipe(
        map(
          (users: any) => {
            return users && users.status != 'Success'
              ? { uniqueEmail: true }
              : null;
          },
          err => {
            console.log('err', err);
          }
        )
      );
  }
}
