import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {}
import { AuthService } from '../../auth.service'
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {MustMatch} from '../../shared/confirm-equal-validator.directive';


@Component({
  selector: 'nordson-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  constructor(
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
  }

  openDialogContactUs(id): void {
    const dialogRef = this.dialog.open(DialogContactUs, {
      width: '700px',
      height: '100%',
      panelClass: 'matcontactus',
      id,
      // disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  
}

@Component({
  selector: 'nordson-footer-dialog',
  templateUrl: './dialog-contactUs.html',
  styleUrls: ['./footer.component.css']
})
export class DialogContactUs implements OnInit {
  contactUsForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<DialogContactUs>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick() {
    this.dialogRef.close();
    return false;
  }

  ngOnInit() {
    this.contactUsForm = this.fb.group(
      {
      name: ['', 
      [
        Validators.required,
        Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")
      ]
      ],
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
          this.dialogRef.close();
         this.contactUsForm.reset();
        }
      },
      err => {
        console.log('err profile', err);
      }
    );
  }

 
 
}
