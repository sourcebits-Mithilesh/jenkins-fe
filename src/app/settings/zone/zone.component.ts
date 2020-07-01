import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { TemzoneService } from 'src/app/shared/temzone.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { forEach } from '@angular/router/src/utils/collection';
import { accessType } from '../access-type-check';

@Component({
  selector: 'nordson-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {
  zoneNames;
  hoses;
  applicators;
  zonenameForm: FormGroup;
  accessType: any;
  load: boolean = false;

  constructor(
    private authService: AuthService,
    private tempService: TemzoneService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.zonenameForm = this.fb.group({
      //hose1: ['', Validators.required,Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$")],
      hose1: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose2: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose3: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose4: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose5: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose6: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose7: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose8: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose9: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      hose10: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app1: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app2: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app3: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app4: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app5: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app6: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app7: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app8: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app9: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ],
      app10: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.maxLength(60),
          Validators.pattern(
            "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$"
          )
        ]
      ]
    });

    this.authService.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
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
          for (let i = 1; i <= 10; i++) {
            this.zonenameForm.get(`hose${i}`).patchValue(hoseArryay[i - 1]);
            this.zonenameForm
              .get(`app${i}`)
              .patchValue(applicatorsArray[i - 1]);
            this.zonenameForm.get(`hose${i}`).disable();
            this.zonenameForm.get(`app${i}`).disable();
          }
        }
      },
      err => {
        console.log('zone error', err);
      }
    );

    let userData = this.userService.setProfile()
    if(userData) {
      this.load = true
      this.accessType = accessType.check(userData.data);
    }
  }

  editHose(i) {
    let index: any = parseInt(i.split('show_')[1], 10);
    let data = this.zonenameForm.get(`hose${index + 1}`);
    data.enable();
    const ele = document.getElementById(i);
    i = index;
    const ele2 = document.getElementById(index);
    ele.style.display = 'none';
    ele2.focus();
  }

  editAppl(i) {
    let index: any = parseInt(i.split('showapp_')[1], 10);
    let dataapp = this.zonenameForm.get(`app${index + 1}`);
    dataapp.enable();
    const eleapp = document.getElementById(i);
    i = index;
    const ele2app = document.getElementById('app' + index);
    eleapp.style.display = 'none';
    ele2app.focus();
  }

  onSubmit() {
    const formValue = this.zonenameForm.getRawValue();
    if (!this.zonenameForm.valid) {
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();  
      this.toast.error('Enter Valid Zone Name', '', {
        timeOut: 3000
      });
    } else {
      let applicators_hose = [];
      for (var key in formValue) {
        if (formValue.hasOwnProperty(key)) {
          var val = formValue[key];
          if(val)applicators_hose.push(val);
        }
      }

      let unique_hose = applicators_hose.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      });
      if (unique_hose.length != applicators_hose.length) {
        this.toast.error('Names cannot be same', '', {
          timeOut: 3000
        });
      } else {
        this.zonenameForm.markAsPristine();
        this.tempService.updateZoneNames(formValue).subscribe((data: any) => {
          if (data.status === 'success') {
            Object.keys(this.zonenameForm.controls).forEach(key => {
              this.zonenameForm.get(key).disable();
            });
            this.toast.success('Zone names updated successfully', '', {
              timeOut: 3000
            });

            this.hoses.map((value, key) => {
              let data = document.getElementById('show_' + key);
              data.style.display = 'block';
            });
            this.applicators.map((value, key) => {
              let dataapp = document.getElementById('showapp_' + key);
              dataapp.style.display = 'block';
            });
          }
        });
      }
    }
  }
}
