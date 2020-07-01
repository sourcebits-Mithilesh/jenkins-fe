import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { TemperatureSettingsService } from '../../temperature-settings.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { environment } from 'src/environments/environment';
import { AnimationStyleNormalizer } from '@angular/animations/browser/src/dsl/style_normalization/animation_style_normalizer';
import { NotificationService } from '../../toastr-notification/toastr-notification.service';
import { UserService } from 'src/app/user.service';
import { inputrange } from 'src/config/inputrange';
import { ToastrService } from 'ngx-toastr';
import { accessType } from '../access-type-check';
import { LanguageFilterPipe } from 'src/app/share/languageFilter.pipe';
import { LanguageService } from 'src/app/share/language.service';

@Component({
  selector: 'nordson-temperature-settings',
  templateUrl: './temperature-settings.component.html',
  styleUrls: ['./temperature-settings.component.css']
})
export class TemperatureSettingsComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  focusField:string;
  smartMeltValue: any;
  heatersOnStartupValue: any;
  autoStandbyEnableValue: any;
  autoExitStandbyEnableValue: any;
  blReadyDelayEnableValue: any;
  TempUnits: any;
  SmartMeltEnable: boolean;
  SmartMeltTime: any;
  heaterOnStartup: any;
  OTDelta: any;
  UTDelta: any;
  StandbyDelta: any;
  AutoStandbyEnable: any;
  AutoStandbySource: any;
  AutoStandbyTime: any;
  AutoHeatersOffTime: any;
  AutoExitStandbyEnable: any;
  AutoExitStandbyTime: any;
  blReadyDelayEnable: any;
  ReadyInterlockDelay: any;
  private url = environment.BASE_URI;
  tempSettingForm: FormGroup;
  init: any;
  accessType: any;
  errorMsg: string;
  AutoHeatersOffEnable: any;
  overTempmin: number;
  overTempmax: number;
  underTempmin: number;
  underTempmax: number;
  tempSetBackmin: number;
  tempSetBackmax: number;
  load: boolean = false;
  valueLanguage: boolean = true;
  // pumpStatusTest= false
  constructor(
    private fb: FormBuilder,
    private authSerice: AuthService,
    private temperatureSettingsService: TemperatureSettingsService,
    private flash: NgFlashMessageService,
    private _notificationservice: NotificationService,
    private userService: UserService,
    private toastr: ToastrService,
    private languageFilterPipe: LanguageFilterPipe,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    });
    this.tempSettingForm = this.fb.group({
      SmartMeltEnable: [''],
      SmartMeltTime: [
        '',
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.min(inputrange.smart_melt_time_min),
          Validators.max(inputrange.smart_melt_time_max)
        ]
      ],
      heaterOnStartup: [''],
      OTDelta: [
        '',
        [
          Validators.required
          // Validators.min(inputrange.over_temperature_threshold_min),
          // Validators.max(inputrange.over_temperature_threshold_max)
        ]
      ],
      UTDelta: [
        '',
        [
          Validators.required
          // Validators.min(inputrange.under_temperature_threshold_min),
          // Validators.max(inputrange.under_temperature_threshold_max)
        ]
      ],
      StandbyDelta: [
        '',
        [
          Validators.required
          // Validators.min(inputrange.temperature_setback_min),
          // Validators.max(inputrange.temperature_setback_max)
        ]
      ],
      AutoStandbyEnable: [''],
      AutoStandbySource: [''],
      AutoStandbyTime: [
        '',
        [
          Validators.required,
          Validators.min(inputrange.auto_standby_time_min),
          Validators.max(inputrange.auto_standby_time_max)
        ]
      ],
      AutoHeatersOffTime: [
        '',
        [
          Validators.required,
          Validators.min(inputrange.auto_heaters_off_time_min),
          Validators.max(inputrange.auto_heaters_off_time_max)
        ]
      ],
      AutoExitStandbyEnable: [''],
      AutoExitStandbyTime: [
        '',
        [
          Validators.required,
          Validators.min(inputrange.auto_exit_standby_time_min),
          Validators.max(inputrange.auto_exit_standby_time_max)
        ]
      ],
      blReadyDelayEnable: [''],
      ReadyInterlockDelay: [
        '',
        [
          Validators.required,

          Validators.min(inputrange.time_delay_min),
          Validators.max(inputrange.time_delay_max)
        ]
      ],
      AutoHeatersOffEnable: ['']
    });

    this.loadtempSettings();

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

  loadtempSettings() {
    this.authSerice.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.load = true;
          this.init = true;
          this.TempUnits =
            data.result.systemPreferences.TempUnits.Value === '0' ? 'C' : 'F';
          const SmartMeltEnable = JSON.parse(
            data.result.temperatureControll.SmartMeltEnable.Value
          );
          const SmartMeltTime =
            data.result.temperatureControll.SmartMeltTime.Value;
          const heaterOnStartup = JSON.parse(
            data.result.temperatureControll.heaterOnStartup.Value
          );
          const OTDelta = data.result.temperatureControll.OTDelta.Value;
          const UTDelta = data.result.temperatureControll.UTDelta.Value;
          const StandbyDelta =
            data.result.temperatureControll.StandbyDelta.Value;
          const AutoStandbyEnable = JSON.parse(
            data.result.temperatureControll.AutoStandbyEnable.Value
          );
          const AutoStandbySource = parseInt(
            data.result.temperatureControll.AutoStandbySource.Value
          );
          const AutoStandbyTime =
            data.result.temperatureControll.AutoStandbyTime.Value;
          const AutoHeatersOffTime =
            data.result.temperatureControll.AutoHeatersOffTime.Value;
          this.autoExitStandbyEnableValue = JSON.parse(
            data.result.temperatureControll.AutoExitStandbyEnable.Value
          );
          const AutoExitStandbyEnable = this.autoExitStandbyEnableValue;
          const AutoExitStandbyTime =
            data.result.temperatureControll.AutoExitStandbyTime.Value;
          const blReadyDelayEnable = JSON.parse(
            data.result.temperatureControll.blReadyDelayEnable.Value
          );
          const ReadyInterlockDelay =
            data.result.temperatureControll.ReadyInterlockDelay.Value;
          const AutoHeatersOffEnable = JSON.parse(
            data.result.temperatureControll.AutoHeatersOffEnable.Value
          );

          this.tempSettingForm.setValue({
            SmartMeltEnable: SmartMeltEnable,
            SmartMeltTime: SmartMeltTime,
            heaterOnStartup: heaterOnStartup,
            OTDelta: OTDelta,
            UTDelta: UTDelta,
            StandbyDelta: StandbyDelta,
            AutoStandbyEnable: AutoStandbyEnable,
            AutoStandbySource: AutoStandbySource,
            AutoStandbyTime: AutoStandbyTime,
            AutoHeatersOffTime: AutoHeatersOffTime,
            AutoExitStandbyEnable: AutoExitStandbyEnable,
            AutoExitStandbyTime: AutoExitStandbyTime,
            blReadyDelayEnable: blReadyDelayEnable,
            ReadyInterlockDelay: ReadyInterlockDelay,
            AutoHeatersOffEnable: AutoHeatersOffEnable
          });

          if (this.TempUnits === 'C') {
            this.overTempmin = inputrange.over_temperature_threshold_c_min;
            this.overTempmax = inputrange.over_temperature_threshold_c_max;

            this.underTempmin = inputrange.under_temperature_threshold_c_min;
            this.underTempmax = inputrange.under_temperature_threshold_c_max;

            this.tempSetBackmin = inputrange.temperature_setback_c_min;
            this.tempSetBackmax = inputrange.temperature_setback_c_max;
          } else if (this.TempUnits === 'F') {
            this.overTempmin = inputrange.over_temperature_threshold_f_min;
            this.overTempmax = inputrange.over_temperature_threshold_f_max;

            this.underTempmin = inputrange.under_temperature_threshold_f_min;
            this.underTempmax = inputrange.under_temperature_threshold_f_max;

            this.tempSetBackmin = inputrange.temperature_setback_f_min;
            this.tempSetBackmax = inputrange.temperature_setback_f_max;
          }
        }
      },
      err => {}
    );
  }

  get f() {
    const tempSettingForm = this.tempSettingForm.controls;
    if (tempSettingForm.ReadyInterlockDelay.errors != null) {
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Ready Time Delay should be ','READY_TIME_DELAY_SHOULD_BE') +
        inputrange.time_delay_min +
        ' to ' +
        inputrange.time_delay_max;
        this.focusField = 'ReadyInterlockDelay';
    } else if (tempSettingForm.AutoStandbyTime.errors != null) {
      // tslint:disable-next-line: max-line-length
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'System Setback Delay should be ','SYSTEM_SETBACK_DELAY_SHOULD_BE') +
        inputrange.auto_standby_time_min +
        ' to ' +
        inputrange.auto_standby_time_max;
        this.focusField = 'AutoStandbyTime';
    } else if (tempSettingForm.AutoHeatersOffTime.errors != null) {
      // tslint:disable-next-line: max-line-length
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Auto Heaters Off Time should be ','AUTO_HEATERS_OFF_TIME_SHOULD_BE') +
        inputrange.auto_heaters_off_time_min +
        ' to ' +
        inputrange.auto_heaters_off_time_max;
        this.focusField = 'AutoHeatersOffTime';
    } else if (tempSettingForm.AutoExitStandbyTime.errors != null) {
      // tslint:disable-next-line: max-line-length
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Auto Exit Time Delay should be ','AUTO_EXIT_TIME_DELAY_SHOULD_BE') +
        inputrange.auto_exit_standby_time_min +
        ' to ' +
        inputrange.auto_exit_standby_time_max;
        this.focusField = 'AutoExitStandbyTime';
    } else if (tempSettingForm.SmartMeltTime.errors != null) {
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'SmartMelt Time Delay should be ','SMARTMELT_TIME_DELAY_SHOULD_BE') +
        inputrange.smart_melt_time_min +
        ' to ' +
        inputrange.smart_melt_time_max;
        this.focusField = 'SmartMeltTime';
    }

    return this.tempSettingForm.controls;
  }

  toogleSmartMeltEnable(e) {
    if (e.checked === false) {
      this.tempSettingForm.get('SmartMeltEnable').patchValue(0);
    } else if (e.checked === true) {
      this.tempSettingForm.get('SmartMeltEnable').patchValue(1);
    }
  }
  toogleHose(e) {
    if (e.checked === false) {
      this.tempSettingForm.get('heaterOnStartup').patchValue(0);
    } else if (e.checked === true) {
      this.tempSettingForm.get('heaterOnStartup').patchValue(1);
    }
  }

  toogleAuto(e) {
    if (e.checked === false) {
      this.tempSettingForm.get('AutoStandbyEnable').patchValue(0);
    } else if (e.checked === true) {
      this.tempSettingForm.get('AutoStandbyEnable').patchValue(1);
    }
  }
  toogleAutoExit(e) {
    if (e.checked === false) {
      this.tempSettingForm.get('AutoExitStandbyEnable').patchValue(0);
    } else if (e.checked === true) {
      this.tempSettingForm.get('AutoExitStandbyEnable').patchValue(1);
    }
  }
  toogleReady(e) {
    if (e.checked === false) {
      this.tempSettingForm.get('blReadyDelayEnable').patchValue(0);
    } else if (e.checked === true) {
      this.tempSettingForm.get('blReadyDelayEnable').patchValue(1);
    }
  }
  toogleHeater(e) {
    if (e.checked === false) {
      this.tempSettingForm.get('AutoHeatersOffEnable').patchValue(0);
    } else if (e.checked === true) {
      this.tempSettingForm.get('AutoHeatersOffEnable').patchValue(1);
    }
  }

  onSubmit() {
    console.log(this.tempSettingForm.getRawValue());
    let validationStatus = true;

    let dataFormat = {
      SmartMeltEnable: this.tempSettingForm.get('SmartMeltEnable').value,
      SmartMeltTime: this.tempSettingForm.get('SmartMeltTime').value,
      heaterOnStartup: this.tempSettingForm.get('heaterOnStartup').value,
      UTDelta: this.tempSettingForm.get('UTDelta').value,
      OTDelta: this.tempSettingForm.get('OTDelta').value,
      StandbyDelta: this.tempSettingForm.get('StandbyDelta').value,
      AutoStandbyEnable: this.tempSettingForm.get('AutoStandbyEnable').value,
      AutoExitStandbyTime: this.tempSettingForm.get('AutoExitStandbyTime')
        .value,
      AutoExitStandbyEnable: this.tempSettingForm.get('AutoExitStandbyEnable')
        .value,
      AutoHeatersOffTime: this.tempSettingForm.get('AutoHeatersOffTime').value,
      AutoStandbyTime: this.tempSettingForm.get('AutoStandbyTime').value,
      AutoStandbySource: this.tempSettingForm.get('AutoStandbySource').value,
      blReadyDelayEnable: this.tempSettingForm.get('blReadyDelayEnable').value,
      //TempUnits: this.TempUnits,
      // "ReadyInterlockDelay" : this.tempSettingForm.get('ReadyInterlockDelay').value,
      // "AutoStandbyTime": this.tempSettingForm.get('AutoStandbyTime').value,
      // "AutoStandbySource" : this.tempSettingForm.get('AutoStandbySource').value,
      ReadyInterlockDelay: this.tempSettingForm.get('ReadyInterlockDelay')
        .value,
      AutoHeatersOffEnable: this.tempSettingForm.get('AutoHeatersOffEnable')
        .value
    };
    if (
      !(
        this.overTempmin <= dataFormat.OTDelta &&
        this.overTempmax >= dataFormat.OTDelta
      )
    ) {
      // tslint:disable-next-line: max-line-length
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Over Temperature Threshold should be ','OVER_TEMPERATURE_THRESHOLD_SHOULD_BE') +
        this.overTempmin +
        ' to ' +
        this.overTempmax;
      validationStatus = false;
      this.focusField = 'otDelta';
    } else if (
      !(
        this.underTempmin <= dataFormat.UTDelta &&
        this.underTempmax >= dataFormat.UTDelta
      )
    ) {
      // tslint:disable-next-line: max-line-length
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Under Temperature Threshold should be ','UNDER_TEMPERATURE_THRESHOLD_SHOULD_BE') +
        this.underTempmin +
        ' to ' +
        this.underTempmax;
      validationStatus = false;
      this.focusField = 'utDelta';
    } else if (
      !(
        this.tempSetBackmin <= dataFormat.StandbyDelta &&
        this.tempSetBackmax >= dataFormat.StandbyDelta
      )
    ) {
      // tslint:disable-next-line: max-line-length
      this.errorMsg =
        this.languageFilterPipe.transform(this.valueLanguage,'Temperature Setback should be ','TEMPERATURE_SETBACK_SHOULD_BE') +
        this.tempSetBackmin +
        ' to ' +
        this.tempSetBackmax;
      validationStatus = false;
      this.focusField = 'StandbyDelta';
    }
    showFlashMessage: [''];
    //const formData = this.tempSettingForm.getRawValue();
    if (!this.tempSettingForm.valid || validationStatus === false) {
      const ele = this.aForm.nativeElement[this.focusField];
      if (ele) {
        ele.focus();
      }
      this.toastr.error(this.errorMsg, '', {
        timeOut: 3000
      });
    } else {
      this.tempSettingForm.markAsPristine();
      this.temperatureSettingsService
        .updateTempSettings(dataFormat)
        .subscribe((data: any) => {
          if (data.status === 'success') {
            this.toastr.success(
              this.languageFilterPipe.transform(this.valueLanguage,'Temperature Settings updated successfully','TEMP_SETTINGS_UPDATED_SUCCESS'),
              '',
              {
                timeOut: 3000
              }
            );
          }
        });
    }
  }
  preventCharacter(evt) {
    // if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
    //   evt.preventDefault();
    // }
  }
  preventalpha(event) {
    return this.authSerice.preventalpha(event);
  }
}
