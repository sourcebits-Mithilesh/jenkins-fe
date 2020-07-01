import { Component, OnInit, Input, TemplateRef, Injector, OnDestroy, ViewEncapsulation, Output, EventEmitter, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import  moment from 'moment';
import { HeatSchedulerServiceService } from '../heat-scheduler-service.service';
import { Subscription, BehaviorSubject } from 'rxjs';
//  const moment = momentNs;



export class HeatSchedulerEvent {
  public readonly _id : Symbol;
  public start: Date;
  public end: Date;
  public data: any;
  public color: string;
  public locked: boolean;
  public title: string;
  constructor(title: string = null, start: Date = null, end: Date = null, data: any = null, color: string = null, locked: boolean = false) {
    this.data = data;
    this.start = start;
    this.end = end;
    this.color = color;
    this.locked = locked;
    this.title = title;
    this._id = Symbol();
  }
}

export class HeatSchedulerCommon implements OnDestroy{
  @Input() heatEventTemplate:TemplateRef<any>;
  @Input() heatStartDate;
  @Input() heatEventFormatter:(data:any,date?:Date)=>String;
  @Input() heatDragStep:number=5;
  @Input() heatLocale:string;
  @Input() heatEventToolbar: boolean = true;
 

  
  public today: moment.Moment;
  public date: moment.Moment;
  public service:HeatSchedulerServiceService
  public subscriptionGarbageCollection: Subscription[] = [];

  constructor(protected injector: Injector) { 
    this.today = moment();
    this.service = this.injector.get(HeatSchedulerServiceService);
  }
  ngOnDestroy() {
    if (Array.isArray(this.subscriptionGarbageCollection)) {
      this.subscriptionGarbageCollection.forEach(g => g && g.unsubscribe());
    }
  }
  
  public refresh(): void {
    this.date = this.heatStartDate ? moment(this.heatStartDate) : moment('2018-10-21');
  }
}

@Component({
  selector: 'app-heatscheduler',
  templateUrl: './heatscheduler.component.html',
  styleUrls: ['./heatscheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'heat-scheduler'
  }

})
export class HeatschedulerComponent extends HeatSchedulerCommon implements OnInit {
  
//  @Input() heatEvents;
 @Input() heatShowLocale: boolean = true;

 @Output() heatEventChange = new EventEmitter<HeatSchedulerEvent>();
 @Output() heatEventClick = new EventEmitter<HeatSchedulerEvent>();
 @Output() heatEventDeleteClick = new EventEmitter<HeatSchedulerEvent>();
 @Output() heatEventEditClick = new EventEmitter<HeatSchedulerEvent>();
 @Output() heatDateChange = new EventEmitter<Date>();
 public _format=new BehaviorSubject('')

 @Input()
  set timeFormat(value:any){
    this._format.next(value)
  }
  get timeFormat(){
   return this._format.getValue()
  }

 private _data = new BehaviorSubject([]);
 format;
 // change data to use getter and setter
 @Input()
 set heatEvents(value) {
     // set the latest value for _data BehaviorSubject
     this._data.next(value);
 };

 get heatEvents() {
     // get the latest value from _data BehaviorSubject
     return this._data.getValue();
 }


 public items = [];

 constructor(injector: Injector, private _element: ElementRef, private _renderer: Renderer2) {
  super(injector);
}

  ngOnInit() {

    this.setListeners()
    this.refreshScheduler()
    this._format.subscribe(x=>{
      if(x){
        let data= x['eTimeFmt'].Value=='1'?'HH:mm':'hh:mm:A';
        this.service.setFormat(data)}
      }
      )
    this._data
    .subscribe(x => {
      this.refreshScheduler(x)
    });
  }
   public refreshScheduler(s?) {
     if(s){
      this.service.heatEvents = s;
      this.service.setBehaviorView(s)
     }else{
      this.service.heatEvents = this.heatEvents;
     }
    
  }
  
  private setListeners(): void {
    this.subscriptionGarbageCollection.push(this.service.eventChange.subscribe(event => {
      this.heatEventChange && this.heatEventChange.emit(event);
    }));
    this.subscriptionGarbageCollection.push(this.service.eventClick.subscribe(event => {
      this.heatEventClick && this.heatEventClick.emit(event);
    }));
    this.subscriptionGarbageCollection.push(this.service.eventDeleteClick.subscribe(event => {
      this.heatEventDeleteClick && this.heatEventDeleteClick.emit(event);
    }));
    this.subscriptionGarbageCollection.push(this.service.eventEditClick.subscribe(event => {
      this.heatEventEditClick && this.heatEventEditClick.emit(event);
    }));
  }



}