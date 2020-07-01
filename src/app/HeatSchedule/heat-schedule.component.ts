import { Component, OnInit, Inject, ViewEncapsulation, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeatScheduleService } from './heat-schedule.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ModifyPrivilegesService } from 'src/app/shared/modify-privileges.service';
import { UserService } from 'src/app/user.service';
import { validateEventsOnUpdate, HeatEditRange, validateEditSetBack, validateHeatEvents, validateSetbackEvents, validateEditHeat, validate, validateHeatRange, FindHeatEvents } from './event-validation';
import { addEvent, addEvent1 } from './add-event';
import { getEvets } from './get-events';
import { deleteEvent } from './delete-events';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { EventStyleArgs, SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { accessType } from '../settings/access-type-check';
import { HeatSchedulerServiceService } from './heatSchedulerp/heat-scheduler-service.service';

export interface DialogData { }

@Component({
  selector: 'nordson-heat-schedule',
  templateUrl: './heat-schedule.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`

    // kendo-scheduler .k-event>div, .k-event>div {
    //   height: 100%;
    //   position: absolute;
    //   width: 100%;
    // }
    .heat {
      background-color: #02940B;
    }
    .setback{
      background-color: #0071BE;
    }
    kendo-scheduler-toolbar.k-scheduler-toolbar.k-header.k-floatwrap {
      display: none !important;
    }
    .k-scheduler-toolbar li .k-link, .k-scheduler-footer li .k-link{
      display: none;
    }

    kendo-scheduler .k-event .k-event-actions .k-icon,.k-event-actions .k-icon {
      display: none;
    }
    .k-scheduler-views li.k-state-selected {
      border-color: rgba(0,0,0,0.1);
      color: #fff;
      background-color: #ff6358;
      background-image: none;
      display: none !important;
    }
    ul.k-reset.k-header {
      display: none !important;
    }
    ul.k-scheduler-navigation.k-reset.ng-star-inserted {
      display: none !important;
    }
    th.k-scheduler-times-all-day {
      color: white !important;
    }
    .k-scheduler-table .k-link {
      cursor: pointer;
      text-transform: uppercase;
    }
    .k-event ng-star-inserted{
      width: 75px !important;
    }
    input[type="text"]:disabled {
      color: black !important;
    }

  `],
  styleUrls: ['./heat-schedule.component.css']
})
export class HeatScheduleComponent implements OnInit, AfterViewChecked {
  public selectedDate: Date = new Date('2018-10-22T00:00:00');
  public events: any[];
  // heatevents=[];
  //public customClass: boolean;
  bgdClrForHeight = '#0D436D';
  weekArray = new Array();
  eventColor: any;
  heatForm = this.fb.group({
    date: [''],
    timePicker: [''],
    enableScheduler: ['']
  });
  public getEvent(args: EventStyleArgs){
    return ("s"+args.event.id);
  }
  heatevents=[]
  heatButton: any;
  noScroll:any;
  checked: boolean;
  btnTxt: string;
  disable: boolean;
  preference: any;
  accessType;
  heatTimeFormat = 'HH';
  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    private elem: ElementRef,
    private security: ModifyPrivilegesService,
    private setupService: SetupToolsService,
    private userService: UserService,
    private service:HeatSchedulerServiceService
    ) { }

  ngOnInit() {
    this.heatForm.controls['date'].disable();
    this.heatForm.controls['timePicker'].disable();
    this.renderObject();
  }
 
  ngAfterViewInit() {
    this.chnageDate();

  }

  ngAfterViewChecked() {
  }

  slotDblClickHandler(event) {
    alert('slotDblClickHandler');
  }

  eventDblClickHandler(event) {
    if (this.checked === true && this.disable === false) {
      console.log(event)
      const dialogRef = this.dialog.open(HeatEventModal, {
        width: '500px',
        height: '100%',
        panelClass: 'heateventclass',
        // pass data to modal 
        data: {
          // current event data
          event: event,
          submitType: 'update',
          // system prefrences
          preference: this.preference,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('edit dialog closed');
        this.ngOnInit();
      });
      // console.log('event', event.event.dataItem);
    }
  }


  addHeatSetbackEvent(eventType): void {
    if (this.checked === true && this.disable === false) {
      const dialogRef = this.dialog.open(HeatEventModal, {
        width: '500px',
        height: '100%',
        panelClass: 'heateventclass',
        // pass data to modal
        data: {
          data: this.events,
          submitType: 'add',
          preference: this.preference
        },
        id: eventType
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('add dialog closed');
        this.ngOnInit();
      });
    }
  }

  toogleScheduler(event) {
    console.log(event.checked);
    if (event.checked === false) {
      this.checked = false;
      this.heatButton = '0.4';
      this.noScroll='none';
      // update prefrences to 0 if toogle is unchecked
      this.setupService.updatePreference({ "blSchedulerEnable": 0 }).subscribe(
        (data: any) => {
          if (data.status === 'success') {
            console.log('updated 0');
          }
        },
        err => {
          console.log('err', err);
        }
      );

    }
    else {
      this.checked = true;
      this.heatButton = '1.4';
      this.noScroll='auto'
      // update prefrences to 1 if toogle is checked
      this.setupService.updatePreference({ "blSchedulerEnable": 1 }).subscribe(
        (data: any) => {
          if (data.status === 'success') {
            console.log('updated 0');
          }
        },
        err => {
          console.log('err', err);
        }
      );
    }
  }
  transform12(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour >= 12 ? 'PM' : 'AM';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = (part == 'AM' && hour == '00') ? '12' : hour
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }

  renderObject() {
    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
      if (this.accessType === 1) {
        this.heatForm.get('enableScheduler').disable();
        this.disable = true;
      }
      else {
        this.disable = false;
      }
    }
    this.authService.getxmlData() // getting data from current xml data service.
      .subscribe((data: any) => {
        if (data.status === 'Success') {
          const sunday = data.result.heatSchedule.SUNDAY;
          const monday = data.result.heatSchedule.MONDAY;
          const tueseday = data.result.heatSchedule.TUESDAY;
          const wednesday = data.result.heatSchedule.WEDNESDAY;
          const thursday = data.result.heatSchedule.THURSDAY;
          const friday = data.result.heatSchedule.FRIDAY;
          const saturday = data.result.heatSchedule.SATURDAY;
          // getting data from current xml prefrences.
          const Scheduler = (data.result.systemPreferences.blSchedulerEnable) ? data.result.systemPreferences.blSchedulerEnable.Value : "1";
          this.preference = data.result.systemPreferences;
          if(this.preference){let data=this.preference['eTimeFmt'].Value=='1'?'HH:mm':'hh:mm:A' ;
          this.service.setFormat(data) }
          let date;
          let time, eTimeFmt, eDateFmt

          // if day month tag is not present in xml tag

          let day=data.result.systemPreferences.DateDay ? data.result.systemPreferences.DateDay.Value: 0
          let month=data.result.systemPreferences.DateMonth ? data.result.systemPreferences.DateMonth.Value: 0
          let dateMonth=(String(month).length<2?"0"+month:month)
          let dateDay= (String(day).length<2?"0"+day:day)

          if (data.result.systemPreferences.ClockHour && data.result.systemPreferences.ClockMinutes) {
            time = `${data.result.systemPreferences.ClockHour.Value}:${data.result.systemPreferences.ClockMinutes.Value}`
            eTimeFmt = data.result.systemPreferences.eTimeFmt.Value;
            eDateFmt = data.result.systemPreferences.eDateFmt.Value;
          }
          if (eTimeFmt === "0") {
            this.heatTimeFormat = 'hh a';
          }
          else if (eTimeFmt === "1") {
            this.heatTimeFormat = 'HH';
          }
          // Data format is yy/mm/dd set the values in Heat Schecule 
          if (eDateFmt === "2") {
            date = `${data.result.systemPreferences.DateYear.Value}/${dateMonth}/${dateDay}`
          }
          // Data format is dd/mm/yy set the values in Heat Schecule
          else if (eDateFmt === "1") {
            date = `${dateDay}/${dateMonth}/${data.result.systemPreferences.DateYear.Value}`
          }
          // Data format is mm/dd/yy set the values in Heat Schecule
          else if (eDateFmt === "0") {
            date = `${dateMonth}/${dateDay}/${data.result.systemPreferences.DateYear.Value}`
          }
          // patch value
          if (Scheduler || date || eTimeFmt) {
            this.heatForm.patchValue({
              enableScheduler: Scheduler === "1" ? true : false,
              date: date,
              timePicker: eTimeFmt === "0" ? this.transform12(time) : time,
            })
          }
          const enableScheduler = this.heatForm.get('enableScheduler').value;
          if (enableScheduler === true) {
            this.heatButton = '1.4';
            this.noScroll='auto';
            this.checked = true;
          }
          else {
            this.heatButton = '0.4';
            this.noScroll='none';
            this.checked = false;
          }
          // get all the event data from current xml data.
          this.events = getEvets(sunday, monday, tueseday, wednesday, thursday, friday, saturday);
          this.events=this.events.filter(e=>e.id!=0)
          this.events=this.events.sort((a,b)=>{return parseInt(a['id']) - parseInt(b['id']) } )
          this.heatevents=this.events
        }
      });
  }

  chnageDate() {
    let a = document.querySelectorAll('div.k-scheduler-header-wrap table.k-scheduler-table tbody tr th')
    for (let i = 0; i < a.length; i++) {
      document.querySelector('div.k-scheduler-header-wrap table.k-scheduler-table tbody tr th:nth-child(' + String(i + 1) + ') span').innerHTML = document.querySelector('div.k-scheduler-header-wrap table.k-scheduler-table tbody tr th:nth-child(' + String(i + 1) + ') span').innerHTML.split(',')[0]


    }
  }
}

@Component({
  selector: 'heat-schedule-event',
  templateUrl: './heat-event-modal.html',
  styleUrls: ['./heat-schedule.component.css']
})
export class HeatEventModal {
  addEventForm: FormGroup;
  weekArray = new Array();
  heatScheduleData: any;
  currentDay: any;
  sunday: number = 0;
  monday: number = 0;
  tueseday: number = 0;
  wednesday: number = 0
  thursday: number = 0;
  friday: number = 0;
  saturday: number = 0;
  setText: string;
  enterSetBackText: string;
  exitSetBackText: string;
  buttonText: string;
  addText: string;
  starthArray = new Array();
  startH: any;
  endH: any;
  endM: any;
  startM: any;
  hours: any = [];
  minutes: any = [];
  checkTimeForm: boolean;
  anteMeridianFormats: any = [{ value: 'AM' }, { value: 'PM' }];
  constructor(
    public dialogRef: MatDialogRef<HeatEventModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private heatScheduleService: HeatScheduleService,
    private authService: AuthService,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    this.addEventForm = this.fb.group({
      Sunday: [''],
      Monday: [''],
      Tuesday: [''],
      Wednesday: [''],
      Thursday: [''],
      Friday: [''],
      Saturday: [''],
      allDays: [''],
      setHoursStart: ['', Validators.required],
      setMinutesStart: ['', Validators.required],
      antemeredianFormatStart: ['AM'],
      setHoursEnd: ['', Validators.required],
      setMinutesEnd: ['', Validators.required],
      antemeredianFormatEnd: ['AM']
    });
    const currentEvent = this.dialogRef.componentInstance.data.event;
    const submitType = this.dialogRef.componentInstance.data.submitType;
    const type = this.dialogRef.id;
    // if submit type is add setting the button text and lable text
    if (submitType === 'add') {
      this.buttonText = 'CANCEL';
      this.addText = 'ADD EVENT';
      if (type === 'heatEvent') {
        this.enterSetBackText = 'Heaters On Time'
        this.exitSetBackText = 'Heaters Off Time';
      } else {
        this.enterSetBackText = 'Enter Setback Time'
        this.exitSetBackText = 'Exit Setback Time';
      }
    }
    // if submit type is update  setting the button text and lable text
    if (submitType === 'update') {
      const editType = this.dialogRef.componentInstance.data.event.id;
      this.buttonText = 'DELETE';
      this.addText = 'UPDATE EVENT';
      if (editType == 3) {
        this.enterSetBackText = 'Enter Setback Time'
        this.exitSetBackText = 'Exit Setback Time';
      } else {
        this.enterSetBackText = 'Heaters On Time'
        this.exitSetBackText = 'Heaters Off Time';
      }
    }

    const format = this.dialogRef.componentInstance.data.preference.eTimeFmt.Value;
    this.setClock(format);
    if (format === "0") {
      this.checkTimeForm = false;
    }
    else if (format === "1") {
      this.checkTimeForm = true;
    }
    if (currentEvent) {
      let startClock;
      let endClock;
      let hours;
      let end;
      // if time format is 12 h
      if (format === "0") {
        // PM 
        if (currentEvent.start.hours() >= 12 && currentEvent.end.hours() >= 12) {
          hours = currentEvent.start.hours() === 12 ? 12 : currentEvent.start.hours() - 12;
          end = currentEvent.end.hours() === 12 ? 12 : currentEvent.end.hours() - 12;
          startClock = `${('0' + hours).slice(-2)}:${('0' + currentEvent.start.minutes()).slice(-2)} PM`;
          endClock = `${('0' + end).slice(-2)}:${('0' + currentEvent.end.minutes()).slice(-2)} PM`;
          this.addEventForm.patchValue({
            setHoursStart: `${('0' + hours).slice(-2)}`,
            setMinutesStart: `${('0' + currentEvent.start.minutes()).slice(-2)}`,
            setHoursEnd: `${('0' + end).slice(-2)}`,
            setMinutesEnd: `${('0' + currentEvent.end.minutes()).slice(-2)}`,
            antemeredianFormatStart: 'PM',
            antemeredianFormatEnd: 'PM'
          });
        }
        // AM PM
        else if (currentEvent.start.hours() <= 12 && currentEvent.end.hours() >= 12) {
          end = currentEvent.end.hours() === 12 ? 12 : currentEvent.end.hours() - 12;
          startClock = `${('0' + currentEvent.start.hours()).slice(-2)}:${('0' + currentEvent.start.minutes()).slice(-2)} AM`;
          endClock = `${('0' + end).slice(-2)}:${('0' + currentEvent.end.minutes()).slice(-2)} PM`;
          hours = currentEvent.start.hours() === 0 ? 12 : currentEvent.start.hours();
          this.addEventForm.patchValue({
            setHoursStart: `${('0' + hours).slice(-2)}`,
            setMinutesStart: `${('0' + currentEvent.start.minutes()).slice(-2)}`,
            setHoursEnd: `${('0' + end).slice(-2)}`,
            setMinutesEnd: `${('0' + currentEvent.end.minutes()).slice(-2)}`,
            antemeredianFormatStart: 'AM',
            antemeredianFormatEnd: 'PM'
          });
        }
        // AM 
        else if (currentEvent.start.hours() <= 12 && currentEvent.end.hours() <= 12) {
          end = currentEvent.end.hours() == 0 ? 12 : currentEvent.end.hours();
          startClock = `${('0' + hours).slice(-2)}:${('0' + currentEvent.start.minutes()).slice(-2)} AM`;
          endClock = `${('0' + end).slice(-2)}:${('0' + currentEvent.end.minutes()).slice(-2)} AM`;
          hours = currentEvent.start.hours() === 0 ? 12 : currentEvent.start.hours();
          this.addEventForm.patchValue({
            setHoursStart: `${('0' + hours).slice(-2)}`,
            setMinutesStart: `${('0' + currentEvent.start.minutes()).slice(-2)}`,
            setHoursEnd: `${('0' + end).slice(-2)}`,
            setMinutesEnd: `${('0' + currentEvent.end.minutes()).slice(-2)}`,
            antemeredianFormatStart: 'AM',
            antemeredianFormatEnd: 'AM'
          });

        }
      }
      else if (format === "1") {
        console.log('24 Hours');
        startClock = `${('0' + currentEvent.start.hours()).slice(-2)}:${('0' + currentEvent.start.minutes()).slice(-2)}`;
        endClock = `${('0' + currentEvent.end.hours()).slice(-2)}:${('0' + currentEvent.end.minutes()).slice(-2)}`;
        this.addEventForm.patchValue({
          setHoursStart: `${('0' + currentEvent.start.hours()).slice(-2)}`,
          setMinutesStart: `${('0' + currentEvent.start.minutes()).slice(-2)}`,
          setHoursEnd: `${('0' + currentEvent.end.hours()).slice(-2)}`,
          setMinutesEnd: `${('0' + currentEvent.end.minutes()).slice(-2)}`,
        });
      }

      const currentDate = new Date(currentEvent.start);
      const weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";

      const finalDate = weekday[currentDate.getDay()];
      this.currentDay = finalDate;
      if (finalDate === 'Sunday') {
        this.addEventForm.patchValue({ Sunday: true })
      }
      if (finalDate === 'Monday') {
        this.addEventForm.patchValue({ Monday: true })
      }
      if (finalDate === 'Tuesday') {
        this.addEventForm.patchValue({ Tuesday: true })
      }
      if (finalDate === 'Wednesday') {
        this.addEventForm.patchValue({ Wednesday: true })
      }
      if (finalDate === 'Thursday') {
        this.addEventForm.patchValue({ Thursday: true })
      }
      if (finalDate === 'Friday') {
        this.addEventForm.patchValue({ Friday: true })
      }
      if (finalDate === 'Saturday') {
        this.addEventForm.patchValue({ Saturday: true })
      }

    }

  }
 
  checkboxDayChange(event, day, number) {
    !event.checked ? this.addEventForm.get('allDays').patchValue(false) : null;
  }
  // if All checkbox is checked
  checkAllDays(event) {
      this.addEventForm.patchValue({
        Sunday: event.checked?true:false,
        Monday: event.checked?true:false,
        Tuesday: event.checked?true:false,
        Wednesday: event.checked?true:false,
        Thursday: event.checked?true:false,
        Friday: event.checked?true:false,
        Saturday: event.checked?true:false
      });
  }

  showError() {
    this.toaster.error('event already exists', '', {
      timeOut: 3000
    });
  }

  eventExist(obj) {
    // obj is week days (Sunday,Monday,.....)
    // maximum 6 events will be added for a day.
    if (obj.SchedulerEvent0StartHour.Value != "255"  // if value is 255 inside the xml tag than event is not added.
      && obj.SchedulerEvent1StartHour.Value != "255"
      && obj.SchedulerEvent2StartHour.Value != "255"
      && obj.SchedulerEvent3StartHour.Value != "255"
      && obj.SchedulerEvent4StartHour.Value != "255"
      && obj.SchedulerEvent5StartHour.Value != "255") {
      // throw toaster error.
      this.toaster.error('Can not add more than 6 events for Scheduler', '', {
        timeOut: 3000
      });
      this.weekArray=[]
      return true;
    }
    return false;
  }

  delError(dayType?){
    this.toaster.error(`Cannot delete event for ${dayType?dayType:"the days"}`, '', {
      timeOut: 3000
    })
    this.weekArray=[];
  }

  delEvent() {
    // delete Event
              this.startH = this.addEventForm.get('setHoursStart').value;
              this.endH = this.addEventForm.get('setHoursEnd').value;
              this.startM = this.addEventForm.get('setMinutesStart').value;
              this.endM = this.addEventForm.get('setMinutesEnd').value;
    const currentEvent = this.dialogRef.componentInstance.data.event;
    if (currentEvent) {
      let reqFormat;
      reqFormat = {};

      const startHour = currentEvent.startH;
      const endHour = currentEvent.endH;
      const startMinutes = currentEvent.startM;
      const endMinutes = currentEvent.endM;
      const startType = currentEvent.startType;
      const startTime = currentEvent.startTime;
      const endTime = currentEvent.endTime;
      const endType = currentEvent.endType;
      const eventType = currentEvent.id;
      const startM = new Date(currentEvent.start).getMinutes();
      const endM = new Date(currentEvent.end).getMinutes();
      const formControls = this.addEventForm.controls;
      Object.keys(formControls).forEach(key => {
        const checked = formControls[key].value ? key : "";
        this.weekArray.push(checked);
      });
      const weekDays = this.weekArray;
      const antemeredianFormatEnd = this.addEventForm.get('antemeredianFormatEnd').value;
      const antemeredianFormatstart = this.addEventForm.get('antemeredianFormatStart').value;

      const timeFormat = this.dialogRef.componentInstance.data.preference.eTimeFmt.Value;
      let setHoursEnd = (parseInt(this.addEventForm.get('setHoursEnd').value))
      let setHoursStart = (parseInt(this.addEventForm.get('setHoursStart').value))
      // time format is 12 hrs
      if (timeFormat === "0") {
        let startType = this.addEventForm.get('antemeredianFormatStart').value;
        let endType = this.addEventForm.get('antemeredianFormatEnd').value;
        if (startType && endType) {
          startType = startType.toUpperCase();
          endType = endType.toUpperCase();
        }
        // PM
        if (startType === 'PM' && endType === 'PM') {
          if (this.startH === '12') {
            this.startH = 12;
          this.endH=(this.endH==='12'?12:parseInt(this.endH)+12);
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
          else if (this.endH === '12') {
            //this.startH = parseInt(this.startH) + 12;
            this.startH = parseInt(this.startH) + 12;
            this.endH = this.endH;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
          else {
            this.startH = parseInt(this.startH) + 12;
            this.endH = parseInt(this.endH) + 12;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
        }
        // AM
        else if (startType === 'AM' && endType === 'AM') {
          if (this.startH === '12' || (this.endH === '12')) {
            if (this.startH === '12')
              this.startH = '00';
            if (this.endH === '12')
              this.endH = '00';
            this.endH = this.endH;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
          // else if (this.endH === '12') {
          //   this.startH = this.startH
          //   this.endH = '00';
          //   this.startM = this.startM.split(' ')[0];
          //   this.endM = this.endM.split(' ')[0];
          // }
          else {
            this.startH = this.startH;
            this.endH = this.endH;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
  
        }
        // AM PM
        else if (startType === 'AM' && endType === 'PM') {
          if (this.startH === '12') {
            this.startH = '00';
            if (this.endH != 12)
              this.endH = parseInt(this.endH) + 12;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
          else if (this.endH === '12') {
            this.startH = this.startH
            this.endH = 12;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
          else {
            this.startH = parseInt(this.startH);
            this.endH = parseInt(this.endH) + 12;
            this.startM = this.startM.split(' ')[0];
            this.endM = this.endM.split(' ')[0];
          }
        }
        // PM AM
        else if (startType === 'PM' && endType === 'AM') {
          this.toaster.error('Start time should be less than End time', '', {
            timeOut: 3000
          });
          return;
        }
      }
      let obj = {};
      obj[startHour] = 255;
      obj[endHour] = 255;
      obj[startMinutes] = 255;
      obj[endMinutes] = 255;
      obj[startType] = 0;
      obj[endType] = 0;
      this.authService.getxmlData()
        .subscribe((data: any) => {
          if (data.status === 'Success') {
            this.heatScheduleData = data.result.heatSchedule;
            // object destructuring
            const {SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY}=this.heatScheduleData
            // check all checkbox delete 
            if (this.addEventForm.get('Sunday').value
              && this.addEventForm.get('Monday').value
              && this.addEventForm.get('Tuesday').value
              && this.addEventForm.get('Wednesday').value
              && this.addEventForm.get('Thursday').value
              && this.addEventForm.get('Friday').value
              && this.addEventForm.get('Saturday').value
            ) {
              reqFormat.SUNDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, SUNDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.sunday);
              reqFormat.MONDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, MONDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.monday);
              reqFormat.TUESDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, TUESDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.tueseday);
              reqFormat.WEDNESDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, WEDNESDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.wednesday);
              reqFormat.THURSDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, THURSDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.thursday);
              reqFormat.FRIDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, FRIDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.friday);
              reqFormat.SATURDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, SATURDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.saturday);
              this.sunday++;
              this.monday++;
              this.tueseday++;
              this.wednesday++;
              this.thursday++;
              this.friday++;
              this.sunday++;
            }
            // delete particular checkbox selected for praticular week.
            else {
              
              if (weekDays[0] === 'Sunday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, SUNDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                
                reqFormat.SUNDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, SUNDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);
                this.sunday++;
              }
              if (weekDays[1] === 'Monday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, MONDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                //console.log(this.startH)
                reqFormat.MONDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, MONDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);

                this.monday++;
              }
              if (weekDays[2] === 'Tuesday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, TUESDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                reqFormat.TUESDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, TUESDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);
   
                this.tueseday++;
              }
              if (weekDays[3] === 'Wednesday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, WEDNESDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                reqFormat.WEDNESDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, WEDNESDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);

                this.wednesday++;
              }
              if (weekDays[4] === 'Thursday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, THURSDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                reqFormat.THURSDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, THURSDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);

                this.thursday++;
              }
              if (weekDays[5] === 'Friday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, FRIDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                reqFormat.FRIDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, FRIDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);

                this.friday++;
              }
              if (weekDays[6] === 'Saturday') {
                // if(!(deleteEvent(this.toaster,startM,endM,eventType, SATURDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
                //   this.delError()
                //   return;
                // }
                reqFormat.SATURDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, SATURDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType);
                this.saturday++;
              }
            }

            //obj = {};
            /* delete if more than one checkbox is deleted start
            */
            if (weekDays[0] === 'Sunday' && this.sunday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, SUNDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SUNDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, SUNDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.sunday);
              obj = {};
            }
            if (weekDays[1] === 'Monday' && this.monday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, MONDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.MONDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, MONDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.monday);
              obj = {};
            }
            if (weekDays[2] === 'Tuesday' && this.tueseday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, TUESDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.TUESDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, TUESDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.tueseday);
              obj = {};
            }
            if (weekDays[3] === 'Wednesday' && this.wednesday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, WEDNESDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.WEDNESDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, WEDNESDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.wednesday);
              obj = {};
            }
            if (weekDays[4] === 'Thursday' && this.thursday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, THURSDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.THURSDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, THURSDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.thursday);
              obj = {};
            }
            if (weekDays[5] === 'Friday' && this.friday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, FRIDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.FRIDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, FRIDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.friday);
              obj = {};
            }
            if (weekDays[6] === 'Saturday' && this.saturday === 0) {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, SATURDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SATURDAY = deleteEvent(this.toaster,this.startM,this.endM,eventType, SATURDAY, this.startH, this.endH, obj, startHour, endHour, startMinutes, endMinutes, startType, endType, this.saturday);
              obj = {};
            }
            /* delete if more than one checkbox is deleted ends
           */
          }
          console.log('reqFormat', reqFormat);
          let errMsg=[]
          if(Object.values(reqFormat).length>0){
            for (let [key, value] of Object.entries(reqFormat))
             {
                  if(Object.keys(value).length===0){
                    errMsg.push(key)
                  }            
            }
          }
           if(errMsg.length>1){
                this.delError()
            }else if(errMsg.length==1){
              this.delError(errMsg[0].toLocaleLowerCase()  ) 
            }             
          
          // submit the delete request by post request
          this.heatScheduleService
            .schedulerOperations(reqFormat)
            .subscribe((data: any) => {
              if (data.status === 'success') {
                this.dialogRef.close();
              }
            }, (err) => {
              console.log(err);
            });
        });
      return false;
    }
    else {
      this.dialogRef.close();
      return false;
    }
  }
  
  // add event
  onSubmit() {
    const type = this.dialogRef.id;
    const editType = this.dialogRef._containerInstance._config.data.submitType;
    const formControls = this.addEventForm.controls;
    // validate when none of the checkbox is selected.
    if (!(
      (this.addEventForm.get('Sunday').value) ||
      (this.addEventForm.get('Monday').value) ||
      (this.addEventForm.get('Tuesday').value) ||
      (this.addEventForm.get('Wednesday').value) ||
      (this.addEventForm.get('Thursday').value) ||
      (this.addEventForm.get('Friday').value) ||
      (this.addEventForm.get('Saturday').value)
    )
    ) {
      this.toaster.error('Select atleast one weekday and Time', '', {
        timeOut: 3000
      });
      this.weekArray=[];
      return;
    }
    const Sunday = this.addEventForm.get('Sunday').value;
    // push checkbox values to weekArray array.
    Object.keys(formControls).forEach(key => {
      const checked = formControls[key].value ? key : "";
      this.weekArray.push(checked);
    });
    // taking values from time picker form values
    this.startH = this.addEventForm.get('setHoursStart').value;
    this.endH = this.addEventForm.get('setHoursEnd').value;
    this.startM = this.addEventForm.get('setMinutesStart').value;
    this.endM = this.addEventForm.get('setMinutesEnd').value;

    const timeFormat = this.dialogRef.componentInstance.data.preference.eTimeFmt.Value;
    // if timeformat is 12 h convert time based on AM/PM
    if (timeFormat === "0") {
      let startType = this.addEventForm.get('antemeredianFormatStart').value;
      let endType = this.addEventForm.get('antemeredianFormatEnd').value;
      if (startType && endType) {
        startType = startType.toUpperCase();
        endType = endType.toUpperCase();
      }
      // PM
      if (startType === 'PM' && endType === 'PM') {
        if (this.startH === '12') {
          this.startH = 12;
        this.endH=(this.endH==='12'?12:parseInt(this.endH)+12);
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
        else if (this.endH === '12') {
          //this.startH = parseInt(this.startH) + 12;
          this.startH = parseInt(this.startH) + 12;
          this.endH = this.endH;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
        else {
          this.startH = parseInt(this.startH) + 12;
          this.endH = parseInt(this.endH) + 12;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
      }
      // AM
      else if (startType === 'AM' && endType === 'AM') {
        if (this.startH === '12' || (this.endH === '12')) {
          if (this.startH === '12')
            this.startH = '00';
          if (this.endH === '12')
            this.endH = '00';
          this.endH = this.endH;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
        // else if (this.endH === '12') {
        //   this.startH = this.startH
        //   this.endH = '00';
        //   this.startM = this.startM.split(' ')[0];
        //   this.endM = this.endM.split(' ')[0];
        // }
        else {
          this.startH = this.startH;
          this.endH = this.endH;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }

      }
      // AM PM
      else if (startType === 'AM' && endType === 'PM') {
        if (this.startH === '12') {
          this.startH = '00';
          if (this.endH != 12)
            this.endH = parseInt(this.endH) + 12;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
        else if (this.endH === '12') {
          this.startH = this.startH
          this.endH = 12;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
        else {
          this.startH = parseInt(this.startH);
          this.endH = parseInt(this.endH) + 12;
          this.startM = this.startM.split(' ')[0];
          this.endM = this.endM.split(' ')[0];
        }
      }
      // PM AM
      else if (startType === 'PM' && endType === 'AM') {
        this.toaster.error('Start time should be less than End time', '', {
          timeOut: 3000
        });
        return;
      }
    }
    const weekDays = this.weekArray;
    let reqFormat;
    reqFormat = { SUNDAY: {}, MONDAY: {} };
    // validate if user trys to add invalid time.
    const startConvert=parseInt(this.startH) * 60 + parseInt(this.startM);
    const endConverter=parseInt(this.endH) * 60 + parseInt(this.endM);
    if (startConvert>=endConverter) {
      this.toaster.error('Start time should be less than End time', '', {
        timeOut: 3000
      });
      this.weekArray=[];
      return;
    }
    if (!this.addEventForm.valid) {
      this.toaster.error('Please enter valid time based on format', '', {
        timeOut: 3000
      });
      this.weekArray=[];
      return;
    }
    else {
      this.authService.getxmlData()   // This to read the heat schedule from  currentxml data service
        .subscribe((data: any) => {
          if (data.status === 'Success') {
            this.heatScheduleData = data.result.heatSchedule;
            const sunday = this.heatScheduleData.SUNDAY;
            const monday = this.heatScheduleData.MONDAY;
            const tuesday = this.heatScheduleData.TUESDAY;
            const wednesday = this.heatScheduleData.WEDNESDAY;
            const thursday = this.heatScheduleData.THURSDAY;
            const friday = this.heatScheduleData.FRIDAY;
            const saturday = this.heatScheduleData.SATURDAY;
            // add event
            if (editType === 'add') {
              if (weekDays[0] === 'Sunday') {
                if (this.eventExist(sunday)) return;
                reqFormat.SUNDAY = addEvent1(this.weekArray,sunday, this.startH, this.endH, this.startM, this.endM, type, this.toaster);
              }
              // if monday is checked
              if (weekDays[1] === 'Monday') {
                if (this.eventExist(monday)) return;
                reqFormat.MONDAY = addEvent1(this.weekArray,monday, this.startH, this.endH, this.startM, this.endM, type, this.toaster,)
              }
              // if tuesday is checked
              if (weekDays[2] === 'Tuesday') {
                if (this.eventExist(tuesday)) return;
                reqFormat.TUESDAY = addEvent1(this.weekArray,tuesday, this.startH, this.endH, this.startM, this.endM, type, this.toaster)
              }
              // if wednesday is checked
              if (weekDays[3] === 'Wednesday') {
                if (this.eventExist(wednesday)) return;
                reqFormat.WEDNESDAY = addEvent1(this.weekArray,wednesday, this.startH, this.endH, this.startM, this.endM, type, this.toaster)
              }
              // if thursday is checked
              if (weekDays[4] === 'Thursday') {
                if (this.eventExist(thursday)) return;
                reqFormat.THURSDAY = addEvent1(this.weekArray,thursday, this.startH, this.endH, this.startM, this.endM, type, this.toaster)
              }
              // if friday is checked
              if (weekDays[5] === 'Friday') {
                if (this.eventExist(friday)) return;
                reqFormat.FRIDAY = addEvent1(this.weekArray,friday, this.startH, this.endH, this.startM, this.endM, type, this.toaster)
              }
              // if saturday is checked
              if (weekDays[6] === 'Saturday') {
                if (this.eventExist(saturday)) return;
                reqFormat.SATURDAY = addEvent1(this.weekArray,saturday, this.startH, this.endH, this.startM, this.endM, type, this.toaster)
              }
            }
            // update event
            else if (editType === 'update') {
              
              // get current event data from modal pop up
              const currentEvent = this.dialogRef.componentInstance.data.event;
              const startHour = currentEvent.startH;
              const endHour = currentEvent.endH;
              const startMinutes = currentEvent.startM;
              const endMinutes = currentEvent.endM;
              const startType = currentEvent.startType;
              const endType = currentEvent.endType;
              const id = currentEvent.id;
              const schedular = currentEvent.eventNumber;
              const currentStart = currentEvent.start;
              const currentEnd = currentEvent.end;
              let obj = {};
              // assign startHour,endHour,... to Obj to update current event
              obj[startHour] = this.startH;
              obj[endHour] = this.endH;
              obj[startMinutes] = this.startM;
              obj[endMinutes] = this.endM;
              obj[startType] = id;
              obj[endType] = id === "2" ? 1 : 4
              
              
              // if current edit is Sunday
              if (this.currentDay === 'Sunday' && weekDays[0]==="Sunday") {
                // event type is Heat
                if (id === "3") {
                  let res=this.setBackUpdate(sunday,this.startH, this.endH, this.startM, this.endM, schedular,id) 
                      if(res=="done"){
                        this.sunday++;
                        reqFormat.SUNDAY = obj;
                      }else{
                        this.errorMessages[res]()  //res will give type of error message
                        this.weekArray=[];
                        return;
                      }                                                      
                }
                // event type is Setback
                else if (id === "2") {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, sunday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(sunday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.sunday++;
                        reqFormat.SUNDAY = obj;
                      }
                    }
          
                }
              }
              if (this.currentDay === 'Monday' && weekDays[1]==="Monday") {

                if (id === "3") {
                  if (validateEditSetBack(monday, this.startH, this.endH, this.startM, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, monday, schedular, id) && id === "3") {
                      this.toaster.error('Setback event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      this.monday++;
                      reqFormat.MONDAY = obj;
                    }
                  }
                  else {
                    this.toaster.error('Setback event must contain between Heat event range', '', {
                      timeOut: 3000
                    });
                    this.weekArray=[];
                    return;
                  }
                }
                else if (id === "2") {
                  // if (HeatEditRange(monday, this.startH, this.startM, this.endH, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, monday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(monday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.monday++;
                        reqFormat.MONDAY = obj;
                      }
                    }
                  // }
                  // else {
                  //   this.toaster.error('Heat event already exists', '', {
                  //     timeOut: 3000
                  //   });
                  //   this.weekArray=[];
                  //   return
                  // }
                }
              }
              if (this.currentDay === 'Tuesday' && weekDays[2]==="Tuesday") {
                if (id === "3") {
                  if (validateEditSetBack(tuesday, this.startH, this.endH, this.startM, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, tuesday, schedular, id) && id === "3") {
                      this.toaster.error('Setback event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(tuesday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.tueseday++;
                        reqFormat.TUESDAY = obj;
                      }
                    }
                  }
                  else {
                    this.toaster.error('Setback event must contain between Heat event range', '', {
                      timeOut: 3000
                    });
                    this.weekArray=[];
                    return;
                  }
                }
                else if (id === "2") {
                  // if (HeatEditRange(tuesday, this.startH, this.startM, this.endH, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, tuesday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(tuesday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.tueseday++;
                        reqFormat.TUESDAY = obj;
                      }
                    }
                  // }
                  // else {
                  //   this.toaster.error('Heat event already exists', '', {
                  //     timeOut: 3000
                  //   });
                  //   this.weekArray=[];
                  //   return
                  // }
                }
              }
              if (this.currentDay === 'Wednesday' && weekDays[3]==="Wednesday") {
                if (id === "3") {
                  if (validateEditSetBack(wednesday, this.startH, this.endH, this.startM, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, wednesday, schedular, id) && id === "3") {
                      this.toaster.error('Setback event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      this.wednesday++;
                      reqFormat.WEDNESDAY = obj;
                    }
                  }
                  else {
                    this.toaster.error('Setback event must contain between Heat event range', '', {
                      timeOut: 3000
                    });
                    this.weekArray=[];
                    return;
                  }
                }
                else if (id === "2") {
                  // if (HeatEditRange(wednesday, this.startH, this.startM, this.endH, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, wednesday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(wednesday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.wednesday++;
                        reqFormat.WEDNESDAY = obj;
                      }
                    }
                  // }
                  // else {
                  //   this.toaster.error('Heat event already exists', '', {
                  //     timeOut: 3000
                  //   });
                  //   this.weekArray=[];
                  //   return
                  // }
                }
              }
              if (this.currentDay === 'Thursday' && weekDays[4]==="Thursday") {
                if (id === "3") {
                  if (validateEditSetBack(thursday, this.startH, this.endH, this.startM, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, thursday, schedular, id) && id === "3") {
                      this.toaster.error('Setback event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      this.thursday++;
                      reqFormat.THURSDAY = obj;
                    }
                  }
                  else {
                    this.toaster.error('Setback event must contain between Heat event range', '', {
                      timeOut: 3000
                    });
                    this.weekArray=[];
                    return;
                  }
                }
                else if (id === "2") {
                  // if (HeatEditRange(thursday, this.startH, this.startM, this.endH, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, thursday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(thursday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.thursday++;
                        reqFormat.THURSDAY = obj;
                      }
                    }
                  // }
                  // else {
                  //   this.toaster.error('Heat event already exists', '', {
                  //     timeOut: 3000
                  //   });
                  //   this.weekArray=[];
                  //   return
                  // }
                }
              }
              if (this.currentDay === 'Friday' && weekDays[5]==="Friday") {
                if (id === "3") {
                  if (validateEditSetBack(friday, this.startH, this.endH, this.startM, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, friday, schedular, id) && id === "3") {
                      this.toaster.error('Setback event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      this.friday++;
                      console.log(obj,'obj')
                      reqFormat.FRIDAY = obj;
                    }
                  }
                  else {
                    this.toaster.error('Setback event must contain between Heat event range', '', {
                      timeOut: 3000
                    });
                    this.weekArray=[];
                    return;
                  }
                }
                else if (id === "2") {
                  // if (HeatEditRange(friday, this.startH, this.startM, this.endH, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, friday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(friday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.friday++;
                        reqFormat.FRIDAY = obj;
                      }
                    }
                  // }
                  // else {
                  //   this.toaster.error('Heat event already exists', '', {
                  //     timeOut: 3000
                  //   });
                  //   this.weekArray=[];
                  //   return
                  // }
                }
              }
              if (this.currentDay === 'Saturday' && weekDays[6]==="Saturday") {
                if (id === "3") {
                  if (validateEditSetBack(saturday, this.startH, this.endH, this.startM, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, saturday, schedular, id) && id === "3") {
                      this.toaster.error('Setback event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      this.saturday++;
                      reqFormat.SATURDAY = obj;
                    }
                  }
                  else {
                    this.toaster.error('Setback event must contain between Heat event range', '', {
                      timeOut: 3000
                    });
                    this.weekArray=[];
                    return;
                  }
                }
                else if (id === "2") {
                  // if (HeatEditRange(saturday, this.startH, this.startM, this.endH, this.endM, schedular)) {
                    if (!validateEventsOnUpdate(this.startH, this.startM, this.endH, this.endM, saturday, schedular, id) && id === "2") {
                      this.toaster.error('Heat event already exists', '', {
                        timeOut: 3000
                      });
                      this.weekArray=[];
                      return;
                    }
                    else {
                      if (!validateHeatRange(saturday, this.startH, this.startM, this.endH, this.endM, id, currentStart, currentEnd)) {
                        this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
                          timeOut: 3000
                        });
                        this.weekArray=[];
                        return;
                      }
                      else {
                        this.saturday++;
                        reqFormat.SATURDAY = obj;
                      }
                    }
                  // }
                  // else {
                  //   this.toaster.error('Heat event already exists', '', {
                  //     timeOut: 3000
                  //   });
                  //   this.weekArray=[];
                  //   return
                  // }
                }
              }
              // to add new event while editing for week day(Sunday,Monday,.....)
              if (weekDays[0] === 'Sunday' && this.sunday === 0) {
                // if (this.eventExist(sunday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, sunday) 
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, sunday) 
                if (!validSetBack && id === "3") {
 
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  // return;
                }
                 if (!validHeat && id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                }
                else if(validSetBack||validHeat){
                  let addEvents=addEvent(sunday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.SUNDAY = addEvents
                  }
                  else {
                    if (this.eventExist(sunday))return;

                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }
                }
              }
              else if (weekDays[0] === "" && this.sunday != 0) {
              }
              if (weekDays[1] === 'Monday' && this.monday === 0) {
                // if (this.eventExist(monday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, monday)
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, monday)
                if (!validSetBack && id === "3") {
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  // return;
                }
                if (!validHeat && id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  return;
                }
                else if(validHeat||validSetBack) {
                  let addEvents=addEvent(monday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.MONDAY = addEvents
                  }
                  else {
                    if (this.eventExist(monday)) return;
                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }
                }
              }
              else if (weekDays[1] === "" && this.monday != 0) {
              }
              if (weekDays[2] === 'Tuesday' && this.tueseday === 0) {
                // if (this.eventExist(tuesday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, tuesday)
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, tuesday)
                if (!validSetBack && id === "3") {
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  // return;
                }
                if (!validHeat && id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  return;
                }
                else if(validSetBack||validHeat) {
                  let addEvents=addEvent(tuesday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.TUESDAY = addEvents
                  }
                  else {
                    if (this.eventExist(tuesday)) return;
                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }

                }
              }
              else if (weekDays[2] === "" && this.tueseday != 0) {
              }
              if (weekDays[3] === 'Wednesday' && this.wednesday === 0) {
                // if (this.eventExist(wednesday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, wednesday)
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, wednesday) 
                if (!validSetBack && id === "3") {
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  // return;
                }
                if (!validHeat&& id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  return;
                }
                else if(validHeat||validSetBack) {
                  let addEvents=addEvent(wednesday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.WEDNESDAY = addEvents
                  }
                  else {
                    if (this.eventExist(wednesday)) return;

                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }
                }
              }
              else if (weekDays[3] === "" && this.wednesday != 0) {
              }
              if (weekDays[4] === 'Thursday' && this.thursday === 0) {
                // if (this.eventExist(thursday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, thursday)
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, thursday)
                if (!validSetBack&& id === "3") {
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  
                  // return;
                }
                if (!validHeat&& id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  return;
                }
                else if(validSetBack||validHeat){
                  let addEvents=addEvent(thursday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.THURSDAY = addEvents
                  }
                  else {
                    if (this.eventExist(thursday)) return;
                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }
                }
              }
              else if (weekDays[4] === "" && this.thursday != 0) {
              }
              if (weekDays[5] === 'Friday' && this.friday === 0) {
                // if (this.eventExist(friday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, friday)
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, friday) 
                if (!validSetBack&& id === "3") {
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
             
                  // return;
                }
                if (!validHeat&& id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  return;
                }
                else if(validSetBack||validHeat){
                  let addEvents=addEvent(friday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.FRIDAY = addEvents
                  }
                  else {
                    if (this.eventExist(friday)) return;
                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }
                }
              }
              else if (weekDays[5] === "" && this.friday != 0) {
              }
              if (weekDays[6] === 'Saturday' && this.saturday === 0) {
                // if (this.eventExist(saturday)) return;
                let validSetBack=validateSetbackEvents(this.startH, this.startM, this.endH, this.endM, saturday)
                let validHeat=validateHeatEvents(this.startH, this.startM, this.endH, this.endM, saturday)

                if (!validSetBack && id === "3") {
                  this.toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  // return;
                }
                if (!validHeat && id === "2") {
                  this.toaster.error('Heat event already exists', '', {
                    timeOut: 3000
                  });
                  this.weekArray=[];
                  return;
                }
                else if(validSetBack||validHeat) {
                  let addEvents=addEvent(saturday, this.startH, this.endH, this.startM, this.endM, id)
                  if (addEvents) {
                    reqFormat.SATURDAY = addEvents
                  }
                  else {
                    if (this.eventExist(saturday)) return;
                    this.errorMessages.setBackBtw()
                    this.weekArray=[];
                    return;
                  }
                }
              }
              else if (weekDays[6] === "" && this.saturday != 0) {
              }
            }
            console.log('reqFormat', reqFormat);
            // pass event data to Schedular post Service
            this.heatScheduleService
              .schedulerOperations(reqFormat)
              .subscribe((data: any) => {
                if (data.status === 'success') {
                  this.dialogRef.close();
                }
              }, (err) => {
                console.log(err);
              })
          }
        }, (err) => {
          console.log('err', err)
        })
    }

  }
   //composition of heat and setback add/update functions
   
   //setback update
   setBackUpdate=(day,startH, endH, startM, endM, schedular ,id)=>{
    if (validateEditSetBack(day, startH, endH, startM, endM, schedular)) {
      if (!validateEventsOnUpdate(startH, startM, endH, endM, day, schedular, id) && id === "3") {
         return "setbackExist"
      }
      else {
         return "done"
      }
    }
    else {
         return "setBackBtw"
    }
   }

   heatEventUpdate=(startH, startM, endH, endM, day, schedular, id,start?,end?)=>{
    // if (HeatEditRange(day, startH, startM, endH, endM, schedular)) {
      if (!validateEventsOnUpdate(startH, startM, endH, endM, day, schedular, id) && id === "2") {
        return "heatEvtExist"
      }
      else {
        if (!validateHeatRange(day, startH, startM, endH, endM, id, start, end)) {
          return "heatOutOfSetback"
        }
        else {
          return "done"
        }
      }
    // }
    // else {
    //   return "heatEvtExist"
    // }
   }
     
   errorMessages={
      setbackExist:()=>{return this.toaster.error('Setback event already exists', '', {
        timeOut: 3000
      })},
      setBackBtw:()=>{return this.toaster.error('Setback event must contain between Heat event range', '', {
        timeOut: 3000
      });},
      heatEvtExist:()=>{return this.toaster.error('Heat event already exists', '', {
        timeOut: 3000
      });},
      heatOutOfSetback:()=>{return this.toaster.error('Cannot update Heat Event out of SetBack Event', '', {
          timeOut: 3000
        });
      }
      
   }


  // set clock for time picker.
  setClock(format) {
    let setHour: number
    this.hours = [];
    parseInt(format) === 0 ? setHour = 13 : setHour = 24;
    for (let i = 0; i < setHour; i++) {
      if (parseInt(format) === 0 && i == 0) {
        continue;
      }
      let val: any = i
      if (val.toString().length == 1) {
        val = "0" + val;
      }
      this.hours.push({ value: val.toString() });
    }
    for (let j = 0; j < 60; j++) {
      let val: any = j;
      if (val.toString().length == 1) {
        val = "0" + val;
      }
      this.minutes.push({ value: val.toString() });
    }
  }

  closeEvent() {
    this.dialogRef.close();
    return false;
  }


}
