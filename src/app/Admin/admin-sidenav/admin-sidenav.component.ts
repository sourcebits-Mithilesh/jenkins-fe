import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FlashserviceService } from '../../shared/flashservice.service';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/toastr-notification/toastr-notification.service';
import { CustomValidators } from 'ngx-custom-validators';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { ToastrService } from 'ngx-toastr';
import { SuperAdminDhasboardService } from "../../shared/super-admin-dhasboard.service";
import { forEach } from '@angular/router/src/utils/collection';
import { SideNavModal } from 'src/app/dashboard/dashboard-header/dashboard-header.component';



export interface DialogData { }
@Component({
  selector: 'nordson-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AdminSidenavComponent implements OnInit {
  isShown: boolean = false;
  norFilesCount: boolean = false;
  userRole: any;
  uploadForm: FormGroup;
  adminLimit:number;
  isDescriptionOnAdmin: boolean = false;
  isDescriptionOnLoadAdmin: boolean = false;
  uploadFormData: any;

  descriptionAdmin: string="";
  loadsidenavAdmin: boolean = false;
  activeCount:number = 0;
  constructor(
    private setup: SetupToolsService,
    private router: Router,
    private _notificationservice: NotificationService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private superAdmin: SuperAdminDhasboardService,
    private userService: UserService,
    public dialogRef: MatDialogRef<SideNavModal>,

  ) { }

  ngOnInit() {
    let userData = this.userService.setProfile()
    if(userData) {
        this.userRole = userData.data.user_type_id;
    }

    this.uploadForm = this.fb.group({
      norfile: [null]
    });

    this.setup.previousNorFileCount().subscribe(
      (data: any) => {
        if (data.status === 'Success' && data.count > 0) {
          this.norFilesCount = true;
        } else {
          this.norFilesCount = false;
        }
      },
      (err: any) => { }
    );

  }
  getAdminlist() {
    const formAdminList = {};
    this.superAdmin.adminList(formAdminList).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.activeCount= 0;
          // console.log(data.status.result);
          this.adminLimit = data.result.length;
          let adminListData = data.result;
          adminListData.forEach(element => {
            if(element.status == 1){
              this.activeCount++;
            }
          });
          if (this.activeCount > 14) {
            this.toaster.error('You have reached the maximum limit of adding 15 admins', '', {
              timeOut: 3000
            });
          } else {
            const dialogRef = this.dialog.open(AddAdmin, {
              width: '667px',
              height: '100%',
              panelClass: 'addadmin'
            });
      
            dialogRef.afterClosed().subscribe(result => {
              this.ngOnInit();
            });
          }
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  hide() {
    this.isShown = false;
    this.isDescriptionOnAdmin= false;
    this.isDescriptionOnLoadAdmin = false;
  }
  addAdmin(): void {
    this.getAdminlist();
  }
  
  openTechInviteModal(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(TechInviteModal, {
      width: '667px',
      height: '100%',
      panelClass: 'TechInviteModal'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  /*   setuptool functionality */

  createNorFile(formData) {
    this.setup.createNorFile(formData).subscribe(
      (data: any) => {
        if (data.status === true) {
          this.router.navigate(['settings/temp-zone']);
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );
  }

  createNorFileAdmin() {
    localStorage.removeItem('user_id')
    let formData = {
      norfile_description: this.descriptionAdmin
    };
    this.setup.createNorFileAdmin(formData).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          if(Object.keys(this.dialogRef).length != 0){
            this.dialogRef.close();
          }
          this.loadsidenavAdmin=true;
          this.authService.setNorId(data.nor_id);
          this.router.navigate(['settings/temp-zone']);
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );
  }

  previousNorFile() {
    this.setup.previousNorFile({}).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          localStorage.removeItem('user_id')
          this.authService.setNorId(data.nor_id);
          this.router.navigate(['settings/temp-zone']);
        }
        else if(data.status==='fail'){
          this.toaster.error('No norfile loaded previously','',
          { timeOut: 3000 });
        }
      },
      (err: any) => {
        this.toaster.error('No norfile loaded previously','',
        { timeOut: 3000 });
        console.error('err', err);
      }
    );
  }
  addAdminDescriptionCreate(){
    this.isDescriptionOnAdmin=true
  }
  removeAdminDescriptionCreate() {
    this.isDescriptionOnAdmin = false;
    this.descriptionAdmin = '';
  }
  removeAdminDescriptionNor() {
    this.descriptionAdmin = '';
    this.isDescriptionOnLoadAdmin = false;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (fileExt === 'nor') {
        this.uploadForm.get('norfile').setValue(file);
        const formData = new FormData();
        formData.append('norfile', this.uploadForm.get('norfile').value);
        this.isDescriptionOnLoadAdmin = true;
        this.uploadFormData = formData;


        // this.authService.uploadNor(formData).subscribe(
        //   (data: any) => {
        //     if (data.status === true) {
        //       console.log('data',data)
        //       this.authService.setNorId(data.nor_id);
        //       this.router.navigate(['settings/temp-zone']);
        //     }
        //   },
        //   err => {
        //     console.log('err', err);
        //   }
        // );
      } else {
        this.toaster.error('please select file with .nor extension', '', {
          timeOut: 3000
        });
      }
    }
  }
  CreteNorFromUsbAdmin(){
     this.uploadFormData.append('norfile_description',this.descriptionAdmin);
    this.authService.uploadNor(this.uploadFormData).subscribe(
      (data: any) => {
        if (data.status === true) {
          localStorage.removeItem('user_id')
          this.authService.setNorId(data.nor_id);
          this.router.navigate(['settings/temp-zone']);
        }else{
          this.loadsidenavAdmin=false;
          this.isDescriptionOnLoadAdmin=false
          this.toaster.error(
            data.message,
            '',
            { timeOut: 3000 }
          );
        }
      },
      err => {
        console.log('err', err);
        this.loadsidenavAdmin=false;
        this.isDescriptionOnLoadAdmin=false
        this.toaster.error(
          'Please select a valid nor file with .nor extension',
          '',
          { timeOut: 3000 }
        );
      }
    );

  }
}
@Component({
  selector: 'nordson-dialog-addadmin',
  templateUrl: './add-admin.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AddAdmin implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddAdmin>,
    private authService: AuthService,
    private flash: FlashserviceService,
    private fb: FormBuilder,
    private userService: UserService,
    private toaster: ToastrService,
    private superAdmin: SuperAdminDhasboardService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  inviteAdminForm: FormGroup;
  adminUser: boolean;
  ngOnInit() {
    this.inviteAdminForm = this.fb.group({
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
      ]
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.inviteAdminForm.controls;
  }
  onNoClick() {
    this.dialogRef.close();
    return false;
  }
  inviteAdmin() {
    this.adminUser = !this.adminUser;
  }
  onSubmit() {
    this.authService.inviteAdmin(this.inviteAdminForm.getRawValue()).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.adminUser = !this.adminUser;
          this.ngOnInit();
          this.inviteAdminForm.markAsPristine();
          this.dialogRef.close();
          setTimeout(() => {
            this.superAdmin.callAdminListToLoad();
          }, 1000);
          this.toaster.success('Invited Successfully', '', {
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
@Component({
  selector: 'nordson-admin',
  templateUrl: './tech-support-invite.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class TechInviteModal implements OnInit {
  profile: any;

  constructor(
    public dialogRef: MatDialogRef<TechInviteModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService,
    private flash: FlashserviceService,
    private fb: FormBuilder,
    private userService: UserService,
    private toaster: ToastrService // private Router: Router
  ) // private authService: AuthService,
  { }
  techSupportForm: FormGroup;
  techUser: boolean;
  ngOnInit() {
    this.techSupportForm = this.fb.group({
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
      ]
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.techSupportForm.controls;
  }

  onNoClick() {
    this.dialogRef.close();
    return false;
  }
  inviteTech() {
    this.techUser = !this.techUser;
  }
  onSubmit() {
    this.authService
      .inviteTechSupportUser(this.techSupportForm.getRawValue())
      .subscribe(
        (data: any) => {
          if (data.status === 'Success') {
            this.techUser = !this.techUser;
            this.ngOnInit();
            this.techSupportForm.markAsPristine();
            this.dialogRef.close();
            this.toaster.success('Invited Successfully', '', {
              timeOut: 3000
            });
          }
        },
        (err: Error) => {
          console.log('err', err.message);
        }
      );
  }
  closeModal(){
    if(Object.keys(this.dialogRef).length != 0){
      this.dialogRef.close();
    }
   }
}
