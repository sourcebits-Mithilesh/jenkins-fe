import {
  Component,
  Inject,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SuperAdminDhasboardService } from 'src/app/shared/super-admin-dhasboard.service';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { FlashserviceService } from '../../shared/flashservice.service';
import { AdminDhasboardService } from 'src/app/shared/admin-dhasboard.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MustMatch } from 'src/app/shared/confirm-equal-validator.directive';

export interface DialogData { }
interface IServerResponse {
  items: string[];
  total: number;
}
@Component({
  selector: 'nordson-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {
  @Input('data') meals: string[] = [];
  asyncMeals: Observable<string[]>;
  adminList = [];
  user_status = ['Pending', 'Active', 'Blocked', 'Deleted'];
  full_name: any;
  userRoal: any;
  user: any;
  countries: any
  adminBlockedList: any[];
  adminActiveList: any[];

  constructor(
    public dialog: MatDialog,
    private superAdminServices: SuperAdminDhasboardService,
    private auth: AuthService,
    private http: HttpClient,
    private userService: UserService,
    private toaster: ToastrService
  ) {
  }

  ngOnInit() {
    localStorage.removeItem('nor_id')
    this.getCountries();

    let userData = this.userService.setProfile()
    if (userData) {
      this.full_name = userData.data.full_name;
      this.userRoal = userData.data.user_type_id
    }
    this.superAdminServices.callAdminList.subscribe(data => {
      this.getAdminList();
    });
  }

  getAdminList() {
    this.adminList = [];
    this.adminBlockedList = [];
    this.adminActiveList = [];
    const formAdminList = {};
    this.superAdminServices.adminList(formAdminList).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          // tslint:disable-next-line: no-var-keyword
          // tslint:disable-next-line: prefer-for-of
          for (var i = 0; i < data.result.length; i++) {
            let countryDetail = this.countries.find(country => country.name == data.result[i].country);
            countryDetail ? data.result[i].countryCode = '+' + countryDetail.code : '';
            if (data.result[i].status == 1) {
              this.adminActiveList.push(data.result[i]);
            } else {
              this.adminBlockedList.push(data.result[i]);
            }
          }
          this.adminList = this.adminActiveList.concat(this.adminBlockedList);
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }
  getCountries() {
    this.userService.getCountries().subscribe(
      (data: any) => {
        if (data.suceess == true) {
          this.countries = data.country
          this.getAdminList();
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }
  editUser(admin): void {
    const dialogRef = this.dialog.open(EditUser, {
      width: '667px',
      height: '100%',
      panelClass: 'addadmin',
      id: admin
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAdminList();
    });
    this.user = admin;
  }
}

@Component({
  selector: 'nordson-dialog-edituser',
  templateUrl: './edit-user.html'
})
export class EditUser implements OnInit {
  inputIsOn: boolean;
  adminUsr: any;
  updateAdminForm: FormGroup;
  user: any;
  adminuser_id: any;
  activeAdminCount: number = 0;
  countries:any;
  disablePhone:boolean=true
  constructor(
    public dialogRef: MatDialogRef<EditUser>,
    private userService: UserService,
    private fb: FormBuilder,
    private flash: FlashserviceService,
    private adminService: AdminDhasboardService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toaster: ToastrService,
    private superAdminServices: SuperAdminDhasboardService
  ) { }

  ngOnInit() {
    this.user = this.dialogRef.id;
    this.updateAdminForm = this.fb.group({
      full_name: [
        '',
        [
          Validators.required,
          Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")
        ]
      ],
      blockuser: [''],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      confirmemail: ['', [Validators.required]],
      country: ['', [Validators.required]],
      mobile_number: ['', [Validators.pattern(/^[1-9]\d{6,14}$/)]],
    }, {
      validator: MustMatch('email', 'confirmemail')
    });
    const adminId: any = this.dialogRef.id;
    // tslint:disable-next-line: curly
    if (this.user.status === 2)
      this.updateAdminForm.patchValue({
        blockuser: true
      });
    else {
      this.updateAdminForm.patchValue({
        blockuser: false
      });
    }
    this.getCountries()
    this.userService.editSubuser(adminId.id).subscribe(
      (data: any) => {
        if (data.Status) {
          this.adminUsr = data.data;
          this.adminuser_id = this.adminUsr.id
          this.updateAdminForm.patchValue({
            full_name: this.adminUsr.full_name,
            email: this.adminUsr.email,
            mobile_number: this.adminUsr.mobile_number,
            country: this.adminUsr.country
          });
          this.disablePhone=(this.adminUsr.country&&this.adminUsr.country!=null) ? false:this.disablePhone
        }
      },
      err => {
        console.log('err', err);
      }
    );
  }
  getCountries() {
    this.userService.getCountries().subscribe(
      (data: any) => {
        if (data.suceess == true) {
          this.countries = data.country
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }
  setCountryCode(event) {
    let countryDetail = this.countries.find(country => country.name == event);
    this.user.countryCode = '+'+countryDetail.code
    this.disablePhone= false
  }
  onNoClick() {
    this.dialogRef.close();
    return false;
  }

  get f() {
    return this.updateAdminForm.controls;
  }

  onSubmit() {
    let formData = this.updateAdminForm.getRawValue();
    formData.user_id = this.user.id;
    this.userService.updateAdmin(formData).subscribe(
      (data: any) => {
        if (data.Status === 200) {
          this.user.email = this.updateAdminForm.get('email').value;
          this.user.full_name = this.updateAdminForm.get('full_name').value;
          this.user.mobile_number = this.updateAdminForm.get(
            'mobile_number'
          ).value;
          this.user.country = this.updateAdminForm.get(
            'country'
          ).value;
          this.toaster.success('Saved Successfully', '', {
            timeOut: 3000
          });
          this.dialogRef.close();
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );
  }

  blockUser(user) {
    if (user.status === 1) {
      this.adminService.blockUser(user.id).subscribe(
        (data: any) => {
          if (data.Status === 200) {
            this.toaster.success('Admin Blocked Successfully', '', {
              timeOut: 3000
            });
            user.status = 2;
            setTimeout(() => {
              this.dialogRef.close();
            }, 1000);
          }
        },
        err => {
          console.error('err', err);
        }
      );
    } else if (user.status === 2) {
      const formAdminList = {};
      this.superAdminServices.adminList(formAdminList).subscribe(
        (data: any) => {
          if (data.status === 'success') {
            this.activeAdminCount = 0
            let adminListData = data.result;
            adminListData.forEach(element => {
              // tslint:disable-next-line: whitespace
              if (element.status == 1) {
                this.activeAdminCount++;
              }
            });
            // tslint:disable-next-line: whitespace
            if (this.activeAdminCount > 14) {
              if(this.updateAdminForm.value.blockuser){
                return;
              }
              this.toaster.error('You have reached the maximum limit of adding 15 admins', '', {
                timeOut: 3000
              });
              // tslint:disable-next-line: one-line
            } else {
              this.adminService.unBlockUser(user.id).subscribe(
                // tslint:disable-next-line: no-shadowed-variable
                (data: any) => {
                  if (data.Status === 200) {
                    this.toaster.success('Admin unblocked successfully ', '', {
                      timeOut: 3000
                    });
                    user.status = 1;
                    setTimeout(() => {
                      this.dialogRef.close();
                    }, 1000);
                  }
                },
                err => {
                  console.error('err', err);
                }
              );
            }
          }
        }, err => {
          console.error('err', err);
        });
    }
  }
}
