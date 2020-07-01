import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { TechSupportService } from './tech-support.service';
//import { ViewEncapsulation } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
export interface DialogData {}

@Component({
  selector: 'nordson-tech-support',
  templateUrl: './tech-support.component.html',
  styleUrls: ['./tech-support.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechSupportComponent implements OnInit {
  public full_name: string;
  public equipments = [{ value: 0, name: 'PROBLUE FLEX' }];
  public selectedEquipment = '0';
  usersCount: Number;
  searchText: string = '';
  recentSignups = [];
  pageNo: number;
  totalPages: number;
  pendingUsers: number;
  norfileCount: number;
  logCount: number;
  cMonth: number;
  user_status = ['Pending', 'Active', 'Blocked', 'Deleted'];

  selectedOption: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private techService: TechSupportService,
    private auth: AuthService,
    private userService: UserService
  ) {
    this.selectedOption = '1';
    this.auth.userFUllName.subscribe(data => {
      this.full_name = data;
    });
  }

  sortOptions = [{ value: 0, name: 'DESC' }, { value: 1, name: 'ASC' }];
  public selectedSortOptions = '' + 0 + '';

  ngOnInit() {
    console.log('text')
    localStorage.removeItem('nor_id')
    var id;
    // var formRegStats = {
    //   startdate: firstDay,
    //   enddate: lastDay
    // };

    const formDataUsers = {
      is_pending: 1
    };
    const formDataPending = {
      is_pending: 0
    };
    const formLogCount = {};
    const formRecentSignups = {};
    this.techService.usersCount(formDataUsers).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.usersCount = data.userCount;
        }
      },
      err => {
        console.error('err', err);
      }
    );

    this.techService.pendingUsersCount(formDataPending).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.pendingUsers = data.userCount;
        }
      },
      err => {
        console.error('err', err);
      }
    );

    this.techService.norfileCount(formDataPending).subscribe(
      (data: any) => {
        this.norfileCount = data.totalnorfile;
      },
      err => {
        console.error('err', err);
      }
    );

    this.techService.logfileCount(formLogCount).subscribe(
      (data: any) => {
        this.logCount = data.data;
        if (data.status === 'Success') {
        }
      },
      err => {
        console.error('err', err);
      }
    );

    this.techService.recentSignUps(formRecentSignups).subscribe(
      (data: any) => {
        for (var i = 0; i < data.result.length; i++) {
          this.recentSignups.push(data.result[i]);
        }
      },
      err => {
        console.error('err', err);
      }
    );

    let userData = this.userService.setProfile()
    if(userData) {
      this.full_name = userData.data.full_name;
    }

    //this.getRegistrationStats(formRegStats);
  }
}
