import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ShareModule } from '../share/share.module';
import { AccessoriesComponent } from './accessories/accessories.component';
import { ConfigurationCodeComponent } from './configuration-code/configuration-code.component';
import { EventLogComponent } from './eventLog/eventLog.component';
import { SoftwareLicenseComponent } from './software-license/software-license.component';
import { SystemConfigurationMainComponent } from './system-configuration-main/system-configuration-main.component';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { EventlogtypeconvertPipe } from '../pipes/eventlogtypeconvert.pipe';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceHistoryComponent } from './maintenance-history/maintenance-history.component';
import { MaintenanceStatusComponent } from './maintenance-status/maintenance-status.component';
import { MaintenanceService } from './maintenance.service';
import { CarouselComponent, CarouselItemElement } from './reports/carousel.component';
import { CarouselItemDirective } from './reports/reports-carousel-directive';
import {
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  } from "@angular/material";
import { Platform } from '@angular/cdk/platform';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
   //  {path:'accessories' ,component:AccessoriesComponent},
   //  {path:'system-configuration' ,component:SystemConfigurationComponent},
       {path:'eventLog' ,component:EventLogComponent},
   //  {path:'software-license' ,component:SoftwareLicenseComponent},
   //  {path:'configuration-code' ,component:ConfigurationCodeComponent},
       {path:'system-configuration-main',
      // child routes system-configuration
         children:[
         {path:'',component:SystemConfigurationMainComponent},
         {path:'accessories' ,component:AccessoriesComponent},
         {path:'configuration-code' ,component:ConfigurationCodeComponent},
         {path:'software-license' ,component:SoftwareLicenseComponent},
         {path:'system-configuration' ,component:SystemConfigurationComponent},
      ]
    },
         {path: 'maintenance',
         // child routes maintenance
         children:[
            {path:'',component:MaintenanceComponent},
            {path: 'maintenance-status',component:MaintenanceStatusComponent},
            {path: 'maintenance-history',component:MaintenanceHistoryComponent}
         ]
    },
    {path: 'reports',component:ReportsComponent}


]

@NgModule({
   imports: [
      RouterModule.forChild(routes),
      CommonModule,
      ShareModule
   ],
   exports: [
      RouterModule
   ],
   declarations: [
      EventlogtypeconvertPipe,
      AccessoriesComponent,
      ConfigurationCodeComponent,
      EventLogComponent,
      SoftwareLicenseComponent,
      SystemConfigurationMainComponent,
      SystemConfigurationComponent,
      MaintenanceComponent,
      MaintenanceHistoryComponent,
      MaintenanceStatusComponent,
      ReportsComponent,
      CarouselComponent,
      CarouselItemElement,
      CarouselItemDirective
   ],
   providers: [
      MaintenanceService,
      DatePipe
   ]
})
export class ToolModule { 
   //  constructor(private dateAdapter: DateAdapter<Date>) {
   //      dateAdapter.setLocale("en-in"); // DD/MM/YYYY
   //    }
}