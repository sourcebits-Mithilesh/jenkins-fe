import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {}

@Component({
  selector: 'nordson-subuser',
  templateUrl: './subuser.component.html',
  styleUrls: ['./subuser.component.css']
})
export class SubuserComponent implements OnInit {
  users: any;
  id: number;
  usersLength: number;
  noSubUser: any;

  // toaster: any;
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.userService.getSubuser().subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          this.noSubUser = '';
          this.users = data.data;
          this.usersLength = this.users.length;
          this.id = data.data.id;
        } else {
          this.noSubUser = 'No Record Found!';
        }
      },
      (err: Error) => {
        console.log('error', err.message);
      }
    );
  }

  openDialog(): void {
    if (!(this.usersLength >= 15)) {
      const dialogRef = this.dialog.open(DailogAddSubuser, {
        width: '667px',
        height: '100%',
        panelClass: 'mataddsubuser',
        disableClose: true,
        maxWidth: '100%',
      });
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    } else {
      this.toaster.error('Maxium user limit is 15', '', {
        timeOut: 3000
      });
    }
  }

  openDialog1(id): void {
    const dialogRef = this.dialog.open(DailogEditSubuser, {
      width: '700px',
      height: '100%',
      panelClass: 'mateditsubuser',
      id,
      disableClose: true,
      maxWidth: '100%',

    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}

@Component({
  selector: 'nordson-dialog-add-subuser',
  templateUrl: './dialog-add-subuser.html',
  styleUrls: ['./subuser.component.css']
})
export class DailogAddSubuser implements OnInit {
  subuserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DailogAddSubuser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private flash: NgFlashMessageService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.subuserForm = this.fb.group({
      full_name: [
        '',
        [
          Validators.required,
          Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")
        ]
      ],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email]),
        this.userService.getUserByEmail()
      ],
      access_type: ['1', [Validators.required]]
    });
  }

  get f() {
    return this.subuserForm.controls;
  }

  onSubmit() {
    const formData = this.subuserForm.getRawValue();
    this.userService.createSubuser(formData).subscribe(
      (data: any) => {
        // this.flash.showFlashMessage({
        //   messages: ['Sub User Added Successfully '],
        //   dismissible: true,
        //   timeout: 5000,
        //   type: 'success'
        // });
        this.toaster.success('Sub User Added Successfully', '', {
          timeOut: 3000
        });

        this.dialogRef.close();
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }

  onNoClick() {
    this.dialogRef.close();
    return false;
  }
}

@Component({
  selector: 'nordson-dialog-edit-subuser',
  templateUrl: './dialog-Edit-subuser.html',
  styleUrls: ['./subuser.component.css']
})
export class DailogEditSubuser implements OnInit {
  subuser: any;
  editSubUserForm: FormGroup;
  disabled: boolean;
  editEmail: string;
  emailError: boolean = false;
  subUserId=0;
  constructor(
    public dialogRef: MatDialogRef<DailogEditSubuser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private flash: NgFlashMessageService
  ) {}

  onNoClick() {
    this.dialogRef.close();
    return false;
  }

  ngOnInit() {
    this.editSubUserForm = this.fb.group({
      full_name: [
        '',
        [
          Validators.required,
          Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")
        ]
      ],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      access_type: ['']
    });
    const subuserId = this.dialogRef.id;
    this.userService.editSubuser(subuserId).subscribe(
      (data: any) => {
        if (data.Status) {
          this.subuser = data.data;
          this.subUserId = this.subuser.id;
          this.editEmail = this.subuser.email;
          console.log('email', this.editEmail);
          this.editSubUserForm.setValue({
            full_name: this.subuser.full_name,
            email: this.subuser.email,
            access_type: this.subuser.access_type === 0 ? '0' : '1'
          });
        }
      },
      err => {
        console.log('err', err);
      }
    );
  }

  get f() {
    return this.editSubUserForm.controls;
  }
  uniqueEmailValidation(eve) {
    //validate
    let email = eve.target.value;
    if (this.editEmail != email) {
      this.userService.validateEditEmailId(email,this.subUserId).subscribe(
        (data: any) => {
          if (data.status === 'Success') {
            this.emailError = false;
          } else {      
            this.emailError = true;
          }
        },
        (err: any) => {
          console.error('err', err);
        }
      );
    }
  }
  onSubmit() {
    this.editSubUserForm.markAsPristine();
    let formData = this.editSubUserForm.getRawValue();
    formData.user_id = this.dialogRef.id;
    this.userService.updateSubuser(formData).subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          this.flash.showFlashMessage({
            messages: ['Sub user Updated Successfully'],
            dismissible: true,
            timeout: 5000,
            type: 'success'
          });
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );

    this.toaster.success('Sub user Updated Successfully', '', {
      timeOut: 3000
    });
    this.dialogRef.close();
  }
}
