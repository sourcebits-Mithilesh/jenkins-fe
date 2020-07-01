import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from 'src/app/settings/access-type-check';

@Component({
  selector: 'nordson-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  preferences: FormGroup;
  timeZoneList = [
    { id: 0, name: 'United States' },
    { id: 1, name: 'Australia' },
    { id: 2, name: 'Bahamas' },
    { id: 3, name: 'Bermuda' },
    { id: 4, name: 'Brazil' },
    { id: 5, name: 'Canada' },
    { id: 6, name: 'Chile' },
    { id: 8, name: 'EU Countries' },
    { id: 9, name: 'Gaza Strip' },
    { id: 10, name: 'Greenland' },
    { id: 11, name: 'Fiji' },
    { id: 12, name: 'Haiti' },
    { id: 13, name: 'India' },
    { id: 14, name: 'Israel' },
    { id: 15, name: 'Jordan' },
    { id: 16, name: 'Lebanon' },
    { id: 17, name: 'Mexico' },
    { id: 18, name: 'Mexico-USA border' },
    { id: 19, name: 'New Zealand' },
    { id: 20, name: 'Paraguay' },
    { id: 21, name: 'Samoa' },
    { id: 22, name: 'Turks and Caicos' },
    { id: 23, name: 'Ukraine' },
    { id: 24, name: 'United Kingdom' },
    { id: 25, name: 'West Bank' }
  ];
  eLanguage = [
    { id: 1, name: 'English' },
    { id: 2, name: 'German' },
    { id: 3, name: 'Spanish' },
    { id: 4, name: 'French' },
    { id: 5, name: 'Italian' },
    { id: 6, name: 'Chinese' },
    { id: 7, name: 'Japanese' },
    { id: 8, name: 'Dutch' },
    { id: 9, name: 'Portuguese' }
  ];
  ePressureScaling = [
    { id: 0, name: 'Pneumatic' },
    { id: 1, name: 'Hydraulic' }
  ];
  eDateFmtRange = [
    { id: 2, name: 'yyyy/MM/dd', value: 'YYYY/MM/DD' },
    { id: 1, name: 'dd/MM/yyyy', value: 'DD/MM/YYYY' },
    { id: 0, name: 'MM/dd/yyyy', value: 'MM/DD/YYYY' }
  ];
  setclock;
  timeZone;
  accessType: any;
  load: boolean = false;
  hours: any = [];
  minutes: any = [];
  anteMeridianFormats: any = [{ value: 'AM' }, { value: 'PM' }];
  checkTimeForm: boolean;
  remoteRecipe:boolean = false 
  eDateFmtPrevious;
  eDatePrevious;
  prefData:any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private setupService: SetupToolsService,
    private toast: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.preferences = this.fb.group({
      TempUnits: [''],
      PressureUnits: [''],
      eLanguage: [''],
      eMassFormat: [''],
      ePressureScaling: [''],
      eDateFmt: [''],
      eTimeFmt: [''],
      TimeZone: [''],
      UNP_name: [''],
      RecipeEnable: [''],
      RemoteRecipeManagement: [''],
      setdate: [''],
      timezone: [''],
      setHours: [''],
      setMinutes: [''],
      antemeredianFormat: [''],
      blSchedulerEnable: [''],
      ulFullScaleLineSpeed:[''],
      eLineSpeedSource:[''],
      blShiftEnable:[''],
      blJobsEnable:[''],
      blJobsAutoStart:[''],
      MaintenanceEnable:[''],
      LinespeedUnits:['']
    });

    // this.hours =
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.authService.setNorId(data.result.nor_id);
          const systemPreferences = data.result.systemPreferences;
          this.prefData=systemPreferences;
          const TempUnits = systemPreferences.hasOwnProperty('TempUnits') === true ?systemPreferences.TempUnits.Value:'1';
          const PressureUnits = systemPreferences.hasOwnProperty('PressureUnits') === true ?systemPreferences.PressureUnits.Value:'2';
          const eLanguageValue = systemPreferences.hasOwnProperty('eLanguage') === true ?systemPreferences.eLanguage.Value:'1';
          const ePressureValue =  systemPreferences.hasOwnProperty('ePressureScaling') === true ?systemPreferences.ePressureScaling.Value:'1';
          const eMassFormat =  systemPreferences.hasOwnProperty('eMassFormat') === true ?systemPreferences.eMassFormat.Value:'1';
          const blSchedulerEnable =systemPreferences.hasOwnProperty('blSchedulerEnable') === true ?systemPreferences.blSchedulerEnable.Value:'0';
          let eDateFmt= systemPreferences.eDateFmt.Value;
          // eDateFmt = (eDateFmt === undefined) ? '2' : eDateFmt;

          const eTimeFmt = systemPreferences.eTimeFmt.Value;
          this.setHours(eTimeFmt);
          const TimeZoneValue = systemPreferences.hasOwnProperty('TimeZone') === true ? systemPreferences.TimeZone.Value : '0';
          const UNP_name = (systemPreferences.UNP_name != undefined) ? systemPreferences.UNP_name.Value : '';
          const RecipeEnable = systemPreferences.RecipeEnable.Value;
          const RemoteRecipeManagement =
            systemPreferences.RemoteRecipeManagement.Value;
          let ClockHour =
            systemPreferences.ClockHour != undefined
              ? systemPreferences.ClockHour.Value
              : '';
          let ClockMinutes =
            systemPreferences.ClockMinutes != undefined
              ? systemPreferences.ClockMinutes.Value
              : '';
          const ClockSeconds =
            systemPreferences.ClockSeconds != undefined
              ? systemPreferences.ClockSeconds.Value
              : '';

          let toDay = new Date();
          const DateYear =
            systemPreferences.DateYear != undefined && parseInt(systemPreferences.DateYear.Value) > 0
              ? systemPreferences.DateYear.Value
              : toDay.getFullYear().toString();
          let DateMonth =
            systemPreferences.DateMonth != undefined && parseInt(systemPreferences.DateMonth.Value) > 0
              ? systemPreferences.DateMonth.Value
              : (toDay.getMonth()+1).toString();
          let DateDay =
            systemPreferences.DateDay != undefined && parseInt(systemPreferences.DateDay.Value) > 0
              ? systemPreferences.DateDay.Value
              : toDay.getDate().toString();
          if (DateMonth.length == 1) {
            DateMonth = `0${DateMonth}`;
          }
          if (DateDay.length == 1) {
            DateDay = `0${DateDay}`;
          }
          this.timeZone = `${ClockHour}:${ClockMinutes}`;
          this.setclock = `${DateYear}/${DateMonth}/${DateDay}`;

          let toSelect1 = this.eDateFmtRange.find(c => c.id == eDateFmt);
          // let toSelect2 = toSelect1 === undefined ? 2 : toSelect1;
          if(toSelect1 == undefined){
            toSelect1 = this.eDateFmtRange.find(c => c.id == 2);
          }

          let TimeZone = this.timeZoneList.find(t => t.id == TimeZoneValue);
          if(TimeZone == undefined){
            TimeZone = this.timeZoneList.find(t => t.id == 0);
          }
          //TimeZone = TimeZone === undefined ? null : TimeZone;

          let eLanguage = this.eLanguage.find(l => l.id == eLanguageValue);
          eLanguage = eLanguage === undefined ? null : eLanguage;

          let ePressureScaling = this.ePressureScaling.find(
            l => l.id == ePressureValue
          );
          ePressureScaling =
            ePressureScaling === undefined ? null : ePressureScaling;

          let selectAntemaridian: any = 'AM';
          if (eTimeFmt == 0) {
            let data = this.transform0(this.timeZone);
            ClockHour = data.split(':')[0];
            // ClockMinutes = data.split(':')[0]
            selectAntemaridian = this.anteMeridianFormats.find(
              c => c.value == data.split(':')[2]
            );
            selectAntemaridian = selectAntemaridian.value;
            console.log('format', data.split(':')[2]);
            console.log('selectAntemaridian', selectAntemaridian);
          }

          let j: any;
          for (j = 0; j < 60; j++) {
            let val: any = j;
            if (val.toString().length == 1) {
              val = '0' + val;
            }
            this.minutes.push({ value: val });
          }

          this.checkTimeForm = eTimeFmt == 0 ? false : true;
          let selectMinute = this.minutes.find(c => c.value == ClockMinutes);
          selectMinute = selectMinute === undefined ? '01' : selectMinute.value;
          let selectHours = this.hours.find(c => c.value == ClockHour);
          selectHours = (selectHours === undefined) ? '01' : selectHours.value;
          if(RecipeEnable == '0'){
            this.remoteRecipe = false;
          }else{
            this.remoteRecipe = true;
          }
          this.preferences.patchValue({
            // new tag start
            LinespeedUnits:this.validateKey('LinespeedUnits'),
            eLineSpeedSource:this.validateKey('eLineSpeedSource'),
            blShiftEnable:this.validateKey('blShiftEnable')==0?false:true,
            blJobsEnable:this.validateKey('blJobsEnable')==0?false:true,
            blJobsAutoStart:this.validateKey('blJobsAutoStart')==0?false:true,
            MaintenanceEnable:this.validateKey('MaintenanceEnable')==0?false:true,
            TempUnits,
            PressureUnits,
            eLanguage: eLanguage,
            ePressureScaling: ePressureScaling,
            eMassFormat,
            eDateFmt: toSelect1,
            eTimeFmt: eTimeFmt,
            TimeZone: TimeZone,
            UNP_name,
            RecipeEnable: RecipeEnable === '0' ? false : true,
            RemoteRecipeManagement:
            RemoteRecipeManagement === '0' ? false : true,
            setdate: this.setclock,
            timezone: this.timeZone,
            setHours: selectHours,
            blSchedulerEnable: blSchedulerEnable === '0' ? false : true,
            setMinutes: selectMinute,
            antemeredianFormat: selectAntemaridian
            // selectSetdate:"option1"
          });
          this.eDateFmtPrevious = toSelect1.name
          this.eDatePrevious = this.setDate(true)
          this.dateFormatChange();
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );

    let userData = this.userService.setProfile()
    if(userData) {
      this.load = true
      this.accessType = accessType.check(userData.data);
    }
  }

  // validate if key exits @Gaurav
  validateKey(key){
    return this.prefData.hasOwnProperty(key)?this.prefData[key].Value:'0'
  }

  get f() {
    return this.preferences.controls;
  }

  onSubmit() {
    let dateTimeValidation = true;
    const formVal = this.preferences.getRawValue();
    console.log(this.preferences.get('MaintenanceEnable').value)
    let setdate = this.preferences.value.setdate;
    let dateSeparation: any;
    if (formVal.eDateFmt.id == 1) { 
      //dd/MM/yyyy
      let splitFormat = setdate.split('/');
      let format = new Date(
        splitFormat[1] + '/' + splitFormat[0] + '/' + splitFormat[2]
      );
      dateSeparation =
        format.getFullYear() +
        '/' +
        (format.getMonth() + 1) +
        '/' +
        format.getDate();
    } else if (formVal.eDateFmt.id == 0) {
      //MM/DD/YYYY
      let splitFormat = setdate.split('/');
      let format = new Date(
        splitFormat[0] + '/' + splitFormat[1] + '/' + splitFormat[2]
      );
      dateSeparation =
        format.getFullYear() +
        '/' +
        (format.getMonth() + 1) +
        '/' +
        format.getDate();
    } else {
      dateSeparation = setdate;
    }

    dateTimeValidation = this.dateFormatChange()

    const getDate = dateSeparation.split('/');
    let getHour: any;
    let getMinute: any;
    if (this.preferences.get('eTimeFmt').value == 0) {
      let getTime = `${this.preferences.value.setHours}:${
        this.preferences.value.setMinutes
        } ${this.preferences.value.antemeredianFormat}`;
      let data = this.transform1(getTime);
      getHour = data.split(':')[0];
      getMinute = data.split(':')[1];
    } else {
      getHour = this.preferences.value.setHours;
      getMinute = this.preferences.value.setMinutes;
    }

    const formData = {
      UNP_name: this.preferences.get('UNP_name').value,
      PressureUnits: this.preferences.get('PressureUnits').value,
      RecipeEnable:
        this.preferences.get('RecipeEnable').value === false ? '0' : '1',
      RemoteRecipeManagement:
        this.preferences.get('RemoteRecipeManagement').value === false
          ? '0'
          : '1',
      blSchedulerEnable:
        this.preferences.get('blSchedulerEnable').value === false
          ? '0'
          : '1',
      TempUnits: this.preferences.get('TempUnits').value,
      TimeZone: this.preferences.value.TimeZone.id,
      eDateFmt: formVal.eDateFmt.id,
      eLanguage: this.preferences.value.eLanguage.id,
      ePressureScaling: this.preferences.value.ePressureScaling.id,
      eMassFormat: this.preferences.get('eMassFormat').value,
      eTimeFmt: this.preferences.get('eTimeFmt').value,
      DateYear: getDate[0],
      DateMonth: getDate[1],
      DateDay: getDate[2],
      ClockHour: getHour,
      ClockMinutes: getMinute,
      LinespeedUnits:formVal.LinespeedUnits,
      eLineSpeedSource:formVal.eLineSpeedSource,
      blShiftEnable:this.preferences.get('blShiftEnable').value? 1 : 0,
      blJobsEnable:this.preferences.get('blJobsEnable').value? 1 : 0,
      blJobsAutoStart:this.preferences.get('blJobsAutoStart').value? 1 : 0,
      MaintenanceEnable:this.preferences.get('MaintenanceEnable').value? 1 : 0,
    };

    if (dateTimeValidation == true) {
      this.preferences.markAsPristine();
      this.setupService.updatePreference(formData).subscribe(
        (data: any) => {
          if (data.status === 'success') {
            this.toast.success('Preferences updated successfully', '', {
              timeOut: 3000
            });
          }
        },
        err => {
          console.log('err', err);
        }
      );
    }
  }

  doubleValidation = true
  setDate(initial=false) {
    let eDateFmtPrevious = this.eDateFmtPrevious=='MM/dd/yyyy' ? 0 : this.eDateFmtPrevious=='dd/MM/yyyy' ? 1 : 2
    
    if(initial===true)
    {
      let splitDate = this.setclock.split('/') //-yyyy/MM/dd

      if(eDateFmtPrevious === 0)
        return splitDate[1]+'/'+splitDate[2]+'/'+splitDate[0] //-MM/dd/yyyy
      else if(eDateFmtPrevious === 1) 
        return splitDate[2]+'/'+splitDate[1]+'/'+splitDate[0] //-dd/MM/yyyy
      else 
        return this.setclock //-yyyy/MM/dd
    }

    let splitDate = this.eDatePrevious.split('/')
    let dateToConvert = { date:'', month:'', year:''}

    if(eDateFmtPrevious === 0) {
      dateToConvert.date = splitDate[1]
      dateToConvert.month = splitDate[0]
      dateToConvert.year = splitDate[2]
    }
    else if(eDateFmtPrevious === 1) {
      dateToConvert.date = splitDate[0]
      dateToConvert.month = splitDate[1]
      dateToConvert.year = splitDate[2]
    }
    else {
      dateToConvert.date = splitDate[2]
      dateToConvert.month = splitDate[1]
      dateToConvert.year = splitDate[0]
    }

    let d = new Date(parseInt(dateToConvert.year), parseInt(dateToConvert.month) - 1, parseInt(dateToConvert.date));
    if(
      d.getFullYear() != parseInt(dateToConvert.year) || 
      d.getMonth() != parseInt(dateToConvert.month)-1 || 
      d.getDate() != parseInt(dateToConvert.date) || 
      (parseInt(dateToConvert.year)<1900||(parseInt(dateToConvert.year)>new Date().getFullYear()+10))
    )
    {
      this.eDateFmtPrevious = this.preferences.value.eDateFmt.name
      if(this.doubleValidation)
      {
        this.doubleValidation = false
        this.setDate()
        return true
      }

      this.toast.error('Please enter valid Date', '', {
        timeOut: 3000
      });

      this.doubleValidation = true
      return true
    }

    this.eDateFmtPrevious = this.preferences.value.eDateFmt.name
    this.doubleValidation = true

    if(this.preferences.value.eDateFmt.name === 'MM/dd/yyyy') {
      return dateToConvert.month+'/'+dateToConvert.date+'/'+dateToConvert.year
    }
    else if(this.preferences.value.eDateFmt.name === 'dd/MM/yyyy') {
      return dateToConvert.date+'/'+dateToConvert.month+'/'+dateToConvert.year
    }
    else {
      return dateToConvert.year+'/'+dateToConvert.month+'/'+dateToConvert.date
    }
  }
  dateFormatChange() {
    let formatedDate = this.setDate()
    if(!(formatedDate===true))
    {
      this.eDatePrevious = formatedDate
      this.preferences.controls['setdate'].setValue(formatedDate);
      return true
    }
    return false
  }
  pad2(number) {
    return (number < 10 ? '0' : '') + number;
  }
  setHoursClkFormat() {
    let formatType = this.preferences.value.eTimeFmt;
    this.checkTimeForm = formatType == 0 ? false : true;
    this.setHours(formatType);

    let setTime;
    if (formatType == 0) {
      let getTime = `${this.preferences.value.setHours}:${
        this.preferences.value.setMinutes
        }`;
      let data = this.transform0(getTime);
      let valHr = data.split(':')[0];
      let valMin = data.split(':')[1];
      let valAnti = data.split(':')[2];

      this.preferences.controls['setHours'].setValue(valHr.toString());
      this.preferences.controls['antemeredianFormat'].setValue(valAnti);
    } else {
      let getTime = `${this.preferences.value.setHours}:${
        this.preferences.value.setMinutes
        } ${this.preferences.value.antemeredianFormat}`;
      let data = this.transform1(getTime);
      let valHr = data.split(':')[0];
      let valMin = data.split(':')[1];
      this.preferences.controls['setHours'].setValue(valHr.toString());
    }
  }

  //12 hour format conversion
  transform0(time: any): any {
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    let part = hour >= 12 ? 'PM' : 'AM';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = (part=='AM'&&hour=='00')?'12':hour
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min}:${part}`;
  }
  //24 hour format conversion
  transform1(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == 'PM' && hours < 12) hours = hours + 12;
    if (AMPM == 'PM' && hours == 12) hours = 12;
    if (AMPM == 'AM' && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = '0' + sHours;
    if (minutes < 10) sMinutes = '0' + sMinutes;
    return sHours + ':' + sMinutes;
  }
  preventCharacter(event) {
    var regex = new RegExp('^[a-zA-Z]+$');
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  getMostUpdated(event) {
    this.eDatePrevious = event.target.value
  }
  setHours(format) {
    let setHour: number;
    this.hours = [];
    if (format == 0) {
      setHour = 13;
    } else {
      setHour = 24;
    }
    let i: any;
    for (i = 0; i < setHour; i++) {
      if(format==0 && i==0) {
        continue;
      }
      let val: any = i;
      if (val.toString().length == 1) {
        val = '0' + val;
      }
      this.hours.push({ value: val.toString() });
    }
  }
  preventalpha(event) {
    return this.authService.preventalpha(event);
  }
  recipeEnableChange(){
    //remoteRecipe
    let RecipeEnable = this.preferences.value.RecipeEnable;
    if(RecipeEnable == '0'){
      this.remoteRecipe = false;
    }else{
      this.remoteRecipe = true;
    }
  }
}
