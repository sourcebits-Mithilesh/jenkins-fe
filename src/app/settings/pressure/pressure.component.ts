import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { NotificationService } from '../../toastr-notification/toastr-notification.service';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { PressureService } from 'src/app/shared/pressure.service';
import { FlashserviceService } from 'src/app/shared/flashservice.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { inputrange } from 'src/config/inputrange';
import { requiredDigit}  from '../digit';
import { accessType } from '../access-type-check';
import { LanguageService } from 'src/app/share/language.service';

@Component({
  selector: 'nordson-pressure',
  templateUrl: './pressure.component.html',
  styleUrls: ['./pressure.component.css']
})
export class PressureComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  selectPressure: [''];
  ulPressureSetPoint: [''];
  airPressureStatus: [''];

  ulPressureMinSetPoint: [''];
  ulPressureMaxSetPoint: [''];
  ulHighPressureAlertThreshold: [''];
  ulLowPressureAlertThreshold: [''];
  pressureUnit: any;
  pressureForm: FormGroup;
  pressuredata = ['Manual Adjust', 'Electronic Pressure Adjust','Runup'];
  selected: string = this.pressuredata[0];
  choice = '';
  is_edit: boolean = false;
  accessType: any;
  errorMsg = 'invalid value';
  minPresssureValLimitmin: number;
  minPresssureValLimitmax: number;
  minPresssureValmax: number;
  maxPresssureValmax: number;
  lowPressureMin: number;
  lowPressureMax: number;
  highPressureMin: number;
  highPressureMax: number;
  pressureSetPointMin: number;
  pressureSetPointMax: number;
  maxPresssureValLimitmin: number;
  maxPresssureValLimitmax: number;

  minPresssureValRangemin: number;
  minPresssureValRangemax: number;
  maxPresssureValRangemin: number;
  maxPresssureValRangemax: number;
  selectPressureMode: FormGroup;
  maxlength : number = 5;
  load: boolean = false;
  inputPattern: string = '^[0-9]{1,5}$';
  ePressureScaling: number;
  
  ePressureScale;//for validation on keyup 
  valueLanguage: boolean = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private pressureService: PressureService,
    private flash: FlashserviceService,
    private _notificationservice: NotificationService,
    private userService: UserService,
    private toast: ToastrService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    });
    this.selectPressureMode = this.fb.group({
      selectPressure: ['']
    });

    this.pressureForm = this.fb.group({
      // selectPressure: [''],
      ulPressureSetPoint: [''],
      airPressureStatus: [''],
      // airPressureTemporaryStatus:[''],
      ulPressureMinSetPoint: [''],
      ulPressureMaxSetPoint: [''],
      ulHighPressureAlertThreshold: [''],
      ulLowPressureAlertThreshold: [''],
      ulLowPressureAlertDelta: [''],
      ulHighPressureAlertDelta: [''],
    });
    this.selectPressureMode.controls['selectPressure'].setValue(this.selected, {
      onlySelf: true
    });
    this.choice = this.selected;
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          this.load=true;

          this.authService.setNorId(data.result.nor_id);
          this.ePressureScaling = data.result.systemPreferences.ePressureScaling.Value

          if (data.result.systemPreferences.PressureUnits.Value === '1') {
            this.pressureUnit = 'kPa';
            if(this.ePressureScaling == 1){
              //Hydraulic
              this.maxlength = 5
            }else{
              this.maxlength = 3
            }
            // this.pressureForm.get('').setValidators(Validators.pattern('^[0-9]{1,5}$'));
          } else if (
            data.result.systemPreferences.PressureUnits.Value === '2'
          ) {
            this.pressureUnit = 'BAR';
            this.inputPattern = '^[0-9]{1}\.[0-9]{1,3}$';
            if(this.ePressureScaling == 1){
              //Hydraulic
              this.maxlength = 6
            }else{
              this.maxlength = 4
            }
            // this.pressureForm.get('').setValidators(Validators.pattern('^[0-9]{1}\.[0-9]{1,3}$'));
          } else {
            this.pressureUnit = 'PSI';
            if(this.ePressureScaling == 1){
              //Hydraulic
              this.maxlength = 5
            }else{
              this.maxlength = 3
            }
            // this.pressureForm.get('').setValidators(Validators.pattern('^[0-9]{1,5}$'));
          }


          if (this.pressureUnit == 'PSI') {
            this.minPresssureValLimitmin = 
              this.createValidationMess(inputrange.min_pressure_setpoint_limit_psi_min);
            this.minPresssureValLimitmax =
              this.createValidationMess(inputrange.min_pressure_setpoint_limit_psi_max);
            this.maxPresssureValLimitmin =
              this.createValidationMess(inputrange.max_pressure_setpoint_limit_psi_min);
            this.maxPresssureValLimitmax =
              this.createValidationMess(inputrange.max_pressure_setpoint_limit_psi_max);

            this.lowPressureMin =
              this.createValidationMess(inputrange.low_pressure_alert_threshold_psi_min);
            this.lowPressureMax =
              this.createValidationMess(inputrange.low_pressure_alert_threshold_psi_max);
            this.highPressureMin =
              this.createValidationMess(inputrange.heigh_pressure_alert_threshold_psi_min);
            this.highPressureMax =
              this.createValidationMess(inputrange.heigh_pressure_alert_threshold_psi_max);

            this.minPresssureValRangemin =
              this.createValidationMess(inputrange.min_pressure_setpoint_range_psi_min);
            this.minPresssureValRangemax =
              this.createValidationMess(inputrange.min_pressure_setpoint_range_psi_max);
            this.maxPresssureValRangemin =
              this.createValidationMess(inputrange.max_pressure_setpoint_range_psi_min);
            this.maxPresssureValRangemax =
              this.createValidationMess(inputrange.max_pressure_setpoint_range_psi_max);

            this.pressureSetPointMin = this.createValidationMess(inputrange.pressure_setpoint_psi_min);
            this.pressureSetPointMax = this.createValidationMess(inputrange.pressure_setpoint_psi_max);
          } else if (this.pressureUnit == 'BAR') {
            this.minPresssureValLimitmin =
              this.createValidationMess(inputrange.min_pressure_setpoint_limit_bar_min);
            this.minPresssureValLimitmax =
              this.createValidationMess(inputrange.min_pressure_setpoint_limit_bar_max);
            this.maxPresssureValLimitmin =
              this.createValidationMess(inputrange.max_pressure_setpoint_limit_bar_min);
            this.maxPresssureValLimitmax =
              this.createValidationMess(inputrange.max_pressure_setpoint_limit_bar_max);

            this.lowPressureMin =
              this.createValidationMess(inputrange.low_pressure_alert_threshold_bar_min);
            this.lowPressureMax =
              this.createValidationMess(inputrange.low_pressure_alert_threshold_bar_max);
            this.highPressureMin =
              this.createValidationMess(inputrange.heigh_pressure_alert_threshold_bar_min);
            this.highPressureMax =
              this.createValidationMess(inputrange.heigh_pressure_alert_threshold_bar_max);

            this.minPresssureValRangemin =
              this.createValidationMess(inputrange.min_pressure_setpoint_range_bar_min);
            this.minPresssureValRangemax =
              this.createValidationMess(inputrange.min_pressure_setpoint_range_bar_max);
            this.maxPresssureValRangemin =
              this.createValidationMess(inputrange.max_pressure_setpoint_range_bar_min);
            this.maxPresssureValRangemax =
              this.createValidationMess(inputrange.max_pressure_setpoint_range_bar_max);

            this.pressureSetPointMin = this.createValidationMess(inputrange.pressure_setpoint_bar_min);
            this.pressureSetPointMax = this.createValidationMess(inputrange.pressure_setpoint_bar_max);
          } else if (this.pressureUnit == 'kPa') {
            this.minPresssureValLimitmin =
              this.createValidationMess(inputrange.min_pressure_setpoint_limit_kpa_min);
            this.minPresssureValLimitmax =
              this.createValidationMess(inputrange.min_pressure_setpoint_limit_kpa_max);
            this.maxPresssureValLimitmin =
              this.createValidationMess(inputrange.max_pressure_setpoint_limit_kpa_min);
            this.maxPresssureValLimitmax =
              this.createValidationMess(inputrange.max_pressure_setpoint_limit_kpa_max);

            this.lowPressureMin =
              this.createValidationMess(inputrange.low_pressure_alert_threshold_kpa_min);
            this.lowPressureMax =
              this.createValidationMess(inputrange.low_pressure_alert_threshold_kpa_max);
            this.highPressureMin =
              this.createValidationMess(inputrange.heigh_pressure_alert_threshold_kpa_min);
            this.highPressureMax =
              this.createValidationMess(inputrange.heigh_pressure_alert_threshold_kpa_max);

            this.minPresssureValRangemin =
              this.createValidationMess(inputrange.min_pressure_setpoint_range_kpa_min);
            this.minPresssureValRangemax =
              this.createValidationMess(inputrange.min_pressure_setpoint_range_kpa_max);
            this.maxPresssureValRangemin =
              this.createValidationMess(inputrange.max_pressure_setpoint_range_kpa_min);
            this.maxPresssureValRangemax =
              this.createValidationMess(inputrange.max_pressure_setpoint_range_kpa_max);

            this.pressureSetPointMin = this.createValidationMess(inputrange.pressure_setpoint_kpa_min);
            this.pressureSetPointMax = this.createValidationMess(inputrange.pressure_setpoint_kpa_max);
          }

          const airPressureValue =
            data.result.pressureControll.bPressureAlarmEnable.Value == 0
              ? false
              : true;
          const airPressureStatus = airPressureValue;
          //for pressure runup
        //   const airPressureValueRunup=  data.result.pressureControll.PressureOffset.Value == 0
        //   ? false
        //   : true;
        //  const airPressureStatusRunup=airPressureValueRunup
          
          const ulPressureSetPoint =
            data.result.pressureControll.ulPressureSetPoint.Value / inputrange.pressure_setpoint_melter_calc;
          // const ulHighPressureAlertThreshold =
          //   data.result.pressureControll.ulHighPressureAlertThreshold.Value;
          // const ulLowPressureAlertThreshold =
          //   data.result.pressureControll.ulLowPressureAlertThreshold.Value;
          const ulHighPressureAlertThreshold =
            data.result.pressureControll.ulPressureMaxSetPoint.Value / inputrange.pressure_setpoint_melter_calc;
          const ulLowPressureAlertThreshold =
            data.result.pressureControll.ulPressureMinSetPoint.Value / inputrange.pressure_setpoint_melter_calc;

          const ulPressureMaxSetPoint =
            data.result.pressureControll.ulHighPressureAlertThreshold.Value / inputrange.pressure_setpoint_melter_calc;
          const ulPressureMinSetPoint =
            data.result.pressureControll.ulLowPressureAlertThreshold.Value / inputrange.pressure_setpoint_melter_calc;
          // const ulPressureMinSetPoint =
          //   data.result.pressureControll.ulPressureMinSetPoint.Value;
          // const ulPressureMaxSetPoint =
          //   data.result.pressureControll.ulPressureMaxSetPoint.Value;

          const ulLowPressureAlertDelta =
            data.result.pressureControll.ulLowPressureAlertDelta.Value / inputrange.pressure_setpoint_melter_calc;
          const ulHighPressureAlertDelta =
            data.result.pressureControll.ulHighPressureAlertDelta.Value / inputrange.pressure_setpoint_melter_calc;
          this.selectPressureMode = this.fb.group({
            selectPressure: this.selected
          });

          if (this.pressureUnit == 'BAR') {
            this.pressureForm = this.fb.group({
              // selectPressure: this.selected,
              ulPressureSetPoint: Math.round(ulPressureSetPoint*100)/100,
              airPressureStatus: airPressureStatus,
              ulPressureMinSetPoint: Math.round(ulPressureMinSetPoint*100)/100,
              ulPressureMaxSetPoint: Math.round(ulPressureMaxSetPoint*100)/100,
              ulHighPressureAlertThreshold: Math.round(ulHighPressureAlertThreshold*100)/100,
              ulLowPressureAlertThreshold: Math.round(ulLowPressureAlertThreshold*100)/100,
              // ulPressureMinSetPoint: ulLowPressureAlertThreshold,
              // ulPressureMaxSetPoint: ulHighPressureAlertThreshold,
              // ulHighPressureAlertThreshold: ulPressureMaxSetPoint,
              // ulLowPressureAlertThreshold: ulPressureMinSetPoint,
              // airPressureTemporaryStatus:airPressureStatusRunup,
              ulLowPressureAlertDelta: Math.round(ulLowPressureAlertDelta*100)/100,
              ulHighPressureAlertDelta: Math.round(ulHighPressureAlertDelta*100)/100
            });
          } else {
            this.pressureForm = this.fb.group({
              ulPressureSetPoint: Math.round(ulPressureSetPoint),
              airPressureStatus: airPressureStatus,
              // airPressureTemporaryStatus:airPressureStatusRunup,
              ulPressureMinSetPoint: Math.round(ulPressureMinSetPoint),
              ulPressureMaxSetPoint: Math.round(ulPressureMaxSetPoint),
              ulHighPressureAlertThreshold: Math.round(ulHighPressureAlertThreshold),
              ulLowPressureAlertThreshold: Math.round(ulLowPressureAlertThreshold),
              ulLowPressureAlertDelta: Math.round(ulLowPressureAlertDelta),
              ulHighPressureAlertDelta: Math.round(ulHighPressureAlertDelta)
            });
          }
        }
      },
      (err: Error) => {
        console.log('err', err);
      }
    );

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

  createValidationMess(setpoint){
    let pressureHydraulicCal = this.ePressureScaling == 1 ? inputrange.pressure_setpoint_hydraulic_calc : 1
    return this.ePressureScaling == 1 ? Math.round((setpoint * pressureHydraulicCal)*100)/100 : setpoint * pressureHydraulicCal;
  }

  get f() {
    return this.pressureForm.controls;
  }

  isDisabled(): boolean {
    return this.is_edit;
  }
  setValue(event) {
    if (event.isUserInput) {
      this.choice = event.source.value;
    }
  }
  tooglePressure(e) {
    if (e.checked === false) {
      this.pressureForm.get('airPressureStatus').patchValue(0);
    } else if (e.checked === true) {
      this.pressureForm.get(`airPressureStatus`).patchValue(1);
    }
  }

  // togglePressureTemperature(e){ 
  //   if (e.checked === false) {
  //     this.pressureForm.get('airPressureTemporaryStatus').patchValue(0);
  //   } else if (e.checked === true) {
  //     this.pressureForm.get('airPressureTemporaryStatus').patchValue(1);
  //   }
  // }


  checkStatus() {
    if (this.pressureForm.get('airPressureStatus').value == 0) {
      this.pressureForm.controls['ulLowPressureAlertDelta'].disable();
      this.pressureForm.controls['ulHighPressureAlertDelta'].disable();
      return 'blurred';
    } else {
      this.pressureForm.controls['ulLowPressureAlertDelta'].enable();
      this.pressureForm.controls['ulHighPressureAlertDelta'].enable();
      return 'unblurred';
    }
  }

  onSubmit() {
    let validationStatus = true;
    let focusField:string
    let dataFormat = {
      ulPressureMinSetPoint: parseFloat(this.pressureForm.get('ulPressureMinSetPoint').value),
      ulPressureMaxSetPoint: parseFloat(this.pressureForm.get('ulPressureMaxSetPoint').value),
      bPressureAlarmEnable: this.pressureForm.get('airPressureStatus').value,
      // PressureOffset:this.pressureForm.get('airPressureTemporaryStatus').value,
      ulPressureSetPoint: parseFloat(this.pressureForm.get('ulPressureSetPoint').value),
      ulLowPressureAlertThreshold: parseFloat(this.pressureForm.get('ulLowPressureAlertThreshold').value),
      ulHighPressureAlertThreshold: parseFloat(this.pressureForm.get('ulHighPressureAlertThreshold').value),
      ulHighPressureAlertDelta: parseFloat(this.pressureForm.get('ulHighPressureAlertDelta').value),
      ulLowPressureAlertDelta: parseFloat(this.pressureForm.get('ulLowPressureAlertDelta').value)
    };

    let saveDataFormat = {}

    if (this.choice === 'Electronic Pressure Adjust'||this.choice==="Runup") {
      //pressure Electric
      const expected_pressure_alert_difference = 
        this.pressureUnit=='BAR'?this.createValidationMess(inputrange.electronic_mode_pressure_alert_difference_bar):
        this.pressureUnit=='kPa'?this.createValidationMess(inputrange.electronic_mode_pressure_alert_difference_kpa):
        this.createValidationMess(inputrange.electronic_mode_pressure_alert_difference_psi)
      if (
          (dataFormat.ulPressureSetPoint < dataFormat.ulLowPressureAlertThreshold && 
            (dataFormat.ulLowPressureAlertThreshold >= this.minPresssureValRangemin && dataFormat.ulLowPressureAlertThreshold <= this.minPresssureValRangemax)) ||
          (dataFormat.ulPressureSetPoint > dataFormat.ulHighPressureAlertThreshold && 
            (dataFormat.ulHighPressureAlertThreshold >= this.maxPresssureValRangemin && dataFormat.ulHighPressureAlertThreshold <= this.maxPresssureValRangemax)) || 
          dataFormat.ulPressureSetPoint < this.pressureSetPointMin ||
          dataFormat.ulPressureSetPoint > this.pressureSetPointMax ||
          isNaN(dataFormat.ulPressureSetPoint)
        )
      {
        // let from = (dataFormat.ulLowPressureAlertThreshold<this.pressureSetPointMin) ? this.pressureSetPointMin : dataFormat.ulLowPressureAlertThreshold;
        let from = (dataFormat.ulLowPressureAlertThreshold>this.pressureSetPointMax) ? this.pressureSetPointMin : dataFormat.ulLowPressureAlertThreshold;
        let to = (dataFormat.ulHighPressureAlertThreshold<this.pressureSetPointMin)||
                 (dataFormat.ulHighPressureAlertThreshold>this.pressureSetPointMax)||
                 (dataFormat.ulHighPressureAlertThreshold<this.maxPresssureValRangemin) ? this.pressureSetPointMax : dataFormat.ulHighPressureAlertThreshold;
        to = (from>to) ? this.pressureSetPointMax : to
        from = isNaN(dataFormat.ulLowPressureAlertThreshold)?this.pressureSetPointMin:from
        from = from<this.pressureSetPointMin?this.pressureSetPointMin:from
        to = isNaN(dataFormat.ulHighPressureAlertThreshold)?this.pressureSetPointMax:to
        this.errorMsg = 'Pressure Set Point range should be '+from+' to '+to+' '+this.pressureUnit;
        if(from==to) 
          this.errorMsg = 'Pressure Set Point should be '+from+' '+this.pressureUnit;
        focusField = 'ulPressureSetPoint'
        if(dataFormat.ulHighPressureAlertThreshold < dataFormat.ulLowPressureAlertThreshold) {
          this.errorMsg = 'Minimum Pressure Setpoint Range should be less than Maximum Pressure Setpoint Range';
          focusField = 'ulLowPressureAlertThreshold'
        }
        validationStatus = false;
      }
      else if (
          dataFormat.ulLowPressureAlertThreshold < this.minPresssureValRangemin ||
          dataFormat.ulLowPressureAlertThreshold > this.minPresssureValRangemax ||
          dataFormat.ulLowPressureAlertThreshold > dataFormat.ulPressureSetPoint ||
          isNaN(dataFormat.ulLowPressureAlertThreshold)
      ) {
        let to = (this.minPresssureValRangemax>=dataFormat.ulPressureSetPoint) ? dataFormat.ulPressureSetPoint : this.minPresssureValRangemax
        this.errorMsg = 'Minimum Pressure Set Point Range should be '+this.minPresssureValRangemin+' to '+to+' '+this.pressureUnit;
        if(this.minPresssureValRangemin==dataFormat.ulPressureSetPoint) {
          this.errorMsg = 'Minimum Pressure Set Point Range should be '+dataFormat.ulPressureSetPoint+' '+this.pressureUnit
        }
        validationStatus = false;
        focusField = 'ulLowPressureAlertThreshold'
      }
      else if (
          dataFormat.ulHighPressureAlertThreshold < this.maxPresssureValRangemin ||
          dataFormat.ulHighPressureAlertThreshold > this.maxPresssureValRangemax ||
          dataFormat.ulHighPressureAlertThreshold < dataFormat.ulPressureSetPoint ||
          isNaN(dataFormat.ulHighPressureAlertThreshold)
      ) {
        let from = (this.maxPresssureValRangemin>=dataFormat.ulPressureSetPoint) ? this.maxPresssureValRangemin : dataFormat.ulPressureSetPoint
        this.errorMsg = 'Maximum Pressure Set Point Range should be '+from+' to '+this.maxPresssureValRangemax+' '+this.pressureUnit;
        if(this.maxPresssureValRangemax==dataFormat.ulPressureSetPoint) {
          this.errorMsg = 'Maximum Pressure Set Point Range should be '+dataFormat.ulPressureSetPoint+' '+this.pressureUnit
        }
        validationStatus = false;
        focusField = 'ulHighPressureAlertThreshold'
      }
      else if (
        !(dataFormat.ulLowPressureAlertThreshold <= dataFormat.ulHighPressureAlertThreshold)
      ) {
        this.errorMsg = 'Minimum Pressure Setpoint Range should be less than Maximum Pressure Setpoint Range';
        validationStatus = false;
        focusField = 'ulLowPressureAlertThreshold'
      }
      else if (
        !(
          Math.round((dataFormat.ulHighPressureAlertThreshold - dataFormat.ulLowPressureAlertThreshold)*100)/100>=expected_pressure_alert_difference
        )
      ) {
        this.errorMsg = 'Minimum & Maximum Pressure Setpoint Range difference should be minimum '+expected_pressure_alert_difference+' '+this.pressureUnit;
        validationStatus = false;
        focusField = 'ulLowPressureAlertThreshold'
      }
      else if (
        !(dataFormat.ulLowPressureAlertDelta >= this.lowPressureMin && dataFormat.ulLowPressureAlertDelta <= this.lowPressureMax)
      ) {
        this.errorMsg = 'Low Pressure Alert Threshold range should be ' +this.lowPressureMin+' to '+this.lowPressureMax+' '+this.pressureUnit;
        if (this.pressureForm.get('airPressureStatus').value == true) {
          validationStatus = false;
          focusField = 'ulLowPressureAlertDelta'
        } else {
          validationStatus = true;
        }
      }
      else if (
        !(dataFormat.ulHighPressureAlertDelta >= this.highPressureMin && dataFormat.ulHighPressureAlertDelta <= this.highPressureMax)
      ) {
        this.errorMsg = 'High Pressure Alert Threshold range should be '+this.highPressureMin+' to '+this.highPressureMax+' '+this.pressureUnit;
        if (this.pressureForm.get('airPressureStatus').value == true) {
          validationStatus = false;
          focusField = 'ulHighPressureAlertDelta'
        } else {
          validationStatus = true;
        }
      }
      // else if(!(dataFormat.ulHighPressureAlertDelta >dataFormat.ulLowPressureAlertDelta)){
      //   this.errorMsg = 'Low Pressure Alert Threshold Range should be less than High Pressure Alert Threshold Range';
      //   validationStatus = false;
      // }

      saveDataFormat =
        {
          'ulPressureSetPoint': dataFormat.ulPressureSetPoint,
          // 'ulLowPressureAlertThreshold': dataFormat.ulLowPressureAlertThreshold,
          // 'ulHighPressureAlertThreshold': dataFormat.ulHighPressureAlertThreshold,
          'bPressureAlarmEnable': this.pressureForm.get('airPressureStatus').value,
          //  'PressureOffset':this.pressureForm.get('airPressureTemporaryStatus').value,
          'ulPressureMaxSetPoint': dataFormat.ulHighPressureAlertThreshold,
          'ulPressureMinSetPoint': dataFormat.ulLowPressureAlertThreshold,
          'ulHighPressureAlertDelta': dataFormat.ulHighPressureAlertDelta,
          'ulLowPressureAlertDelta': dataFormat.ulLowPressureAlertDelta
        }
    } else {
      //pressure manual
      const expected_pressure_alert_difference = 
        this.pressureUnit=='BAR'?this.createValidationMess(inputrange.manual_mode_pressure_alert_difference_bar):
        this.pressureUnit=='kPa'?this.createValidationMess(inputrange.manual_mode_pressure_alert_difference_kpa):
        this.createValidationMess(inputrange.manual_mode_pressure_alert_difference_psi)
      const actual_pressure_alert_difference = Math.round((dataFormat.ulPressureMaxSetPoint - dataFormat.ulPressureMinSetPoint)*100)/100

      let stringVal = dataFormat.ulPressureMinSetPoint.toString(); 
      if (
        !(
          dataFormat.ulPressureMinSetPoint >= this.minPresssureValLimitmin &&
          dataFormat.ulPressureMinSetPoint <= this.minPresssureValLimitmax &&
          stringVal.length != 0
        )
      ) {
        this.errorMsg =
          'Minimum Pressure Alert  should be ' +
          this.minPresssureValLimitmin +
          ' to ' +
          this.minPresssureValLimitmax+' '+this.pressureUnit;
        validationStatus = false;
        focusField = 'ulPressureMinSetPoint'
      } else if (
        !(
          dataFormat.ulPressureMaxSetPoint >= this.maxPresssureValLimitmin &&
          dataFormat.ulPressureMaxSetPoint <= this.maxPresssureValLimitmax
        )
      ) {
        this.errorMsg =
          'Maximum Pressure Alert should be ' +
          this.maxPresssureValLimitmin +
          ' to ' +
          this.maxPresssureValLimitmax+' '+this.pressureUnit;
        validationStatus = false;
        focusField = 'ulPressureMaxSetPoint'
      } else if (
        !(
          dataFormat.ulPressureMinSetPoint <
          dataFormat.ulPressureMaxSetPoint
        )
      ) {
        this.errorMsg =
          'Minimum pressure alert should be less than maximum pressure alert';
        validationStatus = false;
        focusField = 'ulPressureMinSetPoint'
      } else if (
        !(actual_pressure_alert_difference >= expected_pressure_alert_difference)
      ) {
        this.errorMsg =
          'Pressure alert range should have minimum difference of '+expected_pressure_alert_difference+' '+this.pressureUnit;
        validationStatus = false;
        focusField = 'ulPressureMinSetPoint'
      }

      saveDataFormat =
        {
          // 'ulPressureMaxSetPoint': dataFormat.ulPressureMaxSetPoint,
          // 'ulPressureMinSetPoint': dataFormat.ulPressureMinSetPoint,
          'ulLowPressureAlertThreshold': dataFormat.ulPressureMinSetPoint,
          'ulHighPressureAlertThreshold': dataFormat.ulPressureMaxSetPoint,
          'bPressureAlarmEnable': this.pressureForm.get('airPressureStatus').value,
          //  'PressureOffset':this.pressureForm.get('airPressureTemporaryStatus').value

        }
    }
    const valid = this.pressureForm.valid;
    if (valid === false || validationStatus == false) {
      this.toast.error(this.errorMsg, '', {
        timeOut: 3000
      });
      const ele = this.aForm.nativeElement[focusField];
      if (ele) {
        ele.focus();
      }
    } else {
      this.pressureForm.markAsPristine();
      this.pressureService.updatePressure(saveDataFormat).subscribe((data: any) => {
        if (data.status === 'success') {
          this.toast.success('Pressure updated successfully', '', {
            timeOut: 3000
          });
        }
      });
    }
  }
  preventalpha(evt) {
    if (this.pressureUnit != 'BAR') {
    
    if(this.pressureUnit != 'BAR'){
      return this.authService.preventalpha(event);
    } else {
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    }
  }
}
      // this.pressureForm.controls[event.target.name].patchValue(input.value.replace())   
 
      onKeyUp(event){
        //sv
        let input=this.pressureForm.controls[event.target.name]
        let s=6
        let regvalid=new RegExp(`/^\d{1,${s}}(\.\d{1,2})?$/g`).test(input.value)
        // let regvalid ={BAR: /^\d{1,6}(\.\d{1,2})?$/g.test(input.value) ,kPa:/^\d{1,}(\.\d{1,2})?$/g.test(input.value),PSI:/^\d{1,}(\.\d{1,2})?$/g.test(input.value) }
        let val=input.value;
        let singleDigit=()=>{val=val.substring(0,requiredDigit.singleDigit(val)); return input.patchValue(val);}
        let doubleDigit=()=>{val=val.substring(0,requiredDigit.doubleDigit(val)); return input.patchValue(val);}
        let tripleDigit=()=>{val=val.substring(0,requiredDigit.tripleDigit(val));return input.patchValue(val);}
        let fourDigit=()=>{val=val.substring(0,requiredDigit.fourDigit(val));return input.patchValue(val); }   
        let fiveDigit=()=>{val=val.substring(0,requiredDigit.fiveDigit(val));return input.patchValue(val); }                  
  
        input.patchValue(val)  
        if (!regvalid){
          val = val.replace(/[^.\d]/g, '')
          .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
          //strip out commas 
          // val = val.replace(/,/g, "");
          //strip out all non-numeric characters (leaving decimal)  
          let totalLength = val.length;
          let only2DecimalsCount = val.indexOf(".");
         
           if (only2DecimalsCount >= 0 && totalLength > (only2DecimalsCount + 2)) {
            val = val.substring(0, (only2DecimalsCount + 3));
            input.patchValue(val);
           }
  
                  if (this.pressureUnit === "PSI") {
                    if (this.choice === 'Manual Adjust') {
                      //pnemuanic
                          if(this.ePressureScaling == 0){
                               if(event.target.name == "ulPressureMaxSetPoint" )tripleDigit();else doubleDigit();
                            };
                          //hydraulic
                          if(this.ePressureScaling == 1){
                            fourDigit();
                          };

                    } else if (this.choice === 'Electronic Pressure Adjust'||this.choice==='Runup') {
                      //pnemuanic
  
                      //pressure setpoint
                      if (this.ePressureScaling == 0 ) {
                          if(event.target.name =="ulHighPressureAlertThreshold")tripleDigit();else doubleDigit();
                          
                      }
                      //hydraulic
                      if(this.ePressureScaling == 1){
                        fourDigit()
                      }
                    }
                  } else if (this.pressureUnit === "BAR") {
                    //manual
                    if (this.choice === 'Manual Adjust') {
                      this.ePressureScaling == 0 ? singleDigit() : (event.target.name == "ulPressureMaxSetPoint" ? tripleDigit() : doubleDigit())
                    }
                    //transuder
                    else if (this.choice === 'Electronic Pressure Adjust'||this.choice==='Runup') {
                      //pressure  setpoint
                      if (event.target.name == "ulPressureSetPoint") {
                        return this.ePressureScaling == 0 ? singleDigit() : tripleDigit()
                        }
                         if(this.ePressureScaling == 0){
                          singleDigit()
                         } 

                        if(this.ePressureScaling == 1&&event.target.name=="ulHighPressureAlertThreshold"){
                            tripleDigit();
                        }else{
                          doubleDigit()
                        }
                    }
  
                  } else if (this.pressureUnit === "kPa") {
                    //manual
                    if (this.choice === 'Manual Adjust') {
                      this.ePressureScaling == 0 ? tripleDigit() : fiveDigit();
                       if(this.ePressureScaling==1&&event.target.name=='ulPressureMinSetPoint')fourDigit();
                      //electronic
                    } else if (this.choice === 'Electronic Pressure Adjust'||this.choice==='Runup') {
                      if (event.target.name == "ulPressureSetPoint") {
                        return this.ePressureScaling == 0 ? tripleDigit() : fiveDigit()
                      }
                      if(this.ePressureScaling == 0 )tripleDigit ;

                       if(this.ePressureScaling == 1){
                            if(event.target.name == "ulHighPressureAlertThreshold" ) fiveDigit();else fourDigit();
                       }
                    }
  
                  }
  
  
                }
                 
  
            }



   
    }