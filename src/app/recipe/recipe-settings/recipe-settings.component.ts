import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RecipeService } from '../recipe.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { FlashserviceService } from 'src/app/shared/flashservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { inputrange } from 'src/config/inputrange';
import { AuthService } from 'src/app/auth.service';
import { requiredDigit } from 'src/app/settings/digit';
import { accessType } from 'src/app/settings/access-type-check';

@Component({
  selector: 'nordson-recipe-settings',
  templateUrl: './recipe-settings.component.html',
  styleUrls: ['./recipe-settings.component.css']
})
export class RecipeSettingsComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  tempData = [];
  pressureData: any;
  recipeSettingForm: FormGroup;
  selectPressureMode:FormGroup;
  pageType: string;
  tempUnit: string;
  pressureUnit: string;
  accessType: any;
  tempUnitNum: number;
  pressureUnitNum: number;
  airPressureTemporaryStatus;
  minPresssureValRangemin: number;
  minPresssureValRangemax: number;
  maxPresssureValRangemin: number;
  maxPresssureValRangemax: number;
  fileName: string;
  errorMsg: string;
  updateStatus: boolean = false;
  recipeSettingUnitForm: FormGroup;
  units: any;
  isAlertEnable: boolean;
  isManualEnable: boolean;
  isLowPressure: any;
  isHighPressure: any;
  isManualPressure: any;
  disableZone = [];
  lowPressureThresholdMin: number;
  lowPressureThresholdMax: number;
  highPressureThresholdMin: number;
  highPressureThresholdMax: number;
  pressureHydraulicCal: number;
  changedScaling: any;
  changedUnit: any;
  ulPressureSetPoint: number;
  ePressureScaling:number;
  tankManifold: any = [
    { 'tank': '' },
    { 'manifold': '' }]
  minPresssureValLimitmin: number;
  minPresssureValLimitmax: number;
  maxPresssureValLimitmin: number;
  maxPresssureValLimitmax: number;
  pressureSetPointMin: number;
  pressureSetPointMax: number;
  lineSpeedUnit;
  pressuredata = ['Manual Adjust', 'Electronic Pressure Adjust','Runup'];
 
  lineSpUnt;
  selected: string = this.pressuredata[0];
  choice = '';
  outputSetting;
  errExist=false;
  valueZone=11;
  valueTmpZone=22;
  constructor(
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private flash: FlashserviceService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private toast: ToastrService,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.pageType = params['page'];
    });
  }

  ngOnInit() {
    this.choice = this.selected;

    

    this.recipeSettingForm = this.fb.group({
      ulPressureSetPoint: [''],
      isPressureAlert: [''],
      lowPressureThreshold: [''],
      highPressureThreshold: [''],
      minPressureSetpoint: [''],
      maxPressureSetpoint: [''],
      isManualPressureAlert: [''],
      LowPressureAlertDelta: [''],
      HighPressureAlertDelta: [''],
      airPressureTemporaryStatus:[],
      lowSpeedPresSett:[],
      lowLineSpeedSett:[],
      highSpeedPresSett:[],
      highLineSpeedSett:[],
      maxPressureLimit:[],
      minPressureLimit:[],
      zeroLineSpeedPress:[''],
    });
    this.selectPressureMode = this.fb.group({
      selectPressure: ['']
    });

    this.selectPressureMode.controls['selectPressure'].setValue(this.selected, {
      onlySelf: true
    });
    this.recipeSettingUnitForm = this.fb.group({
      TempUnits: [''],
      PressureUnits: [''],
      ePressureScaling: [''],
      ATSTargetAddon:[''],    
      lineSpeedUnits:[''] 
    })
    if (this.pageType == 'update') {
      this.fileName = this.recipeService.getOpenRecipe();
      if (this.fileName != '') {
        this.getRecipeFileData();
      }
    } else {
      this.updateStatus = true;
      this.initialiseFields();
    }

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

  initialiseFields() {
    this.recipeService.getDefaultData().subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          this.setFiledData(data);
        }
      },
      (err: Error) => {
        console.log('err', err);
      }
    );
  }

  getRecipeFileData() {
    this.recipeService.getOpenRecipeData(this.fileName).subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          this.setFiledData(data);
        }
      },
      (err: Error) => {
        console.log('err', err);
      }
    );
  }

  setFiledData(data) {
    let tempZone = data.result.tempZoneControll;
    let allObjects = Object.assign(
      tempZone.zoneControll,
      tempZone.tempControll
    );
    this.setUnits(data.result.selectedUnits);
     this.valueTmpZone=data.result.tempZoneControll.tempControll.SetpointTempZone21?22:18
     this.valueZone=data.result.tempZoneControll.tempControll.SetpointTempZone21?11:9

    let i: any;
    let j: number = 1;
    for (i = 0; i < this.valueTmpZone; i++) {
      let zoneNum = parseInt(i);
      let zone = allObjects['ZoneControl' + zoneNum]?allObjects['ZoneControl' + zoneNum].Value:'';
      let setpoint = allObjects['SetpointTempZone' + zoneNum]?allObjects['SetpointTempZone' + zoneNum].Value:'';
      let name: string
      if (i == 0) {
        this.tankManifold.tank = allObjects['SetpointTempZone' + zoneNum].Value;
        name = 'Tank';
      }
      if (i == 1) {
        this.tankManifold.manifold = allObjects['SetpointTempZone' + zoneNum].Value;
        name = 'Manifold'
      }
      if (i <=this.valueZone  && i > 1) {
        name = 'Hose' + (parseInt(i) - 1);
      } else if (i > 1) {
        name = 'Applicator' + j;
        j++;
      }

      this.disableZone.push({
        zone: Boolean(JSON.parse(zone)),
        name: name
      })
      this.tempData.push({
        zone: Boolean(JSON.parse(zone)),
        setpoint: setpoint,
        name: name,
        index: parseInt(i) + 1
      });
    }
    
    this.recipeSettingUnitForm.get("ATSTargetAddon").patchValue(data.result.flow.ATSTargetAddon?data.result.flow.ATSTargetAddon.Value:'')
    this.pressureData = data.result.pressureControll;
    this.units = data.result.selectedUnits;
    this.changedScaling = this.units.ePressureScaling.Value;
    localStorage.removeItem("pressureScaling");
    localStorage.setItem("pressureScaling", this.units.ePressureScaling.Value);
    // if (this.pressureData.bPressureAlarmEnable.Value == "0") {
    //   this.isAlertEnable = false;
    // } else {
    //   this.isAlertEnable = true;
    // }
    // if (this.pressureData.PressureOffset.Value == "0") {
    //   this.recipeSettingForm.get('airPressureTemporaryStatus').patchValue(0)
    // } else {
    //   this.recipeSettingForm.get('airPressureTemporaryStatus').patchValue(1)
    // }

    
    let lowSpdPr=this.pressureUnit=="BAR"?(this.pressureData.usPressureCalPtMin.Value/1000).toFixed(2):(this.pressureData.usPressureCalPtMin.Value/1000).toFixed()
    let highSpdPr=this.pressureUnit=="BAR"?(this.pressureData.usPressureCalPtMax.Value/1000).toFixed(2):(this.pressureData.usPressureCalPtMax.Value/1000).toFixed()
    let mxPrLmt=this.pressureUnit=="BAR"?(this.pressureData.usPressureMax?(this.pressureData.usPressureMax.Value/1000):0).toFixed(2):(this.pressureData.usPressureMax?(this.pressureData.usPressureMax.Value/1000):0).toFixed()
    let mnPrLmt=this.pressureUnit=="BAR"?(this.pressureData.usPressureMin?(this.pressureData.usPressureMin.Value/1000):0).toFixed(2):(this.pressureData.usPressureMin?(this.pressureData.usPressureMin.Value/1000):0).toFixed()
    this.lineSpUnt=this.units.LinespeedUnits?this.units.LinespeedUnits.Value:0; 
    this.lineSpeedUnit=this.units.LinespeedUnits?(this.units.LinespeedUnits.Value==0?"ft/min":"m/min"):"m/min";
  
  
    if (this.pressureUnit == 'BAR') {
      this.recipeSettingForm = this.fb.group({
        ulPressureSetPoint: Math.round((this.pressureData.ulPressureSetPoint.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        // isPressureAlert: this.pressureData.bPressureAlarmEnable.Value,
        lowPressureThreshold: Math.round((this.pressureData.ulLowPressureAlertThreshold.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        highPressureThreshold: Math.round((this.pressureData.ulHighPressureAlertThreshold.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        minPressureSetpoint: Math.round((this.pressureData.ulPressureMinSetPoint.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        maxPressureSetpoint: Math.round((this.pressureData.ulPressureMaxSetPoint.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        // isManualPressureAlert: Math.round((this.pressureData.bPressureAlarmEnable.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        LowPressureAlertDelta: Math.round((this.pressureData.ulLowPressureAlertDelta.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        HighPressureAlertDelta: Math.round((this.pressureData.ulHighPressureAlertDelta.Value / inputrange.pressure_setpoint_melter_calc)*100)/100,
        // airPressureTemporaryStatus:this.pressureData.PressureOffset.Value,
        // zeroLineSpeedPress:this.units.ulFullScaleLineSpeed?this.units.ulFullScaleLineSpeed.Value:0,
        lowSpeedPresSett:lowSpdPr,
          highSpeedPresSett:highSpdPr,
          maxPressureLimit: mxPrLmt,
          minPressureLimit: mnPrLmt,
          lowLineSpeedSett: this.lineSpeedUnitChoose(this.pressureData.usLinespeedCalPtMin.Value),
          highLineSpeedSett:this.lineSpeedUnitChoose(this.pressureData.usLinespeedCalPtMax.Value),

     
      });
    } else {
      this.recipeSettingForm = this.fb.group({
        ulPressureSetPoint: this.pressureData.ulPressureSetPoint.Value / inputrange.pressure_setpoint_melter_calc,
        // isPressureAlert: this.pressureData.bPressureAlarmEnable.Value,
        lowPressureThreshold: this.pressureData.ulLowPressureAlertThreshold.Value / inputrange.pressure_setpoint_melter_calc,
        highPressureThreshold: this.pressureData.ulHighPressureAlertThreshold.Value / inputrange.pressure_setpoint_melter_calc,
        minPressureSetpoint: this.pressureData.ulPressureMinSetPoint.Value / inputrange.pressure_setpoint_melter_calc,
        maxPressureSetpoint: this.pressureData.ulPressureMaxSetPoint.Value / inputrange.pressure_setpoint_melter_calc,
        // isManualPressureAlert: this.pressureData.bPressureAlarmEnable.Value / inputrange.pressure_setpoint_melter_calc,
        LowPressureAlertDelta: this.pressureData.ulLowPressureAlertDelta.Value / inputrange.pressure_setpoint_melter_calc,
        HighPressureAlertDelta: this.pressureData.ulHighPressureAlertDelta.Value / inputrange.pressure_setpoint_melter_calc,
        // airPressureTemporaryStatus:this.pressureData.PressureOffset.Value,
        // zeroLineSpeedPress:this.units.ulFullScaleLineSpeed.Value,
        lowSpeedPresSett:lowSpdPr,
        highSpeedPresSett:highSpdPr,
        maxPressureLimit: mxPrLmt,
        minPressureLimit: mnPrLmt,
        lowLineSpeedSett: this.lineSpeedUnitChoose(this.pressureData.usLinespeedCalPtMin.Value),
        highLineSpeedSett:this.lineSpeedUnitChoose(this.pressureData.usLinespeedCalPtMax.Value),
      });
    }

    this.recipeSettingUnitForm = this.fb.group({
      TempUnits: this.units.TempUnits.Value,
      PressureUnits: this.units.PressureUnits.Value,
      ePressureScaling: this.units.ePressureScaling.Value,
      ATSTargetAddon:data.result.flow.ATSTargetAddon?data.result.flow.ATSTargetAddon.Value:'',
      lineSpeedUnits:data.result.selectedUnits.LinespeedUnits?data.result.selectedUnits.LinespeedUnits.Value:0
    })
  }
  setUnits(units) {
    this.tempUnitNum = units.TempUnits.Value;
    this.pressureUnitNum = units.PressureUnits.Value;
    this.changedUnit = this.pressureUnitNum.toString();
    localStorage.removeItem("tempUnit");
    localStorage.removeItem("pressureUnit");
    localStorage.setItem("tempUnit", this.tempUnitNum.toString());
    localStorage.setItem("pressureUnit", this.pressureUnitNum.toString());
    this.setTempUnitValueString(units.TempUnits.Value);
    this.setPressureUnitValueString(units.PressureUnits.Value);
    this.setInputRange(this.pressureUnit, units.ePressureScaling.Value);

  }
  setTempUnitValueString(tempUnitValue) {
    if (tempUnitValue == 0) {
      this.tempUnit = 'C';
    } else {
      this.tempUnit = 'F';
    }
  }
  setPressureUnitValueString(pressureUnitValue) {
    if (pressureUnitValue == 0) {
      this.pressureUnit = 'PSI';
    } else if (pressureUnitValue == 1) {
      this.pressureUnit = 'kPa';
    } else {
      this.pressureUnit = 'BAR';
    }
  }
  createValidationMess(setpoint){
    let pressureHydraulicCal = this.ePressureScaling == 1 ? inputrange.pressure_setpoint_hydraulic_calc : 1
    return this.ePressureScaling == 1 ? Math.round((setpoint * pressureHydraulicCal)*100)/100 : setpoint * pressureHydraulicCal;
  }
  setInputRange(pressureUnit, ePressureScaling = 0) {
    /*  Pressure scaling */
    this.pressureHydraulicCal = ePressureScaling == 1 ? inputrange.pressure_setpoint_hydraulic_calc : 1
    this.ePressureScaling = ePressureScaling;
    if (pressureUnit == 'PSI') {
    // this.ulPressureSetPoint = this.createValidationMess(inputrange.min_pressure_setpoint_range_psi_min);
    this.minPresssureValLimitmin =
      this.createValidationMess(inputrange.min_pressure_setpoint_limit_psi_min);
    this.minPresssureValLimitmax =
      this.createValidationMess(inputrange.min_pressure_setpoint_limit_psi_max);
    this.maxPresssureValLimitmin =
      this.createValidationMess(inputrange.max_pressure_setpoint_limit_psi_min);
    this.maxPresssureValLimitmax =
      this.createValidationMess(inputrange.max_pressure_setpoint_limit_psi_max);

    this.pressureSetPointMin = this.createValidationMess(inputrange.pressure_setpoint_psi_min);
    this.pressureSetPointMax = this.createValidationMess(inputrange.pressure_setpoint_psi_max);

      this.lowPressureThresholdMin =
        this.createValidationMess(inputrange.low_pressure_alert_threshold_psi_min);
      this.lowPressureThresholdMax =
        this.createValidationMess(inputrange.low_pressure_alert_threshold_psi_max);
      this.highPressureThresholdMin =
        this.createValidationMess(inputrange.heigh_pressure_alert_threshold_psi_min);
      this.highPressureThresholdMax =
        this.createValidationMess(inputrange.heigh_pressure_alert_threshold_psi_max);

      this.minPresssureValRangemin =
        this.createValidationMess(inputrange.min_pressure_setpoint_range_psi_min);
      this.minPresssureValRangemax =
        this.createValidationMess(inputrange.min_pressure_setpoint_range_psi_max);
      this.maxPresssureValRangemin =
        this.createValidationMess(inputrange.max_pressure_setpoint_range_psi_min);
      this.maxPresssureValRangemax =
        this.createValidationMess(inputrange.max_pressure_setpoint_range_psi_max);
    

    } else if (pressureUnit == 'BAR') {
    this.minPresssureValLimitmin =
      this.createValidationMess(inputrange.min_pressure_setpoint_limit_bar_min);
    this.minPresssureValLimitmax =
      this.createValidationMess(inputrange.min_pressure_setpoint_limit_bar_max);
    this.maxPresssureValLimitmin =
      this.createValidationMess(inputrange.max_pressure_setpoint_limit_bar_min);
    this.maxPresssureValLimitmax =
      this.createValidationMess(inputrange.max_pressure_setpoint_limit_bar_max);

    // this.ulPressureSetPoint = this.createValidationMess(inputrange.min_pressure_setpoint_range_bar_min);

    this.pressureSetPointMin = this.createValidationMess(inputrange.pressure_setpoint_bar_min);
    this.pressureSetPointMax = this.createValidationMess(inputrange.pressure_setpoint_bar_max);

      this.lowPressureThresholdMin =
        this.createValidationMess(inputrange.low_pressure_alert_threshold_bar_min);
      this.lowPressureThresholdMax =
        this.createValidationMess(inputrange.low_pressure_alert_threshold_bar_max);
      this.highPressureThresholdMin =
        this.createValidationMess(inputrange.heigh_pressure_alert_threshold_bar_min);
      this.highPressureThresholdMax =
        this.createValidationMess(inputrange.heigh_pressure_alert_threshold_bar_max);

      this.minPresssureValRangemin =
        this.createValidationMess(inputrange.min_pressure_setpoint_range_bar_min);
      this.minPresssureValRangemax =
        this.createValidationMess(inputrange.min_pressure_setpoint_range_bar_max);
      this.maxPresssureValRangemin =
        this.createValidationMess(inputrange.max_pressure_setpoint_range_bar_min);
      this.maxPresssureValRangemax =
        this.createValidationMess(inputrange.max_pressure_setpoint_range_bar_max);

    } else if (pressureUnit == 'kPa') {
      // this.ulPressureSetPoint = this.createValidationMess(inputrange.min_pressure_setpoint_range_kpa_min );
      this.minPresssureValLimitmin =
      this.createValidationMess(inputrange.min_pressure_setpoint_limit_kpa_min);
    this.minPresssureValLimitmax =
      this.createValidationMess(inputrange.min_pressure_setpoint_limit_kpa_max);
    this.maxPresssureValLimitmin =
      this.createValidationMess(inputrange.max_pressure_setpoint_limit_kpa_min);
    this.maxPresssureValLimitmax =
      this.createValidationMess(inputrange.max_pressure_setpoint_limit_kpa_max);

    this.pressureSetPointMin = this.createValidationMess(inputrange.pressure_setpoint_kpa_min);
    this.pressureSetPointMax = this.createValidationMess(inputrange.pressure_setpoint_kpa_max);

      this.lowPressureThresholdMin =
        this.createValidationMess(inputrange.low_pressure_alert_threshold_kpa_min);
      this.lowPressureThresholdMax =
        this.createValidationMess(inputrange.low_pressure_alert_threshold_kpa_max);
      this.highPressureThresholdMin =
        this.createValidationMess(inputrange.heigh_pressure_alert_threshold_kpa_min);
      this.highPressureThresholdMax =
        this.createValidationMess(inputrange.heigh_pressure_alert_threshold_kpa_max);

      this.minPresssureValRangemin =
        this.createValidationMess(inputrange.min_pressure_setpoint_range_kpa_min);
      this.minPresssureValRangemax =
        this.createValidationMess(inputrange.min_pressure_setpoint_range_kpa_max);
      this.maxPresssureValRangemin =
        this.createValidationMess(inputrange.max_pressure_setpoint_range_kpa_min);
      this.maxPresssureValRangemax =
        this.createValidationMess(inputrange.max_pressure_setpoint_range_kpa_max);
    }
  }

  lineSpeedUnitChoose(value){
    if(!this.lineSpUnt){
    return (value/100).toFixed()
    }else{
      return ((value/100)*0.3048).toFixed(1)
    }
   }
   focusField:string;
  pressureRangeValidations() {
    let lowPressureThreshold = parseFloat(this.recipeSettingForm.value.lowPressureThreshold);
    let highPressureThreshold = parseFloat(this.recipeSettingForm.value.highPressureThreshold);
    let pressureMin = parseFloat(this.recipeSettingForm.value.minPressureSetpoint);
    let pressureMax = parseFloat(this.recipeSettingForm.value.maxPressureSetpoint);
    // let isPressureAlert = parseFloat(this.recipeSettingForm.value.isPressureAlert);
    let pressureSetPoint = parseFloat(this.recipeSettingForm.value.ulPressureSetPoint);
    let lowPressureAlertThreshold = parseFloat(this.recipeSettingForm.value.LowPressureAlertDelta);
    let highPressureAlertThreshold = parseFloat(this.recipeSettingForm.value.HighPressureAlertDelta);

    const expected_pressure_alert_difference = 
        this.pressureUnit=='BAR'?this.createValidationMess(inputrange.manual_mode_pressure_alert_difference_bar):
        this.pressureUnit=='kPa'?this.createValidationMess(inputrange.manual_mode_pressure_alert_difference_kpa):
        this.createValidationMess(inputrange.manual_mode_pressure_alert_difference_psi)
    const actual_pressure_alert_difference = Math.round((highPressureThreshold-lowPressureThreshold)*100)/100
    const electronic_expected_pressure_alert_difference = 
        this.pressureUnit=='BAR'?this.createValidationMess(inputrange.electronic_mode_pressure_alert_difference_bar):
        this.pressureUnit=='kPa'?this.createValidationMess(inputrange.electronic_mode_pressure_alert_difference_kpa):
        this.createValidationMess(inputrange.electronic_mode_pressure_alert_difference_psi)
   if (!(lowPressureThreshold < highPressureThreshold)) 
        {
          this.errorMsg = 'Minimum Pressure Alert Range should be less than Maximum Pressure Alert Range';
          this.focusField = 'lowPressureThreshold'
          return false;
        }    
    else if (!(lowPressureThreshold >= this.minPresssureValLimitmin && lowPressureThreshold <= this.minPresssureValLimitmax)) 
    {
      this.errorMsg = 'Minimum Pressure Alert range should be ' + this.minPresssureValLimitmin + ' to ' + this.minPresssureValLimitmax+' '+this.pressureUnit;
      this.focusField = 'lowPressureThreshold'
      return false;
    }
    else if (!((highPressureThreshold >= this.maxPresssureValLimitmin) && (highPressureThreshold <= this.maxPresssureValLimitmax)))
    {
      this.errorMsg = 'Maximum Pressure Alert range should be ' + this.maxPresssureValLimitmin + ' to ' + this.maxPresssureValLimitmax+' '+this.pressureUnit;
      this.focusField = 'highPressureThreshold'
      return false;
    }
    else if (!(actual_pressure_alert_difference >= expected_pressure_alert_difference))
    {
      this.errorMsg = 'Pressure Alert range should have minimum difference of '+expected_pressure_alert_difference+' '+this.pressureUnit;
      this.focusField = 'highPressureThreshold'
      return false;
    }

  
   
    // ----
    else if (
      (pressureSetPoint < pressureMin &&
        (pressureMin >= this.minPresssureValRangemin && pressureMin <= this.minPresssureValRangemax)) ||
      (pressureSetPoint > pressureMax &&
        (pressureMax >= this.maxPresssureValRangemin && pressureMax <= this.maxPresssureValRangemax)) ||
      pressureSetPoint < this.pressureSetPointMin ||
      pressureSetPoint > this.pressureSetPointMax ||
      isNaN(pressureSetPoint)
    )
    {
      // let from = (pressureMin<this.pressureSetPointMin) ? this.pressureSetPointMin : pressureMin;
      // let from = (pressureMin<this.pressureSetPointMin) ? this.pressureSetPointMax : pressureMin;
      let from = (pressureMin>this.pressureSetPointMax) ? this.pressureSetPointMin : pressureMin;
      let to = (pressureMax<this.pressureSetPointMin)||
              (pressureMax>this.pressureSetPointMax)||
              (pressureMax<this.maxPresssureValRangemin) ? this.pressureSetPointMax : pressureMax;
      to = (from>to) ? this.pressureSetPointMax : to
      from = isNaN(pressureMin)?this.pressureSetPointMin:from
      from = from<this.pressureSetPointMin?this.pressureSetPointMin:from
      to = isNaN(pressureMax)?this.pressureSetPointMax:to
      this.errorMsg = 'Pressure Set Point range should be '+from+' to '+to+' '+this.pressureUnit;
      if(from==to) 
        this.errorMsg = 'Pressure Set Point should be '+from+' '+this.pressureUnit;
      this.focusField = 'ulPressureSetPoint'
      if (pressureMax < pressureMin) {
        this.errorMsg = 'Minimum Pressure Setpoint Range should be less than Maximum Pressure Setpoint Range';
        this.focusField = 'minPressureSetpoint'
      }
      return false;
    }
    // ----
    else if (!(lowPressureAlertThreshold >= this.lowPressureThresholdMin && lowPressureAlertThreshold <= this.lowPressureThresholdMax))
    {
      this.errorMsg = 'Low Pressure Alert Threshold range should be ' + this.lowPressureThresholdMin + ' to ' + this.lowPressureThresholdMax+' '+this.pressureUnit;
      this.focusField = 'LowPressureAlertDelta'
      return false;
    }
    else if (!((highPressureAlertThreshold >= this.highPressureThresholdMin) && (highPressureAlertThreshold <= this.highPressureThresholdMax)))
    {
      this.errorMsg = 'High Pressure Alert Threshold range should be ' + this.highPressureThresholdMin + ' to ' + this.highPressureThresholdMax+' '+this.pressureUnit;
      this.focusField = 'HighPressureAlertDelta'
      return false;
    } 
    // ----
    else if (
      pressureMin < this.minPresssureValRangemin ||
      pressureMin > this.minPresssureValRangemax ||
      pressureMin > pressureSetPoint ||
      isNaN(pressureMin)
    ) {
      let to = (this.minPresssureValRangemax>=pressureSetPoint) ? pressureSetPoint : this.minPresssureValRangemax
      this.errorMsg = 'Minimum Pressure Set Point Range should be '+this.minPresssureValRangemin+' to '+to+' '+this.pressureUnit;
      if(this.minPresssureValRangemin==pressureSetPoint) {
        this.errorMsg = 'Minimum Pressure Set Point Range should be '+pressureSetPoint+' '+this.pressureUnit
      }
      this.focusField = 'minPressureSetpoint'
      return false;
    }
    else if (
      pressureMax < this.maxPresssureValRangemin ||
      pressureMax > this.maxPresssureValRangemax ||
      pressureMax < pressureSetPoint ||
      isNaN(pressureMax)
    ) {
      let from = (this.maxPresssureValRangemin>=pressureSetPoint) ? this.maxPresssureValRangemin : pressureSetPoint
      this.errorMsg = 'Maximum Pressure Set Point Range should be '+from+' to '+this.maxPresssureValRangemax+' '+this.pressureUnit;
      if(this.maxPresssureValRangemax==pressureSetPoint) {
        this.errorMsg = 'Maximum Pressure Set Point Range should be '+pressureSetPoint+' '+this.pressureUnit
      }
      this.focusField = 'maxPressureSetpoint'
      return false;
    }
    else if (!(pressureMin <= pressureMax))
    {
      this.errorMsg = 'Minimum Pressure Setpoint Range should be less than Maximum Pressure Setpoint Range';
      this.focusField = 'minPressureSetpoint'
      return false;
    }
    else if (
      !(
        Math.round((pressureMax - pressureMin)*100)/100>=electronic_expected_pressure_alert_difference
      )
    ) {
      this.errorMsg = 'Minimum & Maximum Pressure Setpoint Range difference should be minimum '+electronic_expected_pressure_alert_difference+' '+this.pressureUnit;
      this.focusField = 'maxPressureSetpoint'
      return false;
    }

    // else if (!(lowPressureAlertThreshold < highPressureAlertThreshold)) {
    //   this.errorMsg =
    //     'Low Pressure Alert Threshold Range should be less than High Pressure Alert Threshold Range';
    //   return false;
    // }
    // console.log(this.recipeSettingUnitForm.get('ATSTargetAddon').value)

    else if(parseInt(this.recipeSettingUnitForm.get('ATSTargetAddon').value)<25||parseInt(this.recipeSettingUnitForm.get('ATSTargetAddon').value)>1000000){
      this.errorMsg =
          'Target Add on should be Inbetween 25 mg and 1000000 mg '
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();  
      return false;
    }
    else {
      this.unitCheckValidation()
    }
    return true;
  }
  tempRangeValidations() {
    let i: any;
    this.errorMsg = '';
    /*  Temperature validations, C: 40 to 232, F: 100 to 450 */
    for (i = 0; i < this.valueTmpZone; i++) {
      // SetpointTempZone0: "177"
      // ZoneControl0: false
      let setpoint = this.tempData[i].setpoint;
      let zoneName = this.tempData[i].name//`Zone${parseInt(i) + 1}`;
      if (this.tempData[i].zone == true) {
        if (this.tempUnit == 'C') {
          if (!(parseInt(setpoint) >= 40 && parseInt(setpoint) <= 232)) {
            // if (zoneName == "Zone1") {
            //   zoneName = "Tank";
            // }
            document.getElementById(zoneName).focus(); 
            this.errorMsg = `${zoneName} Set Point range should be 40 to 232`;
            return false;
          }
        } else {
          //F
          if (!(parseInt(setpoint) >= 100 && parseInt(setpoint) <= 450)) {
            // if (zoneName == "Zone1") {
            //   zoneName = "Tank";
            // }
            document.getElementById(zoneName).focus(); 
            this.errorMsg = `${zoneName} Set Point range should be 100 to 450`;
            return false;
          }
        }
      }
    }
    return true;
  }
  saveRecipeSettings() {
    //Error Validation
    this.errExist = false;
    this.updateStatus = false;
    let pressureValidateStatus: boolean = true;
    let tempValidateStatus: boolean = true;
    tempValidateStatus = this.tempRangeValidations();
    if (tempValidateStatus == true) {
      pressureValidateStatus = this.pressureRangeValidations();
    }
    if (pressureValidateStatus && tempValidateStatus) {
      //update Temperature
      let tempRequest = {
        fileName: this.fileName + '.xml',
        TempUnits: this.recipeSettingUnitForm.value.TempUnits,
      };
      let i: any;
      for (i = 0; i < this.tempData.length; i++) {
        let zoneNum = parseInt(i);
        tempRequest['SetpointTempZone' + zoneNum] = this.tempData[i].setpoint;
      }
      for (i = 0; i < this.tempData.length; i++) {
        let zoneToggle = this.tempData[i].zone == true ? 1 : 0;
        let zoneNum = parseInt(i);
        tempRequest['ZoneControl' + zoneNum] = zoneToggle.toString()
      }
     
      //update Pressure
      let pressureRequest = {
        fileName: this.fileName + '.xml',
        TempUnits: this.recipeSettingUnitForm.value.TempUnits,
        ePressureScaling: this.recipeSettingUnitForm.value.ePressureScaling,
        PressureUnits: this.recipeSettingUnitForm.value.PressureUnits,
        ulLowPressureAlertThreshold: this.recipeSettingForm.value.lowPressureThreshold,
        ulHighPressureAlertThreshold: this.recipeSettingForm.value.highPressureThreshold,
        ulLowPressureAlertDelta: this.recipeSettingForm.value.LowPressureAlertDelta,
        ulHighPressureAlertDelta: this.recipeSettingForm.value.HighPressureAlertDelta,
        // ulPressureSetPoint: "1500",
        usPressureCalPtMax:this.recipeSettingForm.value.highSpeedPresSett,
        usPressureCalPtMin:this.recipeSettingForm.value.lowSpeedPresSett,
        usLinespeedCalPtMax:this.recipeSettingForm.value.highLineSpeedSett,
        usLinespeedCalPtMin:this.recipeSettingForm.value.lowLineSpeedSett,
        usPressureMax:this.recipeSettingForm.value.maxPressureLimit,
        usPressureMin:this.recipeSettingForm.value.minPressureLimit,
        // bPressureAlarmEnable: this.recipeSettingForm.value.isPressureAlert.toString(),
        ulPressureMinSetPoint: this.recipeSettingForm.value.minPressureSetpoint,
        ulPressureMaxSetPoint: this.recipeSettingForm.value.maxPressureSetpoint,
        // ulFullScaleLineSpeed:this.recipeSettingForm.value.zeroLineSpeedPress,
        // PressureOffset:this.recipeSettingForm.value.airPressureTemporaryStatus,
        ulPressureSetPoint: this.recipeSettingForm.value.ulPressureSetPoint,
        ATSTargetAddon:this.recipeSettingUnitForm.value.ATSTargetAddon  ,
        LinespeedUnits:this.recipeSettingUnitForm.value.lineSpeedUnits,

      };


     if(!this.errExist){
      this.recipeService.savePressureData(pressureRequest).subscribe(
        (data: any) => {
          if ((data.status = 'Success')) {
           
            this.recipeService.saveTemperatureData(tempRequest).subscribe(
              (data: any) => {
                if ((data.status = 'Success')) {
                  //success msg
                  this.toast.success('Recipe is saved successfully', '', {
                    timeOut: 3000
                  });
                }
              },
              (err: Error) => {
                console.log('err', err);
              }
            );
          }
        },
        (err: Error) => {
          console.log('err', err);
        }
      );
     }
    } else {  
      if(this.errorMsg ){
        const ele = this.aForm.nativeElement[this.focusField];
        if (ele) {
          ele.focus();
        }
       return this.toast.error(this.errorMsg, '', {
          timeOut: 3000
        });
      }  
    }
  }

  createRecipeSettings() {
    let outputSetting= this.unitCheckValidation()
    let pressureValidateStatus: boolean = true;
    let tempValidateStatus: boolean = true;
    tempValidateStatus = this.tempRangeValidations();
    if (tempValidateStatus == true) {
      pressureValidateStatus = this.pressureRangeValidations();
    }
    if (pressureValidateStatus && tempValidateStatus && !outputSetting) {
      let tempRequest = {
        TempUnits: this.recipeSettingUnitForm.value.TempUnits,
        ePressureScaling: this.recipeSettingUnitForm.value.ePressureScaling,
        PressureUnits: this.recipeSettingUnitForm.value.PressureUnits,
        ulLowPressureAlertThreshold: this.recipeSettingForm.value.lowPressureThreshold,
        ulHighPressureAlertThreshold: this.recipeSettingForm.value.highPressureThreshold,
        ulLowPressureAlertDelta: this.recipeSettingForm.value.LowPressureAlertDelta,
        ulHighPressureAlertDelta: this.recipeSettingForm.value.HighPressureAlertDelta,
      // ulPressureSetPoint: "1500",
        usPressureCalPtMax: this.recipeSettingForm.value.highSpeedPresSett,
        usPressureCalPtMin: this.recipeSettingForm.value.lowSpeedPresSett,
        usLinespeedCalPtMax: this.recipeSettingForm.value.highLineSpeedSett,
        usLinespeedCalPtMin: this.recipeSettingForm.value.lowLineSpeedSett,
        // bPressureAlarmEnable: this.recipeSettingForm.value.isPressureAlert.toString(),
        usPressureMin:this.recipeSettingForm.value.minPressureLimit,
        usPressureMax:this.recipeSettingForm.value.maxPressureLimit,
        ulPressureMinSetPoint: this.recipeSettingForm.value.minPressureSetpoint,
        ulPressureMaxSetPoint: this.recipeSettingForm.value.maxPressureSetpoint,
        // ulFullScaleLineSpeed:this.recipeSettingForm.value.zeroLineSpeedPress,
        PressureOffset:this.recipeSettingForm.value.airPressureTemporaryStatus,
       
        ulPressureSetPoint: this.recipeSettingForm.value.ulPressureSetPoint,
        ATSTargetAddon:this.recipeSettingUnitForm.value.ATSTargetAddon,
        LinespeedUnits:this.recipeSettingUnitForm.value.lineSpeedUnits,
        //airPressureStatus: this.recipeSettingForm.value.isManualPressureAlert,
        recipeFileName:
          localStorage.getItem('newRecipeName') == undefined
            ? ''
            : localStorage.getItem('newRecipeName')
      };

      let i: any;
      for (i = 0; i < this.tempData.length; i++) {
        let zoneNum = parseInt(i);
        tempRequest['SetpointTempZone' + zoneNum] = this.tempData[i].setpoint;
      }
      for (i = 0; i < this.tempData.length; i++) {
        let zoneNum = parseInt(i);
        tempRequest['ZoneControl' + zoneNum] = this.tempData[i].zone == true ? 1 : 0;
      }
      if(!this.errExist){
      this.recipeService.saveNewRecipe(tempRequest).subscribe(
        (data: any) => {
          if ((data.status = 'Success')) {
            localStorage.removeItem('newRecipeName');
            this.router.navigate(['/recipe']);
            this.toast.success('Recipe is saved successfully', '', {
              timeOut: 3000
            });
          }
        },
        (err: Error) => {
          console.log('err', err);
        }
      );
      }
    } else {
      this.toast.error(this.errorMsg, '', {
        timeOut: 3000
      });
    }
  }
  preventalpha(event) {
   event.keyCode===8?this.updateStatus=true:'';

    if (this.changedUnit != "2") {
      let status = this.authService.preventalpha(event);
      this.updateChangeStatus();
      return status;
    } else {
      var charCode = (event.which) ? event.which : event.keyCode
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57)) {
        return false;
      }
      this.updateChangeStatus();
    }
  }
  preventalphaSpecialChar(event) {
    let status = this.authService.preventalpha(event);
    this.updateChangeStatus();
    return status;
  }

  updateChangeStatus() {
    this.updateStatus = true;
  }
  tooglePressure(e) {
    this.updateStatus = true;
    if (e.checked === false) {
      this.recipeSettingForm.get('isPressureAlert').patchValue(0);
    } else if (e.checked === true) {
      this.recipeSettingForm.get(`isPressureAlert`).patchValue(1);
    }
  }

  togglePressureTemperature(e){
    this.updateStatus = true;
    if (e.checked === false) {
      this.recipeSettingForm.get('airPressureTemporaryStatus').patchValue(0);
    } else if (e.checked === true) {
      this.recipeSettingForm.get(`airPressureTemporaryStatus`).patchValue(1);
    }
  }

  setValue(event) {
    if (event.isUserInput) {
      this.choice = event.source.value;
    }
  }

  // checkStatus() {
  //   if (this.recipeSettingForm.get('isPressureAlert').value == 0) {
  //     this.isLowPressure = true;
  //     this.isHighPressure = true;
  //     return 'blurred';
  //   } else {
  //     this.isLowPressure = null;
  //     this.isHighPressure = null;
  //     return 'unblurred';
  //   }
  // }
  convertTempUnit(changedUnit) {
    this.updateChangeStatus();
    this.recipeSettingUnitForm.value.TempUnits
    let tempRequest = {
      currUnit: changedUnit,
      prevUnit: localStorage.getItem("tempUnit")
    };
    let i: any;
    for (i = 0; i < this.tempData.length; i++) {
      tempRequest['SetpointTempZone' + i] = this.tempData[i].setpoint;
    }
    this.recipeService.convertTemp(tempRequest).subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          localStorage.removeItem("tempUnit");
          localStorage.setItem("tempUnit", this.recipeSettingUnitForm.value.TempUnits);
          this.setTempUnitValueString(parseInt(this.recipeSettingUnitForm.value.TempUnits));
          let j: number = 0;
          let tempZone = JSON.parse(JSON.stringify(data.data.tempZone));
          tempZone.forEach(element => {
            if (j == 0) {
              this.tankManifold.tank = element['SetpointTempZone' + j];
            }
            if (j == 1) {
              this.tankManifold.manifold = element['SetpointTempZone' + j];
            }
            this.tempData[j].setpoint = element['SetpointTempZone' + j];
            j++;
          });
        }
      },
      (err: Error) => {
        console.log('err', err);
      }
    );
  }
  convertPressureScaling(changedValue) {
    this.changedScaling = changedValue;
    this.convertPressureApi();
  }
 
  convertMeterTofeet(e){
   let obj={
      "usLinespeedCalPtMin":this.recipeSettingForm.value.lowLineSpeedSett,
      "usLinespeedCalPtMax":this.recipeSettingForm.value.highLineSpeedSett,
      "lineSpeedUnit":e
   }
   this.recipeService.converLineSpeed(obj).subscribe((data:any)=>{
      if ((data.status = 'Success')) {
        let lowLineSpeed=data.result.usLinespeedCalPtMin;
        let highLineSpeed=data.result.usLinespeedCalPtMax;
        this.recipeSettingUnitForm.controls.lineSpeedUnits.setValue(e);
        this.lineSpeedUnit=parseInt(e)?"m/min":"ft/min";
        if(!e){
          this.recipeSettingForm.controls.lowLineSpeedSett.setValue(parseFloat(lowLineSpeed).toFixed());
          this.recipeSettingForm.controls.highLineSpeedSett.setValue(parseFloat(highLineSpeed).toFixed());
          }else{
            this.recipeSettingForm.controls.lowLineSpeedSett.setValue(parseFloat(lowLineSpeed));
            this.recipeSettingForm.controls.highLineSpeedSett.setValue(parseFloat(highLineSpeed));
          }
     }
   })


  }
  convertPressureUnit(changedUnit) {
    this.changedUnit = changedUnit;
    this.updateChangeStatus();
    this.convertPressureApi();
  }

  convertSpeedUnit(speedUnit){
    this.lineSpUnt=speedUnit;
    this.updateChangeStatus();
    this.convertMeterTofeet(speedUnit)
  }


  convertPressureApi() { 
    let pressureRequest = {
        currUnit:this.changedUnit,
        prevUnit: localStorage.getItem("pressureUnit"),
        ulLowPressureAlertThreshold: this.recipeSettingForm.value.lowPressureThreshold,
        ulHighPressureAlertThreshold: this.recipeSettingForm.value.highPressureThreshold,
        ulPressureMinSetPoint: this.recipeSettingForm.value.minPressureSetpoint,
        ulPressureMaxSetPoint: this.recipeSettingForm.value.maxPressureSetpoint,
        ulLowPressureAlertDelta: this.recipeSettingForm.value.LowPressureAlertDelta,
        ulHighPressureAlertDelta: this.recipeSettingForm.value.HighPressureAlertDelta,
        curScelling: this.changedScaling,
        prevScelling: localStorage.getItem("pressureScaling"),
        ulPressureSetPoint: this.recipeSettingForm.value.ulPressureSetPoint,
        // PressureOffset:this.recipeSettingForm.value.airPressureTemporaryStatus,
        //
        usPressureMax:this.recipeSettingForm.value.maxPressureLimit,
        usPressureMin:this.recipeSettingForm.value.minPressureLimit,
        usPressureCalPtMax:this.recipeSettingForm.value.highSpeedPresSett,
        usPressureCalPtMin:this.recipeSettingForm.value.lowSpeedPresSett,
        ATSTargetAddon:this.recipeSettingUnitForm.value.ATSTargetAddon,
        LinespeedUnits:this.recipeSettingUnitForm.value.lineSpeedUnits,

        // ulFullScaleLineSpeed:this.recipeSettingForm.value.zeroLineSpeedPress,
        // usLinespeedCalPtMin:this.recipeSettingForm.value.lowLineSpeedSett,
        // usLinespeedCalPtMax:this.recipeSettingForm.value.highLineSpeedSett

        
      };
    this.recipeService.convertPressure(pressureRequest).subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          localStorage.removeItem("pressureUnit");
          localStorage.setItem("pressureUnit", this.recipeSettingUnitForm.value.PressureUnits);
          localStorage.removeItem("pressureScaling");
          localStorage.setItem("pressureScaling", this.recipeSettingUnitForm.value.ePressureScaling);
          this.setPressureUnitValueString(parseInt(this.recipeSettingUnitForm.value.PressureUnits));
          this.setInputRange(this.pressureUnit, this.changedScaling);
          let setPressureAlert = 1;
          if (this.recipeSettingForm.value.isPressureAlert == "0") {
            setPressureAlert = 0;
          }
          if (this.changedUnit == "2") {
            this.recipeSettingForm = this.fb.group({
              ulPressureSetPoint: Math.round((data.result.ulPressureSetPoint / inputrange.pressure_setpoint_melter_calc)*100)/100,
              isPressureAlert: setPressureAlert,
              lowPressureThreshold: Math.round((data.result.ulLowPressureAlertThreshold / inputrange.pressure_setpoint_melter_calc)*100)/100,
              highPressureThreshold: Math.round((data.result.ulHighPressureAlertThreshold / inputrange.pressure_setpoint_melter_calc)*100)/100,
              minPressureSetpoint: Math.round((data.result.ulPressureMinSetPoint / inputrange.pressure_setpoint_melter_calc)*100)/100,
              maxPressureSetpoint: Math.round((data.result.ulPressureMaxSetPoint / inputrange.pressure_setpoint_melter_calc)*100)/100,
              LowPressureAlertDelta: Math.round((data.result.ulLowPressureAlertDelta / inputrange.pressure_setpoint_melter_calc)*100)/100,
              HighPressureAlertDelta: Math.round((data.result.ulHighPressureAlertDelta / inputrange.pressure_setpoint_melter_calc)*100)/100,
              PressureOffset:this.recipeSettingForm.value.airPressureTemporaryStatus,

              maxPressureLimit:Math.round((data.result.usPressureMax / inputrange.pressure_setpoint_melter_calc)*100)/100,
              minPressureLimit:Math.round((data.result.usPressureMin / inputrange.pressure_setpoint_melter_calc)*100)/100,
              highSpeedPresSett :Math.round((data.result.usPressureCalPtMax / inputrange.pressure_setpoint_melter_calc)*100)/100, 
              lowSpeedPresSett:Math.round((data.result.usPressureCalPtMin / inputrange.pressure_setpoint_melter_calc)*100)/100, 
              zeroLineSpeedPress:this.recipeSettingForm.value.zeroLineSpeedPress,
              lowLineSpeedSett:this.recipeSettingForm.value.lowLineSpeedSett,
              highLineSpeedSett:this.recipeSettingForm.value.highLineSpeedSett
              
            });
          } else {
            this.recipeSettingForm = this.fb.group({
              ulPressureSetPoint: Math.round(data.result.ulPressureSetPoint / inputrange.pressure_setpoint_melter_calc),
              isPressureAlert: setPressureAlert,
              lowPressureThreshold: Math.round(data.result.ulLowPressureAlertThreshold / inputrange.pressure_setpoint_melter_calc),
              highPressureThreshold: Math.round(data.result.ulHighPressureAlertThreshold / inputrange.pressure_setpoint_melter_calc),
              minPressureSetpoint: Math.round(data.result.ulPressureMinSetPoint / inputrange.pressure_setpoint_melter_calc),
              maxPressureSetpoint: Math.round(data.result.ulPressureMaxSetPoint / inputrange.pressure_setpoint_melter_calc),
              LowPressureAlertDelta: Math.round(data.result.ulLowPressureAlertDelta / inputrange.pressure_setpoint_melter_calc),
              HighPressureAlertDelta: Math.round(data.result.ulHighPressureAlertDelta / inputrange.pressure_setpoint_melter_calc),
              PressureOffset:this.recipeSettingForm.value.airPressureTemporaryStatus,

              maxPressureLimit:Math.round(data.result.usPressureMax / inputrange.pressure_setpoint_melter_calc),
              minPressureLimit:Math.round(data.result.usPressureMin / inputrange.pressure_setpoint_melter_calc),
              highSpeedPresSett :Math.round(data.result.usPressureCalPtMax / inputrange.pressure_setpoint_melter_calc), 
              lowSpeedPresSett:Math.round(data.result.usPressureCalPtMin / inputrange.pressure_setpoint_melter_calc), 
              
              zeroLineSpeedPress:this.recipeSettingForm.value.zeroLineSpeedPress,
              lowLineSpeedSett:this.recipeSettingForm.value.lowLineSpeedSett,
              highLineSpeedSett:this.recipeSettingForm.value.highLineSpeedSett

            });
          }
        }
      },
      (err: Error) => {
        console.log('err', err);
      }
    );
  }
  zoneToggle(event, index) {
    this.updateChangeStatus();
    if (event.checked === false) {
      this.disableZone[index].zone = false;
    } else {
      this.disableZone[index].zone = true;
    }
  }
  checkDisable(index) {
    if (this.disableZone[index].zone) {
      return false;
    }
    return true;
  }
  onKey(event, type, value) {
    if (type == 'grid') {
      this.tankManifold.manifold = event.target.value;
    }
    if (type == 'manifold') {
      this.tankManifold.tank = event.target.value;
    }
    let tank_index = this.tempData.findIndex(c => c.index == 1)
    this.tempData[tank_index].setpoint = parseInt(event.target.value);
    let manifold_index = this.tempData.findIndex(c => c.index == 2)
    this.tempData[manifold_index].setpoint = parseInt(event.target.value);
  }

  pressrOutputKey(event){
    event.keyCode===8?this.updateStatus=true:'';
    let input=this.recipeSettingForm.controls[event.target.name]
    let s=6
    let regvalid=new RegExp(`/^\d{1,${s}}(\.\d{1,2})?$/g`).test(input.value)
    let val=input.value;

    let fiveDigit=()=>{val=val.substring(0,requiredDigit.fiveDigit(val));return input.patchValue(val); }                  
    input.patchValue(val)  
    if (!regvalid){
      val = val.replace(/[^.\d]/g, '')
      .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
       fiveDigit()
    }
  }

  onKeyUp(event){
   event.keyCode===8?this.updateStatus=true:'';
    //sv
     let input=this.recipeSettingForm.controls[event.target.name]
     let s=6
     let regvalid=new RegExp(`/^\d{1,${s}}(\.\d{1,2})?$/g`).test(input.value)
     let val=input.value;
     let singleDigit=()=>{val=val.substring(0,requiredDigit.singleDigit(val)); return input.patchValue(val);}
     let doubleDigit=()=>{val=val.substring(0,requiredDigit.doubleDigit(val)); return input.patchValue(val);}
     let tripleDigit=()=>{val=val.substring(0,requiredDigit.tripleDigit(val));return input.patchValue(val);}
     let fourDigit=()=>{val=val.substring(0,requiredDigit.fourDigit(val));return input.patchValue(val); }   
     let fiveDigit=()=>{val=val.substring(0,requiredDigit.fiveDigit(val));return input.patchValue(val); }                  


     input.patchValue(val)  
     if (!regvalid &&val){
       val = val.replace(/[^.\d]/g, '')
       .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");
       //strip out commas 
      //  val = val.replace(/,/g, "");
       //strip out all non-numeric characters (leaving decimal)  
       let totalLength = val.length;
       let only2DecimalsCount = val.indexOf(".");
      
        if (only2DecimalsCount >= 0 && totalLength > (only2DecimalsCount + 2)) {
         val = val.substring(0, (only2DecimalsCount + 3));
         input.patchValue(val);}
               if (this.pressureUnit === "PSI") {
                   //manual
                   if (event.target.name == "ulPressureSetPoint") {
                       if(this.changedScaling == '0')doubleDigit();
                       if(this.changedScaling == '1')fourDigit();
                    }
                   if (this.changedScaling == '0') {
                     if(event.target.name == "highPressureThreshold"||event.target.name=='maxPressureSetpoint')tripleDigit();else doubleDigit();
                    }
                   if(this.changedScaling == '1' )fourDigit();
               } else if (this.pressureUnit === "BAR") {
                 //manual
                    if (event.target.name == "ulPressureSetPoint") {
                      return this.changedScaling == '0' ? singleDigit() : tripleDigit()
                    }
                  if(this.changedScaling  =='0')singleDigit();
                  if(this.changedScaling =='1' &&event.target.name=='maxPressureSetpoint')tripleDigit();
                  if(this.changedScaling == '1' &&event.target.name == "highPressureThreshold" )tripleDigit()
                  if(this.changedScaling == '1'&&!(event.target.name=='maxPressureSetpoint')&&!(event.target.name=='highPressureThreshold'))doubleDigit();
                 
               } else if (this.pressureUnit === "kPa") {
                 //manual
                 if (event.target.name == "ulPressureSetPoint") {
                   return this.changedScaling == '0' ? tripleDigit() : fiveDigit()
                 }
                  if(this.changedScaling=='0'){
                    tripleDigit()
                  } 
                  if(event.target.name=="highPressureThreshold"||event.target.name=="lowPressureThreshold") {
                       this.changedScaling == '0' ? tripleDigit() : fiveDigit();
                   }else{ 
                      this.changedScaling == '0' ? tripleDigit : (event.target.name == "maxPressureSetpoint" ? fiveDigit() : fourDigit())
                   }
               }
             }
         }
  validationCheck(low,high ,min ,max,minl,maxl,unit){
  low=parseFloat(low);
  high=parseFloat(high)
  if(!(low<=min&&low>=minl))return "lesser"
    else if(!(high<=max&&high>=maxl))return "higher"
    else if(low>high)return "inbtw" 
    else if((high-low)<inputrange[`diff${unit.toLowerCase()}`]) return "diff"

 }        

 cmpErrMsg(val,lName,hName,lMin,lMax,hMin,hMax,unit,units){
    if(val=="lesser") return `${lName} range should be ${lMin } ${unit} to ${lMax} ${unit}`;
    if(val=="higher") return `${hName} range should be ${hMin}  ${unit} to ${hMax} ${unit}`;
    if(val=="inbtw") return `${lName} Range should be less than ${hName}`;
    if(val=="diff")  return `Minimum difference of ${hName} and ${lName} should be ${inputrange[`diff${units.toLowerCase()}`]} ${units}`;
  }

  errMsgShow(msg){
    const ele = this.aForm.nativeElement[this.focusField];
    if (ele) {
      ele.focus();
    }
    if(msg){
      return this.toast.error(msg, '', {
        timeOut: 3000
      });
    }
  }

  //To make common to all Units composing functions
  validationComposer(obj){
  const{lowPrSt,higPrSt,mnPrLmt,mxPrLmt,mnPrMx,mxPrmx,mnPrmn,mxPrmn,mnPlmtmx,mxPlmtmx,mnPlmtmn,mxPlmtmn,unit}=obj
  let msgPressSetPSI=this.validationCheck(lowPrSt, higPrSt,mnPrMx,mxPrmx,mnPrmn,mxPrmn,this.pressureUnit)
  
  let msgPressLmtPSI=this.validationCheck(mnPrLmt,mxPrLmt,mnPlmtmx,mxPlmtmx,mnPlmtmn,mxPlmtmn,this.pressureUnit)                           
  
  if(msgPressSetPSI){
    this.focusField = msgPressSetPSI=='lesser' ? 'lowSpeedPresSett' : 'highSpeedPresSett'
    this.errExist=true;
     return this.errMsgShow(this.cmpErrMsg(msgPressSetPSI,Names.lsps,Names.hsps,mnPrmn,mnPrMx,mxPrmn,mxPrmx,unit,unit))
    }
  else if(msgPressLmtPSI){
    this.focusField = msgPressLmtPSI=='lesser' ? 'minPressureLimit' : 'maxPressureLimit'
    this.errExist=true;
    return this.errMsgShow(this.cmpErrMsg(msgPressLmtPSI,Names.mnpl,Names.mxpl,mnPlmtmn,mnPlmtmx,mxPlmtmn,mxPlmtmx,unit,unit))  
  }

}   

  unitCheckValidation(){
    let unitChooser=this.changedScaling==1?15:1

    let dataObj={
      lowPrSt:this.recipeSettingForm.get('lowSpeedPresSett').value,
      higPrSt:this.recipeSettingForm.get('highSpeedPresSett').value,
      mnPrLmt:this.recipeSettingForm.get('minPressureLimit').value,
      mxPrLmt:this.recipeSettingForm.get('maxPressureLimit').value,
      mnPrMx:(inputrange["prsrOtpt_usPressureMin_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPrmx:(inputrange["prsrOtpt_usPressureMax_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mnPrmn:(inputrange["prsrOtpt_usPressureMin_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPrmn:(inputrange["prsrOtpt_usPressureMax_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mnPlmtmx:(inputrange["prsrOtpt_usPressureCalPtMin_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPlmtmx:(inputrange["prsrOtpt_usPressureCalPtMax_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mnPlmtmn:(inputrange["prsrOtpt_usPressureCalPtMin_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPlmtmn:(inputrange["prsrOtpt_usPressureCalPtMax_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      unit:this.pressureUnit,      
    }
    if(this.pressureUnit=="PSI"){
        this.validationComposer(dataObj)
    }
     else if(this.pressureUnit=="BAR"){
      this.validationComposer(dataObj)
          }
     else if (this.pressureUnit=="kPa"){
        this.validationComposer(dataObj)   
      } 
    
      if(!this.errExist){
        
      let lowlineSpeed=this.recipeSettingForm.get('lowLineSpeedSett').value;
      let highlineSpeed=this.recipeSettingForm.get('highLineSpeedSett').value
      let lnspdObj={
        lsMnMxm:inputrange.prsrOtpt_usLinespeedCalPtMin_max_mm,
        lsMxMxm:inputrange.prsrOtpt_usLinespeedCalPtMax_max_mm,
        lsMnMnm:inputrange.prsrOtpt_usLinespeedCalPtMin_min_mm,
        lsMxMnm:inputrange.prsrOtpt_usLinespeedCalPtMax_min_mm,
        lsMnMxf:inputrange.prsrOtpt_usLinespeedCalPtMin_max_ftm,
        lsMxMxf:inputrange.prsrOtpt_usLinespeedCalPtMax_max_ftm,
        lsMnMnf:inputrange.prsrOtpt_usLinespeedCalPtMin_min_ftm,
        lsMxMnf:inputrange.prsrOtpt_usLinespeedCalPtMax_min_ftm,
        unit:this.lineSpeedUnit,
      }

  //for m/mn
  let  lnspdMsgm  =this.validationCheck(parseFloat(lowlineSpeed),parseFloat(highlineSpeed),lnspdObj.lsMnMxm,lnspdObj.lsMxMxm, lnspdObj.lsMnMnm,lnspdObj.lsMxMnm,"mmin")
  //for ft/min
  let  lnspdmsgFt =this.validationCheck(parseFloat(lowlineSpeed),parseFloat(highlineSpeed),lnspdObj.lsMnMxf,lnspdObj.lsMxMxf,lnspdObj.lsMnMnf,lnspdObj.lsMxMnf,"mft")
  
  if(lnspdMsgm&&this.lineSpUnt==1){
    this.focusField = lnspdMsgm=='lesser' ? 'lowLineSpeedSett' : 'highLineSpeedSett'
    this.errExist=true;
    return this.errMsgShow(this.cmpErrMsg(lnspdMsgm,Names.llsp,Names.hlsp,lnspdObj.lsMnMnm,lnspdObj.lsMnMxm,lnspdObj.lsMxMnm,lnspdObj.lsMxMxm,lnspdObj.unit,"mmin"))
  }
  else this.errExist=false;
  
  if(lnspdmsgFt&&this.lineSpUnt==0){
    this.focusField = lnspdmsgFt=='higher' ? 'highLineSpeedSett' : 'lowLineSpeedSett'
    this.errExist=true;
   return this.errMsgShow(this.cmpErrMsg(lnspdmsgFt,Names.llsp,Names.hlsp,lnspdObj.lsMnMnf,lnspdObj.lsMnMxf,lnspdObj.lsMxMnf,lnspdObj.lsMxMxf,lnspdObj.unit,"mft"))
  }
  else this.errExist=false;
   
      }

   if(!this.errExist){
      return false;
    }else{
      return true;
    }
    
  }
  

}




  
export const Names={
  llsp:"Low Line Speed Pressure",
  hlsp:"High Line Speed Pressure",
  mxpl:"Maximum Pressure Limit",
  mnpl:"Minimum Pressure Limit",
  lsps:"Low Speed Pressure Setting",
  hsps:"High Speed Pressure Setting",
}

      
