import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as momentNs from 'moment';
import { HeatSchedulerEvent } from './heatscheduler/heatscheduler.component';


@Injectable({
  providedIn: 'root'
})
export class HeatSchedulerServiceService {

  private _defaultLocale = 'en';
  schedulerLocale : string = this._defaultLocale;
  locale : Subject<string>;
  refershRequest : Subject<momentNs.Moment>;
  eventChange : Subject<HeatSchedulerEvent>;
  eventClick : Subject<HeatSchedulerEvent>;
  eventDeleteClick : Subject<HeatSchedulerEvent>;
  eventEditClick : Subject<HeatSchedulerEvent>;
  heatEvents: HeatSchedulerEvent[];
  private behave = new BehaviorSubject([]);
  public format=new BehaviorSubject("");

  constructor() {
      this.heatEvents = [];
      this.refershRequest = new Subject<momentNs.Moment>();        
      this.locale = new Subject<string>();
      this.eventChange = new Subject<HeatSchedulerEvent>();
      this.eventClick = new Subject<HeatSchedulerEvent>();
      this.eventDeleteClick = new Subject<HeatSchedulerEvent>();
      this.eventEditClick = new Subject<HeatSchedulerEvent>();
  }
  
setBehaviorView(behave) { 
    this.behave.next(behave); 
} 
getBehaviorView() { 
    return this.behave.asObservable(); 
}
setFormat(format){
    this.format.next(format)
}
getFormat(){
    return this.format.asObservable();
}

  refreshDate(date : momentNs.Moment) : void{
      date && this.refershRequest.next(date);
  }

  changeLocale(locale:string) : void{
      this.schedulerLocale= locale || this._defaultLocale;
      this.locale.next(this.schedulerLocale);
  }

  eventChanged(event:HeatSchedulerEvent) : void{
      event && this.eventChange.next(event);
  }

  eventClicked(event:HeatSchedulerEvent) : void{
      event && this.eventClick.next(event);
  }
}
