import {
  Component,
  OnInit,
  Inject,
  Input,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AdminDhasboardService } from 'src/app/shared/admin-dhasboard.service';
import { ExportToCsv } from 'export-to-csv';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'ngx-custom-validators';
import { RecipeService } from '../../recipe/recipe.service';
import { anyChanged } from '@progress/kendo-angular-common';
import { MustMatch } from 'src/app/shared/confirm-equal-validator.directive';
import { ToastrService } from 'ngx-toastr';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';


export interface DialogData { }
@Component({
  selector: 'nordson-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  usersCount: Number;
  searchText: string = '';
  recentSignups = [];
  pageNo: number;
  totalPages: number;
  user_status = ['Pending', 'Active', 'Blocked', 'Deleted'];
  @Input('data') meals: string[] = [];
  asyncMeals: Observable<any>;
  p: number = 1;
  total: number;
  loading: boolean;
  orderBy: string = 'DESC';
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private adminService: AdminDhasboardService,
    private auth: AuthService,
    private toaster: ToastrService
  ) { }

  sortOptions = [
    { value: 0, name: 'Recent signups' },
    { value: 1, name: 'OEM' },
    { value: 2, name: 'End-User' },
    { value: 3, name: 'Nordson' },
    { value: 4, name: 'Tech Support' },
    { value: 5, name: 'Removed User' },
    { value: 6, name: 'Active'},
    { value: 7, name: 'Pending'}
  ];
  public selectedSortOptions = '' + 0 + '';

  ngOnInit() {
    this.adminService.userType != undefined ? 
    this.selectedSortOptions = '' + this.adminService.userType + '' : this.selectedSortOptions;
    this.adminService.userType = undefined;
    this.pageNo = 1;
    const formRecentSignups = {};
    const formDataUsers = {
      is_pending: 0
    };

    var formDataUsersList = {
      search: this.searchText,
      sortby: 'DESC',
      companyType: '',
      userType: null,
      isActive: null,
      isPending: null
    };

    if (parseInt(this.selectedSortOptions) === 6) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
      formDataUsersList.isActive = 1;
      delete formDataUsersList.sortby;
      delete formDataUsersList.isPending
    } else if (parseInt(this.selectedSortOptions) === 7) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
      formDataUsersList.isPending = 1;
      delete formDataUsersList.sortby;
      delete formDataUsersList.isActive
    } else {
      delete formDataUsersList.companyType
      delete formDataUsersList.userType
      delete formDataUsersList.isActive
      delete formDataUsersList.isPending
    }

    this.adminService.usersCount(formDataUsers).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.usersCount = data.userCount;
        }
      },
      err => {
        console.error('err', err);
      }
    );
    this.total = this.usersCount as number;
    this.adminService.listUsers(this.pageNo, formDataUsersList, this.selectedSortOptions).subscribe(
      (data: any) => {
        this.total = data.count as number;
        for (var i = 0; i < data.result.length; i++) {
          this.recentSignups.push(data.result[i]);
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }


  getPage(page: number) {
    var formDataUsersList = {
      search: this.searchText,
      companyType: 'All',
      userType: 1,
      isRemoved: 0,
      isActive: 0,
      isPending: 0
    };
    if (parseInt(this.selectedSortOptions) === 0) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 1) {
      formDataUsersList.companyType = 'OEM';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 2) {
      formDataUsersList.companyType = 'End User';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 4) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 2;
    } else if (parseInt(this.selectedSortOptions) === 3) {
      formDataUsersList.companyType = 'Nordson';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 6) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
      formDataUsersList.isActive = 1;
    } else if (parseInt(this.selectedSortOptions) === 7) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
      formDataUsersList.isPending = 1;
    } else {
      delete formDataUsersList.companyType;
      delete formDataUsersList.userType;
      formDataUsersList.isRemoved = 1;
    }

    this.loading = true;
    this.asyncMeals = this.adminService.listUsers(page, formDataUsersList, this.selectedSortOptions).pipe(
      tap(res => {
        this.p = page;
        this.loading = false;
      }),
      map(res => res)
    );

    this.adminService.listUsers(page, formDataUsersList, this.selectedSortOptions).subscribe(
      (data: any) => {
        this.total = data.count;
        this.recentSignups.length = 0;
        for (var i = 0; i < data.result.length; i++) {
          this.recentSignups.push(data.result[i]);
          this.p = page;
          this.loading = false;
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }
  searchUsers() {
    this.getPage(1);
  }

  onOptionsChange(e) {
    this.getPage(1);
  }

  recentUser(id: any): void {
    const dialogRef = this.dialog.open(RecentUser, {
      width: '817px',
      height: '100%',
      panelClass: 'recentuser',
      id
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  blockUser(id, i) {
    this.adminService.blockUser(id).subscribe(
      (data: any) => {
        this.recentSignups[i].status = 2;
      },
      err => {
        console.error('err', err);
      }
    );
  }

  unBlockUser(id, i) {
    this.adminService.unBlockUser(id).subscribe(
      (data: any) => {
        this.recentSignups[i].status = 1;
      },
      err => {
        console.error('err', err);
      }
    );
  }

  activateUser(id, i, status) {
    this.adminService.activateUser(id).subscribe(
      (data: any) => {
        if (this.recentSignups[i].status == 0) this.recentSignups[i].status = 1;
        if (this.recentSignups[i].status == 3) this.recentSignups.splice(i, 1);
      },
      err => {
        console.error('err', err);
      }
    );
  }

  deleteUser(id, i) {
    this.adminService.deleteUser(id).subscribe(
      (data: any) => {
        this.recentSignups[i].status = 3;
        this.recentSignups.splice(i, 1);
      },
      err => {
        console.error('err', err);
      }
    );
  }

  exportCsv(){
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      filename:`Userlist${new Date().toDateString()}`,
      title: 'userlist',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      headers: ['UserId', 'FullName','CompanyName','CompanyAddress','AccountNumber','CompanyType','Country','UserType','Status','Plant','Email','MobileNumber','Register'] 
    };

    var formDataUsersList = {
      search: this.searchText,
      companyType: 'All',
      userType: 1,
      isRemoved: 0,
      isActive: 0,
      isPending: 0
    };
    if (parseInt(this.selectedSortOptions) === 0) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 1) {
      formDataUsersList.companyType = 'OEM';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 2) {
      formDataUsersList.companyType = 'End User';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 4) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 2;
    } else if (parseInt(this.selectedSortOptions) === 3) {
      formDataUsersList.companyType = 'Nordson';
      formDataUsersList.userType = 1;
    } else if (parseInt(this.selectedSortOptions) === 6) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
      formDataUsersList.isActive = 1;
    } else if (parseInt(this.selectedSortOptions) === 7) {
      formDataUsersList.companyType = 'All';
      formDataUsersList.userType = 1;
      formDataUsersList.isPending = 1;
    } else {
      delete formDataUsersList.companyType;
      delete formDataUsersList.userType;
      formDataUsersList.isRemoved = 1;
    }
    
  const csvExporter = new ExportToCsv(options);
  this.adminService.getUserListCsv(formDataUsersList).subscribe((data)=>{
    csvExporter.generateCsv(data['result']);
  }) 
  }
}

