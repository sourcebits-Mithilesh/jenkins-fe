import { Component, OnInit } from '@angular/core';
import { MustMatch,NotEqualPassword} from 'src/app/shared/confirm-equal-validator.directive';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { AuthService } from '..//../auth.service';
import { ToastrService } from 'ngx-toastr';

import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material';

@Component({
  selector: 'nordson-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_button_reset: boolean = false;
  show_eye_reset: boolean = false;
  show_button_reset1: boolean;
  show_eye_reset1: boolean;
  changepasswordForm: FormGroup;
  errMessage: string;
  message: string;
  actionButtonLabel;
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 5000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  userRoal: any;
  disableBack:boolean=false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.changepasswordForm = this.fb.group(
      {
        oldpwd: ['', [Validators.required]],
        pwd: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64) ,
           ]
        ],
        cnfpassword: ['', [Validators.required]]
      },
      {
        validator: MustMatch('pwd', 'cnfpassword')
      }
    );

    let userData = this.userService.setProfile()
    if(userData) {
      this.userRoal = userData.data.user_type_id;
    }
    this.userService.getProfile()
    .subscribe((data:any)=>{
      if(data.data.admin_changed_pwd == 0 ){
        this.disableBack=true;
       }
       else  this.disableBack=false;
    })

  }

  get f() {
    return this.changepasswordForm.controls;
  }

  onSubmit() {
    const formData = {
      oldpwd: this.changepasswordForm.value.oldpwd,
      pwd: this.changepasswordForm.value.pwd
    };
    this.userService.changePassword1(formData).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.toaster.success(data.message, '', {
            timeOut: 3000
          });
          this.dashboardRoute();
        }
        else{
          this.toaster.error('Old Password is incorrect', '', {
            timeOut: 3000
          });
        }
      },
      (err: any) => {
        let config = new MatSnackBarConfig();
        config.verticalPosition = this.verticalPosition;
        config.horizontalPosition = this.horizontalPosition;
        config.duration = this.setAutoHide ? this.autoHide : 0;
        this.toaster.error('Old Password is incorrect', '', {
          timeOut: 3000
        });
      }
    );
    this.changepasswordForm.reset();
  }

  showPassword(id) {
    if (id === 'font-icon1') {
      this.show_button = !this.show_button;
      this.show_eye = !this.show_eye;
    }
    if (id === 'font-icon2') {
      this.show_button_reset = !this.show_button_reset;
      this.show_eye_reset = !this.show_eye_reset;
    }
    if (id === 'font-icon3') {
      this.show_button_reset1 = !this.show_button_reset1;
      this.show_eye_reset1 = !this.show_eye_reset1;
    }
  }

  dashboardRoute() {
    switch (this.userRoal) {
      case 0:
        this.router.navigate(['/dashboard']);
        break;
      case 1:
        this.router.navigate(['/superadmin/superadmin-dashboard']);
        break;
      case 2:
        this.router.navigate(['/Admin/admin-dashboard']);
        break;
      case 3:
        this.router.navigate(['/tech/tech-support']);
        break;
      case 4:
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
