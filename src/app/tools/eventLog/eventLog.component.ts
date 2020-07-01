import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { EventLogService } from './eventLog.service';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { NotificationService } from '../../toastr-notification/toastr-notification.service';
import { ToastrService } from 'ngx-toastr';
import { EventlogtypeconvertPipe } from 'src/app/pipes/eventlogtypeconvert.pipe';

@Component({
  selector: 'nordson-event-log2',
  templateUrl: './eventLog.component.html',
  styleUrls: ['./eventLog.component.css']
})
export class EventLogComponent implements OnInit {
  eventForm: FormGroup;
  eventFormCtrl:any;
  authToken: any;
  showHide: boolean;
  date: boolean;
  checked: boolean;
  checkeddate: boolean;
  checkedzone: boolean;
  checkedEventTrigger: boolean = false;
  checkedDateTrigger: boolean = false;
  checkedZoneTrigger: boolean = false;
  eventLogAlert: [''];
  eventType: [''];
  eventLog: [''];
  eventLogZones: [''];
  eventLogDate: [''];
  selectEvent: [''];
  eventSelect: [''];
  eventLogEventType: any;
  sortBy = ['Date', 'Event Type', 'Zones'];
  selected: string = this.sortBy[0];
  choice = '';
  eventlogDataObject = new Array();
  eventlogLabel: any;
  zoneData: any;
  filter = '';
  filterData: any;
  selectSort: string = this.sortBy[0];
  dateErrMsg: string;
  today = new Date();
  count:any=[]
  loader:boolean=true;

  zoneshowhide: boolean;
  @ViewChild('mySelect') mySelect;
  selectedOption: string;
  noEventMsg: any;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public eventLogService: EventLogService,
    private toast: ToastrService
  ) {
    this.showHide = false;
    this.date = false;
    this.checked = false;
    this.checkeddate = false;
    this.checkedzone = false;
    this.zoneshowhide = false;
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.eventForm = this.fb.group({
      selectSort: this.sortBy[0],
      checkedEvent: [''],
      checked: [''],
      checkedzone: [''],
      checkeddate: [''],
      selectEvent: [''],
      selectZone: [''],
      startDate: [''],
      endDate: ['']
    });
    this.eventFormCtrl = this.eventForm.controls

    this.eventForm.controls['selectSort'].setValue(this.selected, {
      onlySelf: true
    });
    this.choice = this.selected;

    this.eventLogService.getEventLogType().subscribe((data: any) => {
      if (data.status === 'Success') {
        this.eventType = data.result;
      }
    });

    this.eventLogService.getEventLogZones().subscribe((data: any) => {
      if (data.status === 'Success') {
        this.eventLogZones = data.result;
      }
    });
    document.getElementById("capitalize").style.textTransform="lowercase";
    document.getElementById("capitalize").style.textTransform="capitalize";

  }

  getEventLogs() {
    console.clear()
    let postData:any={}

    if(this.choice)
    {
      postData.filterBy = this.choice
    }
    if(this.eventForm.value.selectZone != '' && this.eventForm.value.selectZone != null)
    {
      postData.ZoneName = this.eventForm.value.selectZone
    }
    if(this.eventForm.value.selectEvent != '' && this.eventForm.value.selectEvent != null)
    {
      postData.EventType = this.eventForm.value.selectEvent
    }

    let inputDate;
    if (this.eventForm.value.startDate != '')
    {
      inputDate = new Date(this.eventForm.value.startDate);
      postData.StartDate = inputDate.getMonth() + 1 + '/' + inputDate.getDate() + '/' + inputDate.getFullYear();
    }
    if (this.eventForm.value.endDate != '') {
      let inputDate = new Date(this.eventForm.value.endDate);
      postData.EndDate = inputDate.getMonth() + 1 + '/' + inputDate.getDate() + '/' + inputDate.getFullYear();
    }
    this.loader=true
    this.eventLogService.getEventLogs(postData).subscribe((data: any) => {
      if (data.status === true) {
        this.eventLog = data.result
        if(this.choice=='Date') //-Event count calculation in datewise view
        {
          console.log('getEventLogs', this.eventLog)
          let i=0
          for (let key in this.eventLog) {
            this.count[i]=['ALERT','FAULT','SETTING_CHANGE','SYSTEM_EVENT']
            if (this.eventLog.hasOwnProperty(key)) {
              let d:any = this.eventLog[key]
              for (let keyy in d)
              {
                let c=0;
                let zoneKey:any = d[keyy]
                for(let zone in zoneKey)
                {
                  c = c+zoneKey[zone].length
                }
                // console.log('cCount: ',key,' - ',keyy,' - ',c)
                // console.log('------------------------------')
                // this.count[i][keyy] = d[keyy].length
                this.count[i][keyy] = c
              }
            }
            i++
          }
        }
        this.loader=false
      }else{
        this.loader = false;
        this.noEventMsg = data.message;
      }
    });
  }

  onSubmit() {
    this.eventForm.markAsPristine();
    if(this.eventForm.value.checkeddate && (this.eventForm.value.startDate == '' || this.eventForm.value.endDate == '')) {
      this.toast.error('Date Range filter is required both From & To date', '', {
        timeOut: 3000
      });
      return;
    } else if (this.eventForm.value.checkeddate && (this.eventForm.value.startDate != '' || this.eventForm.value.endDate != '')) {
      if (this.eventForm.value.endDate.getTime() < this.eventForm.value.startDate.getTime()) {
        this.toast.error('From date should not be smaller than To date', '', {
          timeOut: 3000
        });
        return;
      }
    }
    this.getEventLogs()
  }

  datePicker(event: any) {
    if (event.checked === true) {
      this.date = true;
    } else {
      this.date = false;
    }
  }

  setValue(event) {
    if (event.isUserInput) {
      this.choice = event.source.value=="Event Type"?"Event":event.source.value=="Zones"?"Zone":event.source.value;
      this.getEventLogs()
    }
  }

  onChangeCheckbox(eve) {
    if (this.eventForm.value.checkedEvent == true) {
      this.checkedEventTrigger = true;
    } else {
      this.checkedEventTrigger = false;
      this.eventForm.get('selectEvent').setValue(['']);
    }

    if (this.eventForm.value.checkeddate == true) {
      this.checkedDateTrigger = true;
    } else {
      this.checkedDateTrigger = false;
      this.eventForm.get('startDate').setValue(['']);
      this.eventForm.get('endDate').setValue(['']);
    }

    if (this.eventForm.value.checkedzone == true) {
      this.checkedZoneTrigger = true;
    } else {
      this.checkedZoneTrigger = false;
      this.eventForm.get('selectZone').setValue(['']);
    }
  }
}
