import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorsService implements HttpInterceptor {

  constructor(public spinnerService: SpinnerService) { }
  intercept(req: HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>> {
    // if get request pass to next interceptor @Gaurav
    if(req.url.includes('/api/emailvalidate') 
      || req.url.includes('/api/checkequipment')
      || req.url.includes('/api/pro-blu-config')
      || req.url.includes('/api/eventlogs')

      ){
      return next.handle(req)
    }
    setTimeout(()=>this.spinnerService.show())
    // this.spinnerService.show();
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            setTimeout(()=>{
              this.spinnerService.hide();
            },0)
            
          }
        },
        (err: any) => {
          this.spinnerService.hide();
        }
      )
    )
  }
}
