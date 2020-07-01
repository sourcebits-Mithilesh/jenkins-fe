import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { PumpService } from 'src/app/pump.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';
import { MaintenanceService } from '../maintenance.service';

@Component({
  selector: 'nordson-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  maintenanceValue: any;
  maintenanceStatus: boolean;
  maintenanceForm: FormGroup;
  accessType: any;
  load = false;
  isMaintenanceTagExists: boolean = true;
  constructor(    
    private authService: AuthService,
    private pumpService: PumpService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private userService: UserService,
    private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if ((data.status = 'Success')) {
          this.authService.setNorId(data.result.nor_id);
          this.load=true;
          if(data.result.systemPreferences.MaintenanceEnable == undefined){
            this.isMaintenanceTagExists = false;
            this.maintenanceForm = this.fb.group({
            });
          }else{
            this.isMaintenanceTagExists = true;
            this.maintenanceValue =
            data.result.systemPreferences.MaintenanceEnable.Value == 0 ? false : true;
            this.maintenanceStatus = this.maintenanceValue;
            this.maintenanceForm = this.fb.group({
              toogleMaintenance: [this.maintenanceStatus]
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
  toogleMaintenance(e) {
    this.maintenanceStatus = e.checked;
    if (e.checked === true) {
      this.maintenanceForm.get('toogleMaintenance').patchValue(1);
    } else {
      this.maintenanceForm.get('toogleMaintenance').patchValue(0);
    }
  }
  onSubmit() {
    let dataFormat = {
      MaintenanceEnable: this.maintenanceForm.get('toogleMaintenance').value
    };
    this.maintenanceForm.markAsPristine();
    this.maintenanceService.updateMaintenance(dataFormat).subscribe(
      (data: any) => {
        if (data.status) {
          this.toast.success('Maintenance updated successfully', '', {
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
