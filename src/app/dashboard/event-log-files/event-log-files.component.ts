import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EventLogFilesService } from './event-log-files.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth.service';

import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { accessType } from 'src/app/settings/access-type-check';

@Component({
  selector: 'nordson-event-log-files',
  templateUrl: './event-log-files.component.html',
  styleUrls: ['./event-log-files.component.css']
})
export class EventLogFilesComponent implements OnInit {
  apiUrl: string = environment.BASE_URI;
  eventlogfiles: any;
  accessType: number;
  noRecord: any;

  constructor(
    private eventLogService: EventLogFilesService,
    private http: HttpClient,
    private userService: UserService,
    private authServices: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventLogService.showEventLogFiles().subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.eventlogfiles = data.resData;
        } else {
          this.noRecord = 'No Record Found!';
        }
      },
      (err: any) => {
        this.noRecord = 'No Files Created or Imported recently!';
        console.log('err', err);
      }
    );
    let userData = this.userService.setProfile()
    if(userData) {
        this.accessType = accessType.check(userData.data);
    }
  }
  goToEventLog(norId){
    this.authServices.setNorId(norId);
    this.router.navigate(['/tools/eventLog']);


  }
  onDown(fileName, userId,nor_id) {
    if (userId && fileName && nor_id) {
      this.eventLogService.recentlyEventDown(fileName, userId,nor_id)
      .subscribe((data:any)=>{
        const blob = new Blob([data], { type: 'application/csv' });
        saveAs(blob, `${fileName}`);
      },(err:any)=>{
        console.log('err',err);
      })
    }
  }
}
