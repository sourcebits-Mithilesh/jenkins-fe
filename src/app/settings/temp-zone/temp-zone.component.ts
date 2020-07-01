import { inputrange } from 'src/config/inputrange';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Validators } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from '../access-type-check';
import { LanguageService } from 'src/app/share/language.service';
import { LanguageFilterPipe } from 'src/app/share/languageFilter.pipe';

@Component({
  selector: 'nordson-temp-zone',
  templateUrl: './temp-zone.component.html',
  styleUrls: ['./temp-zone.component.css'],
  providers: [
    LanguageFilterPipe
]
})
export class TempZoneComponent implements OnInit {
  tempzoneForm: FormGroup;
  disable = true;
  hoses;
  applicators;
  TempUnits: any;
  disable1: boolean;
  zoneNames;
  accessType;
  erroMsg: string;
  load: boolean = false;
  valueLanguage: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private languageService: LanguageService,
    private languageFilterPipe: LanguageFilterPipe
  ) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    });
    
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if (data) {
          this.authService.setNorId(data.result.nor_id);
          this.zoneNames = data.result.zoneNames;
          const hoseArryay = [
            this.zoneNames.Nm_Zone1A?this.zoneNames.Nm_Zone1A.Value:'',
            this.zoneNames.Nm_Zone2A?this.zoneNames.Nm_Zone2A.Value:'',
            this.zoneNames.Nm_Zone3A?this.zoneNames.Nm_Zone3A.Value:'',
            this.zoneNames.Nm_Zone4A?this.zoneNames.Nm_Zone4A.Value:'',
            this.zoneNames.Nm_Zone5A?this.zoneNames.Nm_Zone5A.Value:'',
            this.zoneNames.Nm_Zone6A?this.zoneNames.Nm_Zone6A.Value:'',
            this.zoneNames.Nm_Zone7A?this.zoneNames.Nm_Zone7A.Value:'',
            this.zoneNames.Nm_Zone8A?this.zoneNames.Nm_Zone8A.Value:'',
            this.zoneNames.Nm_Zone9A?(this.zoneNames.Nm_Zone9A?this.zoneNames.Nm_Zone9A.Value:''):'',
            this.zoneNames.Nm_Zone10A?(this.zoneNames.Nm_Zone10A?this.zoneNames.Nm_Zone10A.Value:''):''

          ];
          this.hoses = hoseArryay;
          
          const applicatorsArray = [
            this.zoneNames.Nm_Zone1B?this.zoneNames.Nm_Zone1B.Value:'',
            this.zoneNames.Nm_Zone2B?this.zoneNames.Nm_Zone2B.Value:'',
            this.zoneNames.Nm_Zone3B?this.zoneNames.Nm_Zone3B.Value:'',
            this.zoneNames.Nm_Zone4B?this.zoneNames.Nm_Zone4B.Value:'',
            this.zoneNames.Nm_Zone5B?this.zoneNames.Nm_Zone5B.Value:'',
            this.zoneNames.Nm_Zone6B?this.zoneNames.Nm_Zone6B.Value:'',
            this.zoneNames.Nm_Zone7B?this.zoneNames.Nm_Zone7B.Value:'',
            this.zoneNames.Nm_Zone8B?this.zoneNames.Nm_Zone8B.Value:'',
            this.zoneNames.Nm_Zone9B?(this.zoneNames.Nm_Zone9B?this.zoneNames.Nm_Zone9B.Value:''):'',
            this.zoneNames.Nm_Zone10B?(this.zoneNames.Nm_Zone10B?this.zoneNames.Nm_Zone10B.Value:''):'',

          ];
          this.applicators = applicatorsArray;
          const SetpointTempZone = data.result.tempZoneControll.tempControll;
          const zoneControl = data.result.tempZoneControll.zoneControll;
          this.TempUnits =
            data.result.systemPreferences.TempUnits.Value === '0' ? 'C' : 'F';
          this.tempzoneForm = this.fb.group({
            globalSetPoint: [''],
            manifold: [
              {
                value: SetpointTempZone.SetpointTempZone1.Value,
                disabled: zoneControl.ZoneControl1.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            grid: [
              {
                value: SetpointTempZone.SetpointTempZone0.Value,
                disabled: zoneControl.ZoneControl0.Value === '1' ? false : true
              },
              [Validators.required]
            ],

            hose1: [
              {
                value: SetpointTempZone.SetpointTempZone2.Value,
                disabled: zoneControl.ZoneControl2.Value === '1' ? false : true
              },
              [Validators.required]
            ],

            hose2: [
              {
                value: SetpointTempZone.SetpointTempZone3.Value,
                disabled: zoneControl.ZoneControl3.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            hose3: [
              {
                value: SetpointTempZone.SetpointTempZone4.Value,
                disabled: zoneControl.ZoneControl4.Value === '1' ? false : true
              },
              [Validators.required, Validators.min(40), Validators.max(232)]
            ],
            hose4: [
              {
                value: SetpointTempZone.SetpointTempZone5.Value,
                disabled: zoneControl.ZoneControl5.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            hose5: [
              {
                value: SetpointTempZone.SetpointTempZone6.Value,
                disabled: zoneControl.ZoneControl6.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            hose6: [
              {
                value: SetpointTempZone.SetpointTempZone7.Value,
                disabled: zoneControl.ZoneControl7.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            hose7: [
              {
                value: SetpointTempZone.SetpointTempZone8.Value,
                disabled: zoneControl.ZoneControl8.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            hose8: [
              {
                value: SetpointTempZone.SetpointTempZone9.Value,
                disabled: zoneControl.ZoneControl9.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            hose9: [
              {
                value: SetpointTempZone.SetpointTempZone18?SetpointTempZone.SetpointTempZone18.Value:0,
                disabled: zoneControl.ZoneControl18?(zoneControl.ZoneControl18.Value === '1' ? false : true):false
              },
              [Validators.required]
            ],
            hose10: [
              {
                value: SetpointTempZone.SetpointTempZone19?SetpointTempZone.SetpointTempZone19.Value:0,
                disabled: zoneControl.ZoneControl19?(zoneControl.ZoneControl19.Value === '1' ? false : true):false
              },
              [Validators.required]
            ],

            applicator1: [
              {
                value: SetpointTempZone.SetpointTempZone10.Value,
                disabled: zoneControl.ZoneControl10.Value === '1' ? false : true
              },
              [Validators.required]
            ],

            applicator2: [
              {
                value: SetpointTempZone.SetpointTempZone11.Value,
                disabled: zoneControl.ZoneControl11.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            applicator3: [
              {
                value: SetpointTempZone.SetpointTempZone12.Value,
                disabled: zoneControl.ZoneControl12.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            applicator4: [
              {
                value: SetpointTempZone.SetpointTempZone13.Value,
                disabled: zoneControl.ZoneControl13.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            applicator5: [
              {
                value: SetpointTempZone.SetpointTempZone14.Value,
                disabled: zoneControl.ZoneControl14.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            applicator6: [
              {
                value: SetpointTempZone.SetpointTempZone15.Value,
                disabled: zoneControl.ZoneControl15.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            applicator7: [
              {
                value: SetpointTempZone.SetpointTempZone16.Value,
                disabled: zoneControl.ZoneControl16.Value === '1' ? false : true
              },
              [Validators.required]
            ],

            applicator8: [
              {
                value: SetpointTempZone.SetpointTempZone17.Value,
                disabled: zoneControl.ZoneControl17.Value === '1' ? false : true
              },
              [Validators.required]
            ],
            applicator9: [
              {
                value: SetpointTempZone.SetpointTempZone20?SetpointTempZone.SetpointTempZone20.Value:0,
                disabled: zoneControl.ZoneControl20?(zoneControl.ZoneControl20.Value === '1' ? false : true):false
              },
              [Validators.required]
            ],
            applicator10: [
              {
                value: SetpointTempZone.SetpointTempZone21?SetpointTempZone.SetpointTempZone21.Value:0,
                disabled: zoneControl.ZoneControl21?(zoneControl.ZoneControl21.Value === '1' ? false : true):false
              },
              [Validators.required]
            ],

            toogle1: [parseInt(zoneControl.ZoneControl2.Value)],
            toogle2: [parseInt(zoneControl.ZoneControl3.Value)],
            toogle3: [parseInt(zoneControl.ZoneControl4.Value)],
            toogle4: [parseInt(zoneControl.ZoneControl5.Value)],
            toogle5: [parseInt(zoneControl.ZoneControl6.Value)],
            toogle6: [parseInt(zoneControl.ZoneControl7.Value)],
            toogle7: [parseInt(zoneControl.ZoneControl8.Value)],
            toogle8: [parseInt(zoneControl.ZoneControl9.Value)],
            toogle9:  [parseInt(zoneControl.ZoneControl18?zoneControl.ZoneControl18.Value:'')],
            toogle10: [parseInt(zoneControl.ZoneControl19?zoneControl.ZoneControl19.Value:'')],


            app1: [parseInt(zoneControl.ZoneControl10.Value)],
            app2: [parseInt(zoneControl.ZoneControl11.Value)],
            app3: [parseInt(zoneControl.ZoneControl12.Value)],
            app4: [parseInt(zoneControl.ZoneControl13.Value)],
            app5: [parseInt(zoneControl.ZoneControl14.Value)],
            app6: [parseInt(zoneControl.ZoneControl15.Value)],
            app7: [parseInt(zoneControl.ZoneControl16.Value)],
            app8: [parseInt(zoneControl.ZoneControl17.Value)],
            app9: [parseInt(zoneControl.ZoneControl20?zoneControl.ZoneControl20.Value:'')],
            app10:[parseInt(zoneControl.ZoneControl21?zoneControl.ZoneControl21.Value:'')],


          });
      let hosesLength=zoneControl.ZoneControl21?10:8
          for (let i = 1; i <= hosesLength; i++) {
            if (this.TempUnits === 'C') {
              this.tempzoneForm
                .get('grid')
                .setValidators([
                  Validators.min(40),
                  Validators.max(204),
                  Validators.required
                ]);
              this.tempzoneForm
                .get('manifold')
                .setValidators([
                  Validators.min(40),
                  Validators.max(204),
                  Validators.required
                ]);
              this.tempzoneForm
                .get(`applicator${i}`)
                .setValidators([
                  Validators.min(40),
                  Validators.max(232),
                  Validators.required
                ]);
              this.tempzoneForm
                .get(`hose${i}`)
                .setValidators([
                  Validators.min(40),
                  Validators.max(232),
                  Validators.required
                ]);
            } else if (this.TempUnits === 'F') {
              this.tempzoneForm
                .get('grid')
                .setValidators([
                  Validators.min(100),
                  Validators.max(400),
                  Validators.required
                ]);
              this.tempzoneForm
                .get('manifold')
                .setValidators([
                  Validators.min(100),
                  Validators.max(400),
                  Validators.required
                ]);
              this.tempzoneForm
                .get(`applicator${i}`)
                .setValidators([
                  Validators.min(100),
                  Validators.max(450),
                  Validators.required
                ]);
              this.tempzoneForm
                .get(`hose${i}`)
                .setValidators([
                  Validators.min(100),
                  Validators.max(450),
                  Validators.required
                ]);
            }
          }
        }
      },
      err => {
        console.log('err', err);
      }
    );

    let userData = this.userService.setProfile()
    if(userData) {
      this.load = true
      this.accessType = accessType.check(userData.data);
    }
  }

  get f() {
    return this.tempzoneForm.controls;
  }

  toogleHose(e, i) {
    if (e.checked === false) {
      this.tempzoneForm.get(`toogle${i}`).patchValue(0);
      this.tempzoneForm.controls[`hose${i}`].disable();
    } else if (e.checked === true) {
      this.tempzoneForm.get(`toogle${i}`).patchValue(1);
      this.tempzoneForm.controls[`hose${i}`].enable();
    }
  }

  toogleApplicator(e, i) {
    if (e.checked === false) {
      this.tempzoneForm.get(`app${i}`).patchValue(0);
      this.tempzoneForm.controls[`applicator${i}`].disable();
    } else if (e.checked === true) {
      this.tempzoneForm.get(`app${i}`).patchValue(1);
      this.tempzoneForm.controls[`applicator${i}`].enable();
    }
  }
  onKey(event, type) {
    const typeVal = this.tempzoneForm.get(type).value;

    if (type == 'grid') {
      // this.tempzoneForm.patchValue({ manifold: typeVal })
      this.tempzoneForm.controls['manifold'].patchValue(typeVal);
      // this.tempzoneForm.controls['manifold'].setValue(typeVal)
    }
    if (type == 'manifold') {
      // this.tempzoneForm.patchValue({ grid: typeVal })
      // this.tempzoneForm.controls['grid'].setValue(typeVal)
      this.tempzoneForm.controls['grid'].patchValue(typeVal);
    }
  }
  onSubmit() {
    //if Global setpoint has value
    



    let gobalTempVal = this.tempzoneForm.get('globalSetPoint').value;
    if (gobalTempVal != null && gobalTempVal.toString().length >= 1) {
      if (gobalTempVal >= 0) {
        var globalSetPoint = {};
        for (const field in this.tempzoneForm.controls) {
          if (field.includes('hose') || field.includes('applicator')) {
            let globalsetval = this.tempzoneForm.get('globalSetPoint').value;
            if (this.TempUnits == 'C') {
              if (globalsetval > 232) {
                globalSetPoint[field] = '232';
              } else if (globalsetval < 40) {
                globalSetPoint[field] = '40';
              } else {
                globalSetPoint[field] = globalsetval;
              }
            } else {
              if (globalsetval > 450) {
                globalSetPoint[field] = '450';
              } else if (globalsetval < 100) {
                globalSetPoint[field] = '100';
              } else {
                globalSetPoint[field] = globalsetval;
              }
            }
          } else if (field.includes('grid') || field.includes('manifold')) {
            if (this.TempUnits == 'C') {
              if (this.tempzoneForm.get('globalSetPoint').value > 204) {
                globalSetPoint[field] = '204';
              } else if (this.tempzoneForm.get('globalSetPoint').value < 40) {
                globalSetPoint[field] = '40';
              } else {
                globalSetPoint[field] = this.tempzoneForm.get(
                  'globalSetPoint'
                ).value;
              }
            } else {
              if (this.tempzoneForm.get('globalSetPoint').value > 400) {
                globalSetPoint[field] = '400';
              } else if (this.tempzoneForm.get('globalSetPoint').value < 100) {
                globalSetPoint[field] = '100';
              } else {
                globalSetPoint[field] = this.tempzoneForm.get(
                  'globalSetPoint'
                ).value;
              }
            }
          } else {
            globalSetPoint[field] = this.tempzoneForm.get(field).value;
          }
        }
        this.dataSubmit(globalSetPoint);
      } else {
        let msg = 'Invalid Entry';
        this.toast.error(`${msg}`, '', {
          timeOut: 3000
        });
      }
    } else {
      const formValue = this.tempzoneForm.getRawValue();
      var errorKey: any = '';
      let err: boolean = false;
      errorKey = this.getErrorField();
      if (errorKey) {
        let fieldName: string;
        let toggleBtn: boolean = true;
        let toogleVal;
        if (errorKey.includes('hose')) {
          let indexLength: number = errorKey.length;
          let indexnum = errorKey.charAt(indexLength - 1);
          //changing charAt
          if(errorKey.includes('hose10')){
            fieldName=this.hoses[10-1]
            toogleVal = this.tempzoneForm.get('toogle10').value;
          }else{
            fieldName = this.hoses[parseInt(indexnum) - 1];
            toogleVal = this.tempzoneForm.get('toogle' + indexnum).value;
          }

        } else if (errorKey.includes('applicator')) {
          let indexLength: number = errorKey.length;
          let indexnum = errorKey.charAt(indexLength - 1);

           if(errorKey.includes('applicator10')){
            fieldName = this.applicators[10-1];
            toogleVal = this.tempzoneForm.get('app10').value;
             }else{    
            fieldName = this.applicators[parseInt(indexnum) - 1];
            toogleVal = this.tempzoneForm.get('app' + indexnum).value;
            }




        }else if(errorKey.includes('grid')){
          err = true;
          toggleBtn = false;
          // if(this.tempzoneForm.get('grid').value == null){
            this.toast.error(
              this.languageFilterPipe.transform(this.valueLanguage,'Enter Valid Tank Set Points','TANK_VALID_MSG'),
              '',
              {
                timeOut: 3000
              }
            );
          // }
        } else {
          fieldName = errorKey;
        }
        if (toogleVal == 0) {
          toggleBtn = false;
        }
        if (toggleBtn == true) {
          err = true;
          this.toast.error(
            `${fieldName.charAt(0).toUpperCase() + fieldName.substring(1)} ${
              this.erroMsg
            }`,
            '',
            {
              timeOut: 3000
            }
          );
        }
      }

      if (!err) {
        var result = {};
        for (const field in this.tempzoneForm.controls) {
          let toggleStatus = 1;
          if (field.includes('hose')) {
            let indexLength: number = field.length;
            let indexnum = field.charAt(indexLength - 1);

            if(field.includes('hose10')){
              toggleStatus = this.tempzoneForm.get('toogle10').value;
            }else{
              toggleStatus = this.tempzoneForm.get('toogle' + indexnum).value;
            }
          } else if (field.includes('applicator')) {
            let indexLength: number = field.length;
            let indexnum = field.charAt(indexLength - 1);
            // toggleStatus = this.tempzoneForm.get('app' + indexnum).value;
            if(field.includes('applicator10')){
              toggleStatus = this.tempzoneForm.get('app10').value;
              }else{
                toggleStatus = this.tempzoneForm.get('app' + indexnum).value;
              }
          }
          // if (toggleStatus == 1) {
            result[field] = this.tempzoneForm.get(field).value;
          // }
        }
        this.dataSubmit(result);
      }
    }
    if(this.tempzoneForm.invalid)
    {  
      // Got focus to the error field
    let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
    invalidFields[1].focus();  

    }

  }
  dataSubmit(formData) {
    this.tempzoneForm.markAsPristine();
    this.authService.updateXml(formData, this.TempUnits).subscribe(
      (data: any) => {
        if (data) {
          this.toast.success( this.languageFilterPipe.transform(this.valueLanguage,'Temperature Zones updated successfully','TEMP_ZONE_UPDATED_SUCESS'), '', {
            timeOut: 3000
          });
          this.ngOnInit();
        }
      },
      (err: Error) => {
        console.log('error xml Data', err);
      }
    );
  }
  getErrorField() {
    let keyvalue: string = '';
    let errorValidation: string = '';
    this.erroMsg = '';
    Object.keys(this.tempzoneForm.controls).forEach(key => {
      if (
        key.includes('hose') ||
        key.includes('applicator') ||
        key.includes('grid') ||
        key.includes('manifold')
      ) {
        //Error messages
        let toggleBtn: boolean = true;
        const tempzoneC = parseInt(this.tempzoneForm.get(key).value);

        let toogleVal;
        if (key.includes('hose')) {
          let indexLength: number = key.length;
          
          let indexnum = key.charAt(indexLength - 1);
          if(key.includes('hose10')){
            toogleVal = this.tempzoneForm.get('toogle10').value;
          }else{
            toogleVal = this.tempzoneForm.get('toogle' + indexnum).value;
          }
        } else if (key.includes('applicator')) {
          let indexLength: number = key.length;
   
          let indexnum = key.charAt(indexLength - 1);
          if(key.includes('applicator10')){
          toogleVal = this.tempzoneForm.get('app10').value;
          }else{
            toogleVal = this.tempzoneForm.get('app' + indexnum).value;
          }
        } else if (key.includes('grid') || key.includes('manifold')) {
          toogleVal = 1;
        }

        if (key.includes('hose') || key.includes('applicator')) {
          if (this.TempUnits == 'C' && toggleBtn == true) {
            if (
              !(
                tempzoneC >= inputrange.applicator_c_min &&
                tempzoneC <= inputrange.applicator_c_max
              )
            ) {
              errorValidation = this.languageFilterPipe.transform(this.valueLanguage,'value should be between 40 to 232','ERR_40_TO_232');
            }
          } else if (this.TempUnits === 'F' && toggleBtn == true) {
            if (
              !(
                tempzoneC >= inputrange.applicator_k_min &&
                tempzoneC <= inputrange.applicator_k_max
              )
            ) {
              errorValidation = this.languageFilterPipe.transform(this.valueLanguage,'value should be between 100 to 450','ERR_100_TO_450');
            }
          }
        } else if (key.includes('grid') || key.includes('manifold')) {
          if (this.TempUnits === 'F' && toggleBtn == true)
          {
            if ( !(tempzoneC < 100 && tempzoneC > 400 )) {
              errorValidation = this.languageFilterPipe.transform(this.valueLanguage,'value should be between 100 to 400','ERR_100_TO_400');
            }
          }else if (!(tempzoneC < 40 && tempzoneC > 204)) {
            errorValidation = this.languageFilterPipe.transform(this.valueLanguage,'value should be between 40 to 204','ERR_40_TO_204');
          }
        }
        if (toogleVal == 0) {
          toggleBtn = false;
        }
        if (
          !this.tempzoneForm.get(key).valid &&
          keyvalue == '' &&
          toogleVal == 1 &&
          toggleBtn == true &&
          this.erroMsg == '' &&
          errorValidation != ''
        ) {
          this.erroMsg = errorValidation;
          keyvalue = key;
        }
        if(key.includes('grid')){
          if(!this.tempzoneForm.get(key).value){
            this.erroMsg = this.languageFilterPipe.transform(this.valueLanguage,'Enter Valid Tank Set Points','TANK_VALID_MSG');
            keyvalue = key;
          }
        }

      }
    });
    return keyvalue;
  }
  preventalpha(event) {
    return this.authService.preventalpha(event);
  }
}
