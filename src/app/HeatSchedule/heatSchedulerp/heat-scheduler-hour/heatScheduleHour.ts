import * as momentNs from 'moment';

export class HeatSchedulerHour {
    public start: momentNs.Moment;
    public end: momentNs.Moment;
    constructor(start: momentNs.Moment) {
      this.start = start;
      this.end = this.start.clone().add('hours', 1);
    }
  }