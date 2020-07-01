import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { PumpService } from '../../pump.service';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from '../access-type-check';
import { LanguageService } from 'src/app/share/language.service';
import { LanguageFilterPipe } from 'src/app/share/languageFilter.pipe';

@Component({
  selector: 'nordson-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['./pump.component.css']
})
export class PumpComponent implements OnInit {
  pumpValue: any;
  pumpStatus: boolean;
  pumpForm: FormGroup;
  accessType: any;
  load = false;
  valueLanguage: boolean = true;

  constructor(
    private authService: AuthService,
    private pumpService: PumpService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserService,
    private languageService: LanguageService,
    private languageFilterPipe: LanguageFilterPipe
  ) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data=>{
      this.valueLanguage = !this.valueLanguage;
    })
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          this.authService.setNorId(data.result.nor_id);
          this.load=true;
          this.pumpValue =
            data.result.pumpControll.AutoPumpOnOff.Value == 0 ? false : true;
          this.pumpStatus = this.pumpValue;
          this.pumpForm = this.fb.group({
            tooglePump: [this.pumpStatus]
          });
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
  tooglePump(e) {
    this.pumpStatus = e.checked;
    if (e.checked === true) {
      this.pumpForm.get('tooglePump').patchValue(1);
    } else {
      this.pumpForm.get('tooglePump').patchValue(0);
    }
  }
  onSubmit() {
    let dataFormat = {
      AutoPumpOnOff: this.pumpForm.get('tooglePump').value
    };
    this.pumpForm.markAsPristine();
    this.pumpService.updatePump(dataFormat).subscribe(
      (data: any) => {
        if (data.status) {
          this.toast.success(this.languageFilterPipe.transform(this.valueLanguage,'Pump updated successfully','PUMP_UPDATED_SUCCESS'), '', {
            timeOut: 3000
          });
        }
      },
      (err: Error) => {
        console.log('error xml Data', err);
      }
    );
  }
}
