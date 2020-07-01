import { Component, OnInit, Injector, Input } from '@angular/core';
import { HeatSchedulerCommon, HeatSchedulerEvent } from '../heatscheduler/heatscheduler.component';
import { HeatSchedulerHour } from './heatScheduleHour';


@Component({
  selector: '[app-heat-scheduler-hour]',
  templateUrl: './heat-scheduler-hour.component.html',
  styleUrls: ['./heat-scheduler-hour.component.css']
})
export class HeatSchedulerHourComponent extends HeatSchedulerCommon implements OnInit {

  @Input() hour: HeatSchedulerHour;

  public inRnageEvents: HeatSchedulerEvent[];
  public minuteRows: { events: HeatSchedulerEvent[], minute: number }[];

  constructor(injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    this.refreshView();
  }

  public refreshView(): void {
    this.minuteRows = Array(60).fill(0).map((x, i) => {
      return { events: [], minute: i };
    });
    this.setInRangeEvent();
  }

  private setInRangeEvent(): void {
    this.inRnageEvents = [];
  }

}



