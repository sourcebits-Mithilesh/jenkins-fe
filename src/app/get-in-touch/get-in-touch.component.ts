import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MustMatch} from '../shared/confirm-equal-validator.directive';
@Component({
  selector: 'nordson-get-in-touch',
  templateUrl: './get-in-touch.component.html',
  styleUrls: ['./get-in-touch.component.css']
})
export class GetInTouchComponent implements OnInit {
  contactUsForm: FormGroup;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService, ) { }

  ngOnInit() {
    this.contactUsForm = this.fb.group(
      {
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required
        ]
      ],
      confirmEmail: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      cc: ['']
    }, {
      validator: MustMatch('email', 'confirmEmail')
    });
  }
  get f(){
    return this.contactUsForm.controls;
  }
  onSubmit() {
    const formValue = this.contactUsForm.getRawValue();
    let formdata = {
      'name': formValue.name,
      'email': formValue.email,
      'message': formValue.message,
      'cc': formValue.cc == true ? 1 : 0
    }
    this.authService.submitContactData(formdata).subscribe(
      (data: any) => {
        if (data.status) {
          this.contactUsForm.markAsPristine();
          this.toaster.success('Message sent succesfully', '', {
            timeOut: 3000
          });
         this.contactUsForm.reset();
        }
      },
      err => {
        console.log('err profile', err);
      }
    );
  }
}
