import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Localization implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userLang = localStorage.getItem('currentLang');
    const modifiedReq = req.clone({ 
      headers: userLang? req.headers.set('lang', userLang.split('-')[0]) :req.headers.set('lang','en'),
    });
    return next.handle(modifiedReq);
  }
}
