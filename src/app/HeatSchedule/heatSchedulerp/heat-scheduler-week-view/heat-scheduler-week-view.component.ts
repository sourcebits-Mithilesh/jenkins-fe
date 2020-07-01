import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { HeatSchedulerCommon } from '../heatscheduler/heatscheduler.component';
import moment from 'moment';
import { HeatSchedulerHour } from '../heat-scheduler-hour/heatScheduleHour';


@Component({
  selector: '[app-heat-scheduler-week-view]',
  templateUrl: './heat-scheduler-week-view.component.html',
  styleUrls: ['./heat-scheduler-week-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'heat-scheduler__week-view'
  }
})
export class HeatSchedulerWeekViewComponent extends HeatSchedulerCommon implements OnInit {

  public days: moment.Moment[];
  public hours: HeatSchedulerHour[];

  constructor(injector : Injector) {
    super(injector);
  }
   timepreference='HH:mm';

  public ngOnInit(): void  {
    this.refresh();
    this.refreshView();
    this.service.getFormat().subscribe(x=>{
      this.timepreference=x
    })
  }

  public refreshView() : void{
    this.updateDays();
    this.setHours();
  }

  private updateDays(): void {

    this.days = [];
    for(let i=0; i<7; i++){
     var a =[]
     a.push(this.date.clone().add(i,'d'))
    }
    this.days=[this.date,this.date.clone().add(1,'d'),this.date.clone().add(2,'d'),this.date.clone().add(3,'d'),this.date.clone().add(4,'d'),this.date.clone().add(5,'d'),this.date.clone().add(6,'d')]
  }

  private setHours(): void {
    this.hours = [];
    for (let hour = 0; hour <= 23; hour++) {
      this.hours.push(new HeatSchedulerHour(this.date.clone().startOf('day').add(hour, 'hours')));
    }
  }
  defineOdd(day){
    let dt=moment(day._d).date()
     return this.oddOrEven(dt)
  }
  oddOrEven(x) {
    return ( x & 1 ) ? "odd" : "even";
  }
}
