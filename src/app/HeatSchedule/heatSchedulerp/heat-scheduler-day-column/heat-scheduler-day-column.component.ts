import { Component, OnInit, ViewEncapsulation, Injector, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeatSchedulerCommon, HeatSchedulerEvent } from '../heatscheduler/heatscheduler.component';
import  moment from 'moment';
import { ChangeDetectorRef } from '@angular/core';
import { HeatSchedulerHour } from '../heat-scheduler-hour/heatScheduleHour';
import value from '*.json';


@Component({
  selector: '[app-heat-scheduler-day-column]',
  templateUrl: './heat-scheduler-day-column.component.html',
  styleUrls: ['./heat-scheduler-day-column.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'heat-scheduler__day-view__body',
    '[class.hour-none]': '!hourColumn'
  }

})
export class HeatSchedulerDayColumnComponent extends HeatSchedulerCommon implements OnInit {

  @Input() hourColumn: boolean = true;
  @Input() bounds: any;
  @Input() evenOdddays;

  public dayEvents: HeatSchedulerEvent[];
  public hours: HeatSchedulerHour[];

  public edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  
  constructor(injector: Injector, public _element: ElementRef ,private cd:ChangeDetectorRef) {
    super(injector);
    this.bounds = this._element.nativeElement;
  }

  public ngOnInit(): void {
    this.refresh();
    this.refreshView();
    this.service.getBehaviorView().subscribe(value=>{
      this.checkDayEvents(value);
    })
  }

  public refreshView(): void {
    this.checkDayEvents();
    this.setHours();
  }

  public checkEdge(event): void {
    this.edge = event;
  }

  private setHours(): void {
    this.hours = [];
    for (let hour = 0; hour <= 23; hour++) {
      this.hours.push(new HeatSchedulerHour(this.date.clone().startOf('day').add(hour, 'hours')));
    }
  }
 
  


  private checkDayEvents(s?): void {
    this.dayEvents = [];
    var events=[];
    if(s){
       events=s;
    }else{
      events=this.service.heatEvents
    }

    

    events.forEach(ev => {
      if (ev.start && ev.end) {
        if (moment(ev.start).isSameOrAfter(this.date.clone().startOf('day')) && moment(ev.end).isSameOrBefore(this.date.clone().endOf('day'))) {
          this.dayEvents.push(ev);
        }
      }
      else if (ev.start && !ev.end) {
        if (moment(ev.start).isSameOrAfter(this.date.clone().startOf('day')) && moment(ev.start).isSameOrBefore(this.date.clone().endOf('day'))) {
          this.dayEvents.push(ev);
        }
      }
    });
  }


}
