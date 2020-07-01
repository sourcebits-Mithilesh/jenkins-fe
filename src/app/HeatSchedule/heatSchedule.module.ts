import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../share/share.module';
import { HeatScheduleComponent } from './heat-schedule.component';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { HeatschedulerComponent } from './heatSchedulerp/heatscheduler/heatscheduler.component';
import { HeatSchedulerHourComponent } from './heatSchedulerp/heat-scheduler-hour/heat-scheduler-hour.component';
import { HeatSchedulerDayColumnComponent } from './heatSchedulerp/heat-scheduler-day-column/heat-scheduler-day-column.component';
import { HeatSchedulerWeekViewComponent } from './heatSchedulerp/heat-scheduler-week-view/heat-scheduler-week-view.component';
import { HeatSchedulerEventComponent } from './heatSchedulerp/heat-scheduler-event/heat-scheduler-event.component';
import { ShiftScheduleComponent } from './shift-schedule/shift-schedule.component';

const routes: Routes = [
    {path:'heat-schedule',component:HeatScheduleComponent },
    {path:'shift-schedule',component:ShiftScheduleComponent }

]

@NgModule({
    imports: [SchedulerModule,ShareModule,RouterModule.forChild(routes)],
    exports: [SchedulerModule],
    declarations: [
        HeatScheduleComponent,
        HeatschedulerComponent,
        HeatSchedulerWeekViewComponent,
        HeatSchedulerHourComponent,
        HeatSchedulerDayColumnComponent,
        HeatSchedulerEventComponent,
        ShiftScheduleComponent
    ],
})
export class HeatScheduleModule { }