import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { inputrange } from 'src/config/inputrange';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { FillService } from 'src/app/shared/fill.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from '../access-type-check';
import { LanguageFilterPipe } from 'src/app/share/languageFilter.pipe';
import { LanguageService } from 'src/app/share/language.service';
@Component({
  selector: 'nordson-fill',
  templateUrl: './fill.component.html',
  styleUrls: ['./fill.component.css']
})
export class FillComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  focusField:string;
  fillForm: FormGroup;
  data = ['MOD and Tank with Fill System',  'Tank Only'];
  selected: string = this.data[0];
  choice = '';
  init: any;
  accessType: number;
  errorMsg = 'Invalid Value';
  load: boolean = false;
  valueLanguage: boolean = true;
  disableBtn:boolean=false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private fillService: FillService,
    private toastr: ToastrService,
    private userService: UserService,
    private languageFilterPipe: LanguageFilterPipe,
    private languageService: LanguageService
  ) {}
  ngOnInit() {
    this.languageService.languageChange.subscribe(data =>{
      this.valueLanguage = !this.valueLanguage;
    })
    this.fillForm = this.fb.group({
      selectfill: [''],
      RefillAlarmTimeout: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(inputrange.alert_to_stop_delay_time_min),
          Validators.max(inputrange.alert_to_stop_delay_time_max)
        ])
      ],
      RefillEnable: [''],
      // RefillOverfillDelay: [
      //   '',
      //   Validators.compose([
      //     Validators.required,
      //     Validators.min(inputrange.alert_to_stop_delay_time_min),
      //     Validators.max(inputrange.alert_to_stop_delay_time_max)
      //   ])
      // ],
      RefillEnableLowLevelAlert: [
        '',
        Validators.compose([Validators.required])
      ],
      LidOpenAlertTimeout: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(inputrange.lid_open_alert_time_min),
          Validators.max(inputrange.lid_open_alert_time_max)
        ])
      ],
      LowLevelAlertThreshold: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(inputrange.low_level_threshold_min),
          Validators.max(inputrange.low_level_threshold_max)
        ])
      ],
      low: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(inputrange.low_level_alert_threshold_min),
          Validators.max(inputrange.low_level_alert_threshold_max)
        ])
      ],
      TargetFillLevel: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(inputrange.target_fill_level_min),
          Validators.max(inputrange.target_fill_level_max)
        ])
      ],
      LidOpenAlertEnable: [
        '',
        Validators.compose([
          
        ])
      ],
      MaxFillTime: [
        '',
        Validators.compose([
          Validators.required,
          Validators.min(inputrange.max_fill_time_min),
          Validators.max(inputrange.max_fill_time_max)
        ])
      ],
      EmptyStop: ['']

    });
    this.fillForm.controls['selectfill'].setValue(this.selected, {
      onlySelf: true
    });
    this.choice = this.selected;
    
    this.fillData();

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
  fillData() {
    this.auth.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.load = true;
          this.init = true;
          const fillData = data.result.fillControll;
          if (fillData) {
            const RefillAlarmTimeout = fillData.RefillAlarmTimeout.Value;
            const RefillEnable = fillData.RefillEnable.Value;
            // const RefillOverfillDelay = fillData.RefillOverfillDelay.Value;
            const RefillEnableLowLevelAlert =
              fillData.RefillEnableLowLevelAlert.Value;
            const LidOpenAlertTimeout = fillData.LidOpenAlertTimeout.Value;
            const LowLevelAlertThreshold =
              fillData.LowLevelAlertThreshold.Value;
            const TargetFillLevel = fillData.TargetFillLevel.Value;
            const LidOpenAlertEnable = fillData.LidOpenAlertEnable.Value;
            const MaxFillTime = fillData.MaxFillTime.Value;
            const EmptyStop =
              fillData.EmptyStop != undefined ? fillData.EmptyStop.Value : '';
            this.fillForm.patchValue({
              RefillAlarmTimeout: RefillAlarmTimeout,
              RefillEnable: parseInt(RefillEnable),
              // RefillOverfillDelay: RefillOverfillDelay,
              RefillEnableLowLevelAlert: parseInt(RefillEnableLowLevelAlert),
              LidOpenAlertTimeout: LidOpenAlertTimeout,
              LowLevelAlertThreshold: LowLevelAlertThreshold,
              low: LowLevelAlertThreshold,
              TargetFillLevel: TargetFillLevel,
              LidOpenAlertEnable: parseInt(LidOpenAlertEnable),
              MaxFillTime: MaxFillTime,
              EmptyStop: parseInt(EmptyStop)
         
            });
          }
        }
      },
      (err: Error) => {
        console.log('fill', err);
      }
    );
  }
  get f() {
    const fillControl=this.fillForm.controls;
    if(fillControl.RefillAlarmTimeout.dirty 
      || fillControl.RefillEnable.dirty
      || fillControl.RefillEnableLowLevelAlert.dirty
      || fillControl.LidOpenAlertTimeout.dirty
      || fillControl.LowLevelAlertThreshold.dirty
      || fillControl.low.dirty
      || fillControl.TargetFillLevel.dirty
      || fillControl.LidOpenAlertEnable.dirty
      || fillControl.MaxFillTime.dirty
      || fillControl.EmptyStop.dirty)
      {
        this.disableBtn=false;
      }
        else this.disableBtn=true;
    
    if (this.fillForm.controls.TargetFillLevel.errors != null) {
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Target Fill Level range should be ','TARGET_FILL_LEVEL_RANGE_SHOULD_BE') +
        inputrange.target_fill_level_min +
        ' to ' +
        inputrange.target_fill_level_max;
        this.focusField = 'TargetFillLevel';
    } else if (this.fillForm.controls.LowLevelAlertThreshold.errors != null) {
      this.errorMsg =
      this.languageFilterPipe.transform(this.valueLanguage,'Low Level Threshold range should be ', 'LOW_LEVEL_THRESHOLD_RANGE_SHOULD_BE') +
        inputrange.low_level_threshold_min +
        ' to ' +
        inputrange.low_level_threshold_max;
        this.focusField='LowLevelAlertThreshold'
    } else if (
      this.fillForm.controls.LidOpenAlertTimeout.errors != null ||
      this.fillForm.controls.LidOpenAlertTimeout.errors != null
    ) {
      this.errorMsg =
      this.languageFilterPipe.transform(this.valueLanguage,'Lid Open Alert Time range should be ','LID_OPEN_ALERT_TIME_RANGE_SHOULD_BE') +
        inputrange.lid_open_alert_time_min +
        ' to ' +
        inputrange.lid_open_alert_time_max;
        this.focusField='LidOpenAlertTimeout'
    } else if (this.fillForm.controls.MaxFillTime.errors != null) {
      this.errorMsg =
      this.languageFilterPipe.transform(this.valueLanguage,'Max Fill Time range should be ','MAX_FILL_TIME_RANGE_SHOULD_BE') +
        inputrange.max_fill_time_min +
        ' to ' +
        inputrange.max_fill_time_max;
        this.focusField='MaxFillTime'
    }  else if (this.fillForm.controls.low.errors != null) {
      this.errorMsg =
      this.languageFilterPipe.transform(this.valueLanguage,'Low Level Alert Threshold range should be','LOW_LEVEL_ALERT_THRESHOLD_RANGE_SHOULD_BE') +
        inputrange.low_level_alert_threshold_min +
        ' to ' +
        inputrange.low_level_alert_threshold_max;
        this.focusField='LowLevelAlertThreshold'
    }
    return this.fillForm.controls;
  }
  toogleHose(e, type) {
    if (e.checked === false) {
      switch (type) {
        case 'RefillEnableLowLevelAlert':
          this.fillForm.get('RefillEnableLowLevelAlert').patchValue(0);
          break;
        case 'EmptyStop':
          this.fillForm.get('EmptyStop').patchValue(0);
          break;
        case 'RefillEnableLowLevelAlert':
          this.fillForm.get('RefillEnableLowLevelAlert').patchValue(0);
          break;     
        case 'LidOpenAlertEnable':
          this.fillForm.get('LidOpenAlertEnable').patchValue(0);
          break;
        
        
        
      }
    } else if (e.checked === true) {
      switch (type) {
        case 'RefillEnableLowLevelAlert':
          this.fillForm.get('RefillEnableLowLevelAlert').patchValue(1);
          break;
        case 'EmptyStop':
          this.fillForm.get('EmptyStop').patchValue(1);
          break;
        case 'RefillEnableLowLevelAlert':
          this.fillForm.get('RefillEnableLowLevelAlert').patchValue(1);
          break;
        
        
        
        case 'LidOpenAlertEnable':
          this.fillForm.get('LidOpenAlertEnable').patchValue(1);
          break;
        
        
        
      }
    }
  }
  onSubmit() {
    const formValue = this.fillForm.getRawValue();
    let formData = {
      RefillAlarmTimeout: this.fillForm.getRawValue().RefillAlarmTimeout,
      RefillEnable: this.fillForm.getRawValue().RefillEnable,
      // RefillOverfillDelay: this.fillForm.getRawValue().RefillOverfillDelay,
      RefillEnableLowLevelAlert: this.fillForm.getRawValue()
        .RefillEnableLowLevelAlert,
      LidOpenAlertTimeout: this.fillForm.get('LidOpenAlertTimeout').value,
      LowLevelAlertThreshold: this.fillForm.getRawValue()
        .LowLevelAlertThreshold,
      low: this.fillForm.getRawValue().low,
      TargetFillLevel: this.fillForm.getRawValue().TargetFillLevel,
      LidOpenAlertEnable: this.fillForm.getRawValue().LidOpenAlertEnable,
      MaxFillTime: this.fillForm.getRawValue().MaxFillTime,
      EmptyStop: this.fillForm.getRawValue().EmptyStop
      
      
      
    };
    if (this.fillForm.valid === false) {
      const ele = this.aForm.nativeElement[this.focusField];
      if (ele) {
        ele.focus();
      }
      this.toastr.error(this.errorMsg, '', {
        timeOut: 3000
      });
    } else {
      this.fillForm.markAsPristine();
      this.fillService.updateFill(formData).subscribe((data: any) => {
        if (data.status === 'success') {
          this.toastr.success(this.languageFilterPipe.transform(this.valueLanguage,'Fill updated successfully','FILL_UPDATED_SUCCESS'), '', {
            timeOut: 3000
          });
        }
      });
    }
  }
  setValue(event) {
    if (event.isUserInput) {
      this.choice = event.source.value;
    }
  }
  preventalpha(event) {
    return this.auth.preventalpha(event);
  }
}
