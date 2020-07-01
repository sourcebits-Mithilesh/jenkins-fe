import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Validators } from '@angular/forms';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'nordson-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  forgetpassword: FormGroup;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private flash: NgFlashMessageService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.forgetpassword = this.fb.group({
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email])
      ]
    });
  }

  get f() {
    return this.forgetpassword.controls;
  }
// TODO Use shorthand in object literal like {email}
  onSubmit() {
    const email = this.forgetpassword.value.email;
    const formData = {
      email: email
    };

    // TODO Why we need timeout here if it really required take it from environment file
    this.userService.forgetPassword(formData).subscribe(
      (data: any) => {
        if (data.status === true) {
          // TODO Messages should come from environment files
          this.toaster.success('Please check the registered email', '', {
            timeOut: 3000
          });
          this.router.navigate(['/login']);
        }else{
          this.toaster.error(data.message, '', {
            timeOut: 3000
          });
        }
      },
      (err: Error) => {
        this.toaster.error('Email Id is either blocked/deleted or not registered', '', {
          timeOut: 3000
        });
      }
    );
  }
}
