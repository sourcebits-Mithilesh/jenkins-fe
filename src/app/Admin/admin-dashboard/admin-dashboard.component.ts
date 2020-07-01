import {
  Component,
  OnInit,
  AfterViewInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import * as Highcharts from 'highcharts';

import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
//import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AdminDhasboardService } from 'src/app/shared/admin-dhasboard.service';
import { toDate } from '@angular/common/src/i18n/format_date';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/auth.service';
import { RecentUser } from '../admin-users/admin-users.component';
import { UserService } from 'src/app/user.service';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'nordson-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: [
    './admin-dashboard.component.css',
    './admin-overlay.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  public selected: string;
  // TODO variable name must be in lowerCamelCase, PascalCase for class and model or UPPER_CASE for constant
  public full_name: string;

  modeselect = new Date().getMonth();
  public options: any = {
    chart: {
      type: 'spline',
      height: 500
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    xAxis: {
      categories: ['2019-06-01', '2019-06-02'],
      title: {
        text: 'DATE',
        align: 'middle',
        y: 5
      },
      labels: {
        align: 'end',
        rotation:0
      },

      style: {
        color: '#4A4A4A',
        'font-family': 'Roboto',
        'font-size': '11px',
        'letter-spacing': '0.21px'
      },
      gridLineWidth: 1,
      gridZIndex: 1,
    },

    yAxis: {
      lineColor: '#0081C5',
      lineWidth: 1,
      title: {
        align: 'middle',
        offset: 50,
        text: 'USERS',
        rotation: 360,

        y: -20,
        x: -10,
        style: {
          color: '#4A4A4A',
          'font-family': 'Roboto',
          'font-size': '11px',
          'letter-spacing': '0.21px',
          'margin-top': '10px'
        }
      }
    },
    plotOptions: {
      series: {
        color: '#826AF9',
        lineWidth: 4
      }
    },
    series: [
      {
        showInLegend: false,
        data: [144, 176],
        marker: {
          //   data: this.graphDataYaxis,  marker: {
          fillColor: 'none'
        }
      }
    ]
  };
  graphData: [];
  monthList = [
    { value: 0, Text: 'January' },
    { value: 1, Text: 'February' },
    { value: 2, Text: 'March' },
    { value: 3, Text: 'April' },
    { value: 4, Text: 'May' },
    { value: 5, Text: 'June' },
    { value: 6, Text: 'July' },
    { value: 7, Text: 'August' },
    { value: 8, Text: 'September' },
    { value: 9, Text: 'October' },
    { value: 10, Text: 'November' },
    { value: 11, Text: 'December' }
  ];

  user_status = ['Pending', 'Active', 'Blocked', 'Deleted'];

  tdate = new Date();
  public selectedMonth = '' + this.tdate.getMonth() + '';
  public equipments = [{ value: 0, name: 'PROBLUE FLEX' }];
  public selectedEquipment = '0';
  usersCount: number;
  pendingUsers: number;
  norfileCount: number;
  logCount: number;
  cMonth: number;
  graphDataYaxis = [];
  graphDataXaxis = [];
  recentSignups = [];

  constructor(
    private router: Router,
    private adminService: AdminDhasboardService,
    public dialog: MatDialog,
    private auth: AuthService,
    private userService: UserService
  ) {
    this.auth.userFUllName.subscribe(data => {
      this.full_name = data;
    });
  }

  ngOnInit() {
    localStorage.removeItem('nor_id')
    this.cMonth = new Date().getMonth() + 1;

    var date = new Date();
    var year;
    year = date.getFullYear();

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 2)
      .toISOString()
      .split('T')[0];
    var lastDay = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    this.modeselect = date.getMonth();
    var id;
    var formRegStats = {
      startdate: firstDay,
      enddate: lastDay
    };

    const formDataUsers = {
      is_pending: 1
    };
    const formDataPending = {
      is_pending: 0
    };
    const formLogCount = {};
    const formRecentSignups = {};

    this.adminService.usersCount(formDataUsers).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.usersCount = data.userCount;
        }
      },
      err => {
        console.error('err', err);
      }
    );

    this.adminService.pendingUsersCount(formDataPending).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.pendingUsers = data.userCount;
        }
      },
      err => {
        console.error('err', err);
      }
    );

    this.adminService.norfileCount(formDataPending).subscribe(
      (data: any) => {
        this.norfileCount = data.totalnorfile;
      },
      err => {
        console.error('err', err);
      }
    );

    this.adminService.logfileCount(formLogCount).subscribe(
      (data: any) => {
        this.logCount = data.data;
        if (data.status === 'Success') {
        }
      },
      err => {
        console.error('err', err);
      }
    );

    this.adminService.recentSignUps(formRecentSignups).subscribe(
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

    this.getRegistrationStats(formRegStats);
  } // End of nginit

  recentUser(id: any): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(RecentUser, {
      width: '817px',
      height: '100%',
      panelClass: 'recentuser',
      id
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  onMonthChange(event) {
    var date = new Date();
    var year, month;
    year = date.getFullYear();
    month = this.selectedMonth;
    if (month > date.getMonth()) year = year - 1;
    var firstDay = new Date(year, parseInt(month), 2)
      .toISOString()
      .split('T')[0];
    var lastDay = new Date(year, parseInt(month) + 1, 1)
      .toISOString()
      .split('T')[0];

    var formRegStats = {
      startdate: firstDay,
      enddate: lastDay
    };

    this.getRegistrationStats(formRegStats);
  }

  getRegistrationStats(formRegStats) {
    this.adminService.regStats(formRegStats).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          var graphDate, graphUsrCount;
          this.graphDataXaxis.length = 0;
          this.graphDataYaxis.length = 0;
          for (var i = 0; i < data.graphData.length; i++) {
            graphDate = data.graphData[i].Date;
            graphUsrCount = data.graphData[i].usrCount;
          if(data.graphData[i].Date.substring(7).startsWith("-"))
          this.graphDataXaxis.push(data.graphData[i].Date.substring(8));
         else this.graphDataXaxis.push(data.graphData[i].Date.substring(7));
            this.graphDataYaxis.push(data.graphData[i].usrCount);
          }
          this.options.xAxis.categories = this.graphDataXaxis;
          this.options.series[0].data = this.graphDataYaxis;
          Highcharts.chart('graph-container', this.options);
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }

  blockUser(id, i, status) {
    this.adminService.blockUser(id).subscribe(
      (data: any) => {},
      err => {
        console.error('err', err);
      }
    );
    if (this.recentSignups[i].status == 1) this.recentSignups[i].status = 2;
    else this.recentSignups[i].status = 1;

    if (status === 1) this.usersCount = this.usersCount - 1;
    else if (status === 0) this.pendingUsers = this.pendingUsers - 1;
  }

  unblockUser(id, i, status) {
    this.adminService.unBlockUser(id).subscribe(
      (data: any) => {
      },
      err => {
        console.error('err', err);
      }
    );
    if (this.recentSignups[i].status == 1) this.recentSignups[i].status = 2;
    else this.recentSignups[i].status = 1;
    if (status === 2) this.usersCount = this.usersCount + 1;
    else if (status === 0) this.pendingUsers = this.pendingUsers - 1;
  }

  activateUser(id, i, status) {
    this.adminService.activateUser(id).subscribe(
      (data: any) => {},
      err => {
        console.error('err', err);
      }
    );
    if (this.recentSignups[i].status == 0 || this.recentSignups[i].status == 3) this.recentSignups[i].status = 1;
  }

  deleteUser(id, i, status) {
    this.adminService.deleteUser(id).subscribe(
      (data: any) => {},
      err => {
        console.error('err', err);
      }
    );
    this.recentSignups[i].status = 3;
    this.recentSignups.splice(i, 1);
    this.usersCount = this.usersCount - 1;
  }

  activePendingUsers(type) {
    this.adminService.userType = type;
    this.router.navigate(['/Admin/admin-users']);
  }
}
