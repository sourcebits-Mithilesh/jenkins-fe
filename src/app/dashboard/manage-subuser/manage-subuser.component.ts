import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/user.service';
import { Subuser } from 'src/app/model/subuser.modal';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'nordson-manage-subuser',
  templateUrl: './manage-subuser.component.html',
  styleUrls: ['./manage-subuser.component.css']
})
export class ManageSubuserComponent implements OnInit {
  showHide: boolean;
  subUser: boolean;
  users: Subuser;
  noSubUser: any;
  subuserForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private toaster: ToastrService
  ) {
    this.showHide = false;
  }

  cancel() {
    this.subUser = !this.subUser;
  }

  ngOnInit() {
    this.subuserForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', Validators.required, this.userService.getUserByEmail()],
      access: ['Read Only', Validators.required]
    });

    const { user_id } = this.authService.decodeToken();
    this.userService.getSubuser().subscribe(
      (data: any) => {
        if (data && data.Status === 'Success') {
          this.users = data.data;
        }
      },
      (err: Error) => {
        console.log('error', err.message);
      }
    );
  }

  changeShowStatus(id) {
    if (id) {
      this.showHide = !this.showHide;
      this.subuserForm = this.fb.group({
        full_name: ['abc', Validators.required],
        email: ['abc', Validators.required, this.userService.getUserByEmail()],
        access: ['Read Only', Validators.required]
      });
    }
  }

  close() {
    this.showHide = !this.showHide;
  }

  adduser() {
    this.subUser = !this.subUser;
  }

  onSubmit() {
    return this.authService.addSubUser(this.subuserForm.value).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.subUser = !this.subUser;
          this.ngOnInit();
          this.subuserForm.markAsPristine();
          this.toaster.success('Sub User Added Successfully', '', {
            timeOut: 3000
          });
        }
      },
      (err: Error) => {
        console.log('err', err.message);
      }
    );
  }
}
