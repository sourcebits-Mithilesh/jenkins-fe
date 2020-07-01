import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/shared/confirm-equal-validator.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'nordson-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPassword: FormGroup;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_button_reset: Boolean = false;
  show_eye_reset: Boolean = false;
  isValid:Boolean;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.resetPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      cnfpassword: ['',Validators.required]
    },{validators:MustMatch('password','cnfpassword')});
  }


  get f() {
    this.isValid=this.resetPassword.valid?true:false;   
    return this.resetPassword.controls;
  }

  newPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  repeatPassword() {
    this.show_button_reset = !this.show_button_reset;
    this.show_eye_reset = !this.show_eye_reset;
  }
  onSubmit() {
    const token = this.route.snapshot.params.token;
    const formData = {
      pwd: this.resetPassword.value.password,
      cnfpwd: this.resetPassword.value.cnfpassword
    };
    this.userService.changePassword(formData, token).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.toaster.success('Password changed successfully', '', {
            timeOut: 3000
          });
          this.router.navigate(['/login']);
        }
        else if (data.Status =='Failed'){
          this.toaster.error(data.message, '', {
            timeOut: 3000
          });
        }
      },
      (err: any) => {
        console.log('err failed', err);
        if(err.error.Status==='Failed'){
          console.log('Failed')
          this.toaster.error('Cannot change the password with same link ', '', {
            timeOut: 3000
          });
        }
      }
    );
  }
}