@Component({
  selector: 'nordson-dialog-recentuser',
  templateUrl: './recent-user.html',
  styleUrls: ['./admin-users.component.css']
})
export class RecentUser implements OnInit {
  equipmentNorfiles = [];
  userData: any;
  apiUrl: string = environment.BASE_URI;
  showDom = false;
  adminUserForm: FormGroup;
  modifyAccess: boolean = true;
  selectedSortOptions: any;
  count: any;
  currentPage: any;

  constructor(
    public dialogRef: MatDialogRef<RecentUser>,
    private fb: FormBuilder,
    private adminService: AdminDhasboardService,
    private flash: NgFlashMessageService,
    private router: Router,
    private userService: UserService,
    private toaster: ToastrService,
    private recipeService: RecipeService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private setuService:SetupToolsService,
    private authservice:AuthService
  ) { }

  ngOnInit() {
    console.log('on init')
    this.selectedSortOptions = this.adminService.selectedSortOptions
    this.userData = this.dialogRef.id;
    this.adminUserForm = this.fb.group({
      nordsonAccountNo: [
        '',
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9!@#$%-_^&]+$')]),
      ],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email]),
        this.userService.getUserByEmail()
      ],
      cemail: [
        '',
        Validators.compose([Validators.required, CustomValidators.email]),
        // this.userService.getUserByEmail()

      ],
      blockUnblockuser: ['']
    }
      , {
        validator: MustMatch('email', 'cemail')
      });

    if (this.userData.status === 2)
      this.adminUserForm.patchValue({
        blockUnblockuser: true
      });
    else {
      this.adminUserForm.patchValue({
        blockUnblockuser: false
      });
    }
    
    this.getPage(1)
    
  }

  get f() {
    return this.adminUserForm.controls;
  }

  addAccountNo() {

    const formData = {
      account_number: this.adminUserForm.getRawValue().nordsonAccountNo,
    };

    this.adminService.addAccountNumber(formData, this.userData.id).subscribe(
      (data: any) => {
        this.dialogRef.close();
        this.userData.account_number = formData.account_number;
        this.toaster.success('Nordson Account Number Added Successfully ', '', {
          timeOut: 3000
        });
      },
      err => {
        console.error('err', err);
      }
    );
  }

  downloadNorfile(id, nor_id) {
      this.setuService.downloadNorFile1(id, nor_id)
        .subscribe((data: any) => {
          const fileName = data.headers.get('file-name');
          const blob = new Blob([data.body], { type: 'application/attachment' });
          saveAs(blob, fileName);
        }, (err: any) => {
          console.log('err', err);
        })
  }

  downloadRecipefile(id, recipe_file_name, type, nor_id) {
    this.recipeService.recipeExportData(recipe_file_name,type,nor_id)
      .subscribe((data:any)=>{
        const blob = new Blob([data], { type: 'application/xml' });
        saveAs(blob, `${recipe_file_name}`);
      },(err:any)=>{
        console.log('err',err);
      })
  }

  viewRecipefile(id, recipe_file_name, type, nor_id) {
    localStorage.setItem('nor_id', nor_id);
    localStorage.setItem('openRecipeFile', recipe_file_name.substring(0, recipe_file_name.indexOf(".")))
    let navigationExtras: NavigationExtras = {
      queryParams: {
        page: 'update'
      }
    };
    this.router.navigate(['/recipe/settings'], navigationExtras);
    this.dialogRef.close();

  }

  viewCurrentRecipefile(id, recipe_file_name, type, nor_id) {
    localStorage.setItem('user_id', id)
    localStorage.setItem('nor_id', nor_id)
    this.dialogRef.close();
    this.router.navigate(['settings/temp-zone']);
  }
  viewEventLog(nor_id) {
    localStorage.setItem('nor_id', nor_id)
    this.dialogRef.close()
    this.router.navigate(['/tools/eventLog'])
  }

  onNoClick() {
    this.dialogRef.close();
  }

  blockUnblockUser(checked, userData) {
    if (checked.checked) {
      this.adminService.blockUser(userData.id).subscribe(
        (data: any) => {
          this.userData.status = 2;
        },
        err => {
          console.error('err', err);
        }
      );
    } else {
      this.adminService.unBlockUser(userData.id).subscribe(
        (data: any) => {
          this.userData.status = 1;
        },
        err => {
          console.error('err', err);
        }
      );
    }
  }

  deleteUser(id) {
    this.adminService.deleteUser(id).subscribe(
      (data: any) => {
        this.userData = null;
        this.userData.status = 3;
      },
      err => {
        console.error('err', err);
      }
    );
  }

  onSubmit() {
    const formDataEmail = {
      newemail: this.adminUserForm.getRawValue().email,
      email: this.userData.email
    };

    this.adminService.changeEmail(formDataEmail, this.userData.id).subscribe(
      (data: any) => {
        this.dialogRef.close();
        this.userData.email = formDataEmail.newemail;
      },
      err => {
        this.dialogRef.close();
        console.error('err', err);
      }
    );
  }
  getPage(event){
    this.currentPage=event
    this.adminService.getEquipmentNorfilesData(this.userData.id,event).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.equipmentNorfiles = data.result;
          this.count=data.count;
          this.showDom = true;
        }
      },
      err => {
        this.showDom = true;
        console.error('err', err);
      }
    );
  }
}
