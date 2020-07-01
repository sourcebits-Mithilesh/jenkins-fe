import { Component, OnInit, Inject, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth.service';
import { getEventsShift } from '../get-events';
import { ToastrService } from 'ngx-toastr';
import { addShiftEvent } from '../add-event';
import { HeatScheduleService } from '../heat-schedule.service';
import { HeatSchedulerServiceService } from '../heatSchedulerp/heat-scheduler-service.service';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { deleteEventShift } from '../delete-events';
import { validateShiftsOnUpdate, validateShiftEvents } from '../event-validation';

@Component({
  selector: 'nordson-shift-schedule',
  templateUrl: './shift-schedule.component.html',
  styleUrls: ['../heat-schedule.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ShiftScheduleComponent implements OnInit,AfterViewChecked {

    
  constructor(public dialog: MatDialog,
    private fb:FormBuilder,
    private authService:AuthService,
    private userService: UserService,
    private setupService: SetupToolsService,
    private service:HeatSchedulerServiceService) { }
  bgdClrForHeight = '#0D436D';
  public selectedDate: Date = new Date('2018-10-21T00:00:00');
  weekArray = new Array();
  eventColor: any;
  preference:any
  events:any=[];
  shiftEvents=[];
  heatButton;
  disable:boolean;
  noScroll;
  checked=false;
  shiftForm = this.fb.group({
    date: [''],
    timePicker: [''],
    enableScheduler: ['']
  });
  accessType;
  //for ui issue
  //  data=this.preference['eTimeFmt'].Value=='1'?'HH:mm':'hh:mm:A' ;
  toogleScheduler(event) {
    if (event.checked === false) {
      this.checked = false;
      this.heatButton = '0.4';
      this.noScroll='none';
      // update prefrences to 0 if toogle is unchecked
      this.setupService.updatePreference({ "blShiftEnable": 0 }).subscribe(
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
      this.setupService.updatePreference({ "blShiftEnable": 1 }).subscribe(
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


  eventDblClickHandler(event){
    if (this.checked === true && this.disable === false) {
      const dialogRef = this.dialog.open(ShiftEventModal, {
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
        this.ngOnInit();
      });
      // console.log('event', event.event.dataItem);
    }
  }

  addShift(): void {
    // if (this.checked === true && this.disable === false) {
      const dialogRef = this.dialog.open(ShiftEventModal, {
        width: '500px',
        height: '100%',
        panelClass: 'heateventclass',
        // pass data to modal
        data: {
          data: '',
          submitType: 'add',
          preference: this.preference
        },
        // id: eventType
      });
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    // }
  }
  
  ngAfterViewChecked(){

  }
  ngAfterViewInit() {

  }
  
  ngOnInit() {
    
    this.renderObject()
  }
  renderObject(){
    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
      if (this.accessType === 1) {
        this.shiftForm.get('enableScheduler').disable();
        this.disable = true;
      }
      else {
        this.disable = false;
      }
    }
  this.authService.getxmlData() // getting data from current xml data service.
  .subscribe((data: any) => {
  if (data.status === 'Success') { 
    const sunday = data.result.shiftSchedule.SHIFT_SUNDAY;
    const monday = data.result.shiftSchedule.SHIFT_MONDAY;
    const tueseday = data.result.shiftSchedule.SHIFT_TUESDAY;
    const wednesday = data.result.shiftSchedule.SHIFT_WEDNESDAY;
    const thursday = data.result.shiftSchedule.SHIFT_THURSDAY;
    const friday = data.result.shiftSchedule.SHIFT_FRIDAY;
    const saturday = data.result.shiftSchedule.SHIFT_SATURDAY;
    const Scheduler = data.result.systemPreferences.blShiftEnable.Value
    this.preference = data.result.systemPreferences;
    if (Scheduler) {
      this.shiftForm.patchValue({
        enableScheduler: Scheduler === "1" ? true : false,})
    }
    const enableScheduler = this.shiftForm.get('enableScheduler').value;
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
    if(this.preference){let data=this.preference['eTimeFmt'].Value?'HH:mm':'hh:mm:A' ;
                         this.service.setFormat(data) 
     }
     this.events= getEventsShift(sunday,monday,tueseday,wednesday,thursday,friday,saturday)
    
    this.shiftEvents=this.events.filter((event)=>event['startH']!="255")
    }

  })
  }
 
  
   
}


@Component({
  selector:'shift-event-modal',
  templateUrl:'./shift-event-modal.html',
  styleUrls:['../heat-schedule.component.css']
})
export class ShiftEventModal{
  addEventForm: FormGroup;
  weekArray = new Array();
  shiftScheduleData: any;
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
  shifts=[{value:1},{value:2},{value:3},{value:4},{value:5}]
  checkTimeForm: boolean;
  typeOfSubmit;

  anteMeridianFormats: any = [{ value: 'AM' }, { value: 'PM' }];
  constructor( public dialogRef: MatDialogRef<ShiftEventModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private authService:AuthService,
    private heatScheduleService:HeatScheduleService
    ){}

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
        shiftIndex:[''],
        antemeredianFormatEnd: ['AM']
      });
      this.addEventForm.get('shiftIndex').patchValue(1)
      
      const currentEvent = this.dialogRef.componentInstance.data.event;
      const submitType = this.dialogRef.componentInstance.data.submitType;
      const type = this.dialogRef.id;
      // if submit type is add setting the button text and lable text
      if (submitType === 'add') {
        this.buttonText = 'CANCEL';
        this.addText = 'ADD EVENT';
          this.enterSetBackText = 'Shift On Time'
          this.exitSetBackText = 'Shift Off Time';
        this.typeOfSubmit=false;
       
      }
      // if submit type is update  setting the button text and lable text
      if (submitType === 'update') {
        const editType = this.dialogRef.componentInstance.data.event.id;
        this.buttonText = 'DELETE';
        this.addText = 'UPDATE EVENT';
      
          this.enterSetBackText = 'Shift On Time'
          this.exitSetBackText = 'Shift Off Time';
        this.typeOfSubmit=true;
      }


      console.log(this.dialogRef.componentInstance.data)
      const format = this.dialogRef.componentInstance.data.preference.eTimeFmt.Value;
      this.setClock(format);

      if (format === "0") {
        this.checkTimeForm = false;
      }
      else if (format === "1") {
        this.checkTimeForm = true;
      }


      if (submitType === 'add') {
        this.buttonText = 'CANCEL';
        this.addText = 'ADD EVENT';
        this.typeOfSubmit=false;

      }
      // if submit type is update  setting the button text and lable text
      if (submitType === 'update') {
        const editType = this.dialogRef.componentInstance.data.event.id;
        this.buttonText = 'DELETE';
        this.addText = 'UPDATE EVENT';
        this.typeOfSubmit=true;

      }

      if (currentEvent) {
        let startClock;
        let endClock;
        let hours;
        let end;
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

  
  eventExist(obj) {
    // obj is week days (Sunday,Monday,.....)
    // maximum 6 events will be added for a day.
    if (obj.ShiftEvent0StartHour.Value != "255"  // if value is 255 inside the xml tag than event is not added.
      && obj.ShiftEvent1StartHour.Value != "255"
      && obj.ShiftEvent2StartHour.Value != "255"
      && obj.ShiftEvent3StartHour.Value != "255"
      && obj.ShiftEvent4StartHour.Value != "255") {
      // throw toaster error.
      this.toaster.error('Can not add more than 5 shifts for Scheduler', '', {
        timeOut: 3000
      });
      this.weekArray=[]
      return true;
    }
    return false;
  }

    setClock(format) {
      if (format === "0") {
        this.checkTimeForm = false;
      }
      else if (format === "1") {
        this.checkTimeForm = true;
      }
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


  delError(dayType?){
    this.toaster.error(`Cannot delete event for ${dayType?dayType:"the days"}`, '', {
      timeOut: 3000
    })
    this.weekArray=[];
  }    
  delEvent() {
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
           
            const formControls = this.addEventForm.controls;
            Object.keys(formControls).forEach(key => {
              const checked = formControls[key].value ? key : "";
              this.weekArray.push(checked);
            });
            const weekDays = this.weekArray;
            let obj = {};
            obj[startHour] = 255;
            obj[endHour] = 255;
            obj[startMinutes] = 255;
            obj[endMinutes] = 255;
          
          this.authService.getxmlData()
          .subscribe((data: any) => {
            if (data.status === 'Success') {
            this.shiftScheduleData=data.result.shiftSchedule;
           
            const {SHIFT_SUNDAY,SHIFT_MONDAY,SHIFT_TUESDAY,SHIFT_WEDNESDAY,SHIFT_THURSDAY,SHIFT_FRIDAY,SHIFT_SATURDAY}=this.shiftScheduleData
            
            if (this.addEventForm.get('Sunday').value
            && this.addEventForm.get('Monday').value
            && this.addEventForm.get('Tuesday').value
            && this.addEventForm.get('Wednesday').value
            && this.addEventForm.get('Thursday').value
            && this.addEventForm.get('Friday').value
            && this.addEventForm.get('Saturday').value
          ) {
            reqFormat.SHIFT_SUNDAY = deleteEventShift(SHIFT_SUNDAY, obj, this.startH, this.endH, this.startM, this.endM);
            reqFormat.SHIFT_MONDAY = deleteEventShift( SHIFT_MONDAY, obj, this.startH, this.endH, this.startM, this.endM);
            reqFormat.SHIFT_TUESDAY = deleteEventShift( SHIFT_TUESDAY, obj, this.startH, this.endH, this.startM, this.endM);
            reqFormat.SHIFT_WEDNESDAY = deleteEventShift( SHIFT_WEDNESDAY, obj, this.startH, this.endH, this.startM, this.endM);
            reqFormat.SHIFT_THURSDAY = deleteEventShift( SHIFT_THURSDAY, obj, this.startH, this.endH, this.startM, this.endM);
            reqFormat.SHIFT_FRIDAY = deleteEventShift( SHIFT_FRIDAY, obj, this.startH, this.endH, this.startM, this.endM);
            reqFormat.SHIFT_SATURDAY = deleteEventShift( SHIFT_SATURDAY, obj, this.startH, this.endH, this.startM, this.endM  );
            
              this.sunday++;
              this.monday++;
              this.tueseday++;
              this.wednesday++;
              this.thursday++;
              this.friday++;
              this.sunday++;
          }
          else{
            if (weekDays[0] === 'Sunday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, SUNDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              
              reqFormat.SHIFT_SUNDAY = deleteEventShift(SHIFT_SUNDAY, obj, this.startH, this.endH, this.startM, this.endM);
              this.sunday++;
            }
            if (weekDays[1] === 'Monday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, MONDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              //console.log(this.startH)
              reqFormat.SHIFT_MONDAY = deleteEventShift( SHIFT_MONDAY, obj, this.startH, this.endH, this.startM, this.endM);

              this.monday++;
            }
            if (weekDays[2] === 'Tuesday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, TUESDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SHIFT_TUESDAY = deleteEventShift( SHIFT_TUESDAY, obj, this.startH, this.endH, this.startM, this.endM);
 
              this.tueseday++;
            }
            if (weekDays[3] === 'Wednesday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, WEDNESDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SHIFT_WEDNESDAY = deleteEventShift( SHIFT_WEDNESDAY, obj, this.startH, this.endH, this.startM, this.endM);

              this.wednesday++;
            }
            if (weekDays[4] === 'Thursday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, THURSDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SHIFT_THURSDAY = deleteEventShift( SHIFT_THURSDAY, obj, this.startH, this.endH, this.startM, this.endM);

              this.thursday++;
            }
            if (weekDays[5] === 'Friday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, FRIDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SHIFT_FRIDAY = deleteEventShift( SHIFT_FRIDAY, obj, this.startH, this.endH, this.startM, this.endM);

              this.friday++;
            }
            if (weekDays[6] === 'Saturday') {
              // if(!(deleteEvent(this.toaster,startM,endM,eventType, SATURDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
              //   this.delError()
              //   return;
              // }
              reqFormat.SHIFT_SATURDAY = deleteEventShift( SHIFT_SATURDAY, obj, this.startH, this.endH, this.startM, this.endM  );
              this.saturday++;
            }
          }
          if (weekDays[0] === 'Sunday' && this.sunday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, SUNDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_SUNDAY = deleteEventShift(SHIFT_SUNDAY, obj, this.startH, this.endH, this.startM, this.endM);
            obj = {};
          }
          if (weekDays[1] === 'Monday' && this.monday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, MONDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_MONDAY = deleteEventShift( SHIFT_MONDAY, obj, this.startH, this.endH, this.startM, this.endM);
            obj = {};
          }
          if (weekDays[2] === 'Tuesday' && this.tueseday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, TUESDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_TUESDAY = deleteEventShift( SHIFT_TUESDAY, obj, this.startH, this.endH, this.startM, this.endM);
            obj = {};
          }
          if (weekDays[3] === 'Wednesday' && this.wednesday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, WEDNESDAY, startTime, endTime, obj, this.startH, this.endH, this.startM, this.endM, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_WEDNESDAY = deleteEventShift( SHIFT_WEDNESDAY, obj, startHour, endHour, startMinutes, endMinutes);
            obj = {};
          }
          if (weekDays[4] === 'Thursday' && this.thursday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, THURSDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_THURSDAY = deleteEventShift( SHIFT_THURSDAY, obj, startHour, endHour, startMinutes, endMinutes);
            obj = {};
          }
          if (weekDays[5] === 'Friday' && this.friday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, FRIDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_FRIDAY = deleteEventShift( SHIFT_FRIDAY, obj, startHour, endHour, startMinutes, endMinutes);
            obj = {};
          }
          if (weekDays[6] === 'Saturday' && this.saturday === 0) {
            // if(!(deleteEvent(this.toaster,startM,endM,eventType, SATURDAY, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType, endType))){
            //   this.delError()
            //   return;
            // }
            reqFormat.SHIFT_SATURDAY = deleteEventShift( SHIFT_SATURDAY, obj, startHour, endHour, startMinutes, endMinutes  );
            obj = {};
          }
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
          this.heatScheduleService.shiftSchedulerOperations(reqFormat)
             .subscribe((data: any) => {
              if (data.status === 'success') {
                this.dialogRef.close();
              }
            }, (err) => {
              console.log(err);
            });


            }
          });

        }else {
          this.dialogRef.close();
          return false;
        }


  }

  onSubmit(){
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
      reqFormat = {  };
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
          this.shiftScheduleData = data.result.shiftSchedule;
          const sunday = this.shiftScheduleData.SHIFT_SUNDAY;
          const monday = this.shiftScheduleData.SHIFT_MONDAY;
          const tuesday = this.shiftScheduleData.SHIFT_TUESDAY;
          const wednesday = this.shiftScheduleData.SHIFT_WEDNESDAY;
          const thursday = this.shiftScheduleData.SHIFT_THURSDAY;
          const friday = this.shiftScheduleData.SHIFT_FRIDAY;
          const saturday = this.shiftScheduleData.SHIFT_SATURDAY;
          // add event
          let shiftIndex=parseInt(this.addEventForm.get('shiftIndex').value)-1
          
          if (editType === 'add') {
            //TODO
            if (weekDays[0] === 'Sunday') {
              if (this.eventExist(sunday)) return;
                reqFormat.SHIFT_SUNDAY = addShiftEvent(sunday, this.startH, this.endH, this.startM, this.endM, this.toaster,shiftIndex);
              } 
           // if monday is checked
           if (weekDays[1] === 'Monday') {
            if (this.eventExist(monday)) return;
            reqFormat.SHIFT_MONDAY = addShiftEvent(monday, this.startH, this.endH, this.startM, this.endM,  this.toaster,shiftIndex)
          }
          // if tuesday is checked
          if (weekDays[2] === 'Tuesday') {
            if (this.eventExist(tuesday)) return;
            reqFormat.SHIFT_TUESDAY = addShiftEvent(tuesday, this.startH, this.endH, this.startM, this.endM,  this.toaster,shiftIndex)
          }
          // if wednesday is checked
          if (weekDays[3] === 'Wednesday') {
            if (this.eventExist(wednesday)) return;
            reqFormat.SHIFT_WEDNESDAY = addShiftEvent(wednesday, this.startH, this.endH, this.startM, this.endM,  this.toaster,shiftIndex)
          }
          // if thursday is checked
          if (weekDays[4] === 'Thursday') {
            if (this.eventExist(thursday)) return;
            reqFormat.SHIFT_THURSDAY = addShiftEvent(thursday, this.startH, this.endH, this.startM, this.endM,  this.toaster,shiftIndex)
          }
          // if friday is checked
          if (weekDays[5] === 'Friday') {
            if (this.eventExist(friday)) return;
            reqFormat.SHIFT_FRIDAY = addShiftEvent(friday, this.startH, this.endH, this.startM, this.endM,  this.toaster,shiftIndex)
          }
          // if saturday is checked
          if (weekDays[6] === 'Saturday') {
            if (this.eventExist(saturday)) return;
            reqFormat.SHIFT_SATURDAY = addShiftEvent(saturday, this.startH, this.endH, this.startM, this.endM,  this.toaster,shiftIndex)
          }         
          }
          else if (editType === 'update') {
                          // get current event data from modal pop up
            const currentEvent = this.dialogRef.componentInstance.data.event;
            const startHour =`ShiftEvent${currentEvent.shift}StartHour` ;
            const endHour = `ShiftEvent${currentEvent.shift}EndHour`
            const startMinutes = `ShiftEvent${currentEvent.shift}StartMinute`;
            const endMinutes = `ShiftEvent${currentEvent.shift}EndMinute`;
              
            let obj = {};
            // assign startHour,endHour,... to Obj to update current event
            obj[startHour] = this.startH;
            obj[endHour] = this.endH;
            obj[startMinutes] = this.startM;
            obj[endMinutes] = this.endM;
          
                        // if current edit is Sunday
          if (this.currentDay === 'Sunday' && weekDays[0]==="Sunday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, sunday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.sunday++;
              reqFormat.SHIFT_SUNDAY = obj;
            }
          
          }
          if (this.currentDay === 'Monday' && weekDays[1]==="Monday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, monday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.monday++;
              reqFormat.SHIFT_MONDAY = obj;
            }
          }
          if (this.currentDay === 'Tuesday' && weekDays[2]==="Tuesday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, tuesday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.tueseday++;
              reqFormat.SHIFT_TUESDAY = obj;
            }
          }
          if (this.currentDay === 'Wednesday' && weekDays[3]==="Wednesday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, wednesday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.wednesday++;
              reqFormat.SHIFT_WEDNESDAY= obj;
            }
          }
          if (this.currentDay === 'Thursday' && weekDays[4]==="Thursday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, thursday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.thursday++;
              reqFormat.SHIFT_THURSDAY = obj;
            }
          }
          if (this.currentDay === 'Friday' && weekDays[5]==="Friday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, monday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.friday++;
              reqFormat.SHIFT_FRIDAY = obj;
            }
          }
          if (this.currentDay === 'Saturday' && weekDays[6]==="Saturday") {
            if (!validateShiftsOnUpdate(this.startH, this.startM, this.endH, this.endM, monday,currentEvent.shift)) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
              return;      
            }
            
            else {
              this.saturday++;
              reqFormat.SHIFT_SATURDAY = obj;
            }
          }

          //for adding new shift 
          if (weekDays[0] === 'Sunday' && this.sunday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, sunday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(sunday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_SUNDAY = addEvents
              }
            }

          }
          if (weekDays[1] === 'Monday' && this.monday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, monday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(monday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_MONDAY = addEvents
              }
            }

          }
          if (weekDays[2] === 'Tuesday' && this.tueseday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, tuesday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(tuesday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_TUESDAY = addEvents
              }
            }

          }
          if (weekDays[3] === 'Wednesday' && this.wednesday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, wednesday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(wednesday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_WEDNESDAY = addEvents
              }
            }

          }
          if (weekDays[4] === 'Thursday' && this.thursday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, thursday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(thursday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_THURSDAY = addEvents
              }
            }

          }
          if (weekDays[5] === 'Friday' && this.friday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, friday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(friday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_FRIDAY = addEvents
              }
            }

          }
          if (weekDays[6] === 'Saturday' && this.saturday === 0) {
            let validShift=validateShiftEvents(this.startH, this.startM, this.endH, this.endM, saturday) 
            if (!validShift ) {
              this.toaster.error('Shift event already exists', '', {
                timeOut: 3000
              });
              this.weekArray=[];
            }
            else if(validShift){
              let addEvents=addShiftEvent(saturday, this.startH, this.endH, this.startM, this.endM,this.toaster,shiftIndex);
              if (addEvents) {
                reqFormat.SHIFT_SATURDAY = addEvents
              }
            }

          }

        }
          this.heatScheduleService
          .shiftSchedulerOperations(reqFormat)
          .subscribe((data: any) => {
            if (data.status === 'success') {
              this.dialogRef.close();
            }
          }, (err) => {
            console.log(err);
          })

        }
        }
      );

    

    }
  }
}