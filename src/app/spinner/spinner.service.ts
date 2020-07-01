import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/';
import { Observable } from 'rxjs/';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }
  private visible$ = new BehaviorSubject<boolean>(false);

  show() {
    this.visible$.next(true);
  }

  hide() {
    this.visible$.next(false);
  }

  isVisible(): Observable<boolean> {
    return this.visible$.asObservable().pipe(share());
  }
}
