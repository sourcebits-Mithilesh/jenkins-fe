import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  Inject
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { TechSupportService } from 'src/app/tech/tech-support/tech-support.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth.service';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminDhasboardService } from 'src/app/shared/admin-dhasboard.service';
import { NgFlashMessageService } from 'ng-flash-messages';
import { UserService } from 'src/app/user.service';
import { RecipeService } from 'src/app/recipe/recipe.service';
import { CustomValidators } from 'ngx-custom-validators';
import { MustMatch } from 'src/app/shared/confirm-equal-validator.directive';
export interface DialogData {}
@Component({
  selector: 'nordson-tech-user',
  templateUrl: './tech-user.component.html',
  styleUrls: ['./tech-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TechUserComponent implements OnInit {
  selectedOption: string;
  usersCount: Number;
  searchText: string = '';
  recentSignups = [];
  pageNo: number;
  totalPages: number;
  user_status = ['Pending', 'Active', 'Blocked', 'Deleted'];
  // pagination
  //@Input('data') meals: string[] = [];
  asyncMeals: Observable<any>;
  p: number = 1;
  // total = 1000;
  total: number;
  loading: boolean;
  orderBy: string = 'DESC';
  //selectedOption: any;
  // constructor() {
  //   this.selectedOption ='1';
  //  }
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private techService: TechSupportService,
    private auth: AuthService
  ) {
    //this.selectedOption = '1';
  }

  sortOptions = [
    { value: 0, name: 'Recent signups' },
    { value: 1, name: 'OEM' },
    { value: 2, name: 'End-User' },
    { value: 3, name: 'Nordson' }
  ];
  public selectedSortOptions = '' + 0 + '';

  ngOnInit() {
    this.pageNo = 1;
    const formRecentSignups = {};
    const formDataUsers = {
      is_pending: 0
    };

    var formDataUsersList = {
      search: this.searchText,
      sortby: 'DESC'
    };

    // formDataUsersList.sortby = "ASC";

    this.techService.usersCount(formDataUsers).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.usersCount = data.userCount;
          this.total = data.userCount as number;
        }
      },
      err => {
        console.error('err', err);
      }
    );
    this.total = this.usersCount as number;

    this.techService.listUsers(this.pageNo, formDataUsersList).subscribe(
      (data: any) => {
        for (var i = 0; i < data.result.length; i++) {
          this.recentSignups.push(data.result[i]);
        }
      },
      err => {
        console.error('err', err);
      }
    );
  } // End of nginit

  getPage(page: number) {
    console.log('page',page)
    var formDataUsersList = {
      search: this.searchText,
      companyType: 'All',
      userType: 1
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
    } else {
      formDataUsersList.companyType = 'Nordson';
      formDataUsersList.userType = 1;
    }

    this.loading = true;
    this.asyncMeals = this.techService.listUsers(page, formDataUsersList).pipe(
      tap(res => {
        //  this.total = this.usersCount as number;
        this.p = page;
        this.loading = false;
      }),
      map(res => res)
    );

    this.techService.listUsers(page, formDataUsersList).subscribe(
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

  onOptionsChange(event) {
    // this.selectedSortOptions
    //if (parseInt(this.selectedSortOptions) === 0)
    this.getPage(1);
  }

  deleteUser(id) {
    this.techService.deleteUser(id).subscribe(
      (data: any) => {},
      err => {
        console.error('err', err);
      }
    );
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
}

@Component({
  selector: 'nordson-dialog-recentuser',
  templateUrl: '../../../Admin/admin-users/recent-user.html',
  styleUrls: ['../../../Admin/admin-users/admin-users.component.css']
})
export class RecentUser implements OnInit {

  equipmentNorfiles = [];
  userData: any;
  apiUrl: string = environment.BASE_URI;
  showDom = false;
  adminUserForm: FormGroup;
  modifyAccess:boolean=false
  count: any;
  currentPage: any;

  constructor(
    public dialogRef: MatDialogRef<RecentUser>,
    private fb: FormBuilder,
    private adminService: AdminDhasboardService,
    private flash: NgFlashMessageService,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.userData = this.dialogRef.id;
    this.adminUserForm = this.fb.group({
      nordsonAccountNo:[
        '',
        Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9!@#$%-_^&]+$')]),
      ],
    }
    , {
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
  getPage(event){
    this.currentPage=event
    this.adminService.getEquipmentNorfilesData(this.userData.id, event).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.count=data.count;
          this.equipmentNorfiles = data.result;
          this.showDom = true;
        }
      },
      err => {
        this.showDom = true;
        console.error('err', err);
      }
    );
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
        
      },
      err => {
        console.error('err', err);
      }
    );
  }
  

  downloadNorfile(id, nor_id) {
    console.log('nor_id', nor_id)
    window.location.href = `${
      this.apiUrl
      }/user/norfile/download?user_id=${id}&nor_id=${nor_id}`;
  }

  downloadRecipefile(id, recipe_file_name, type, nor_id) {
    window.location.href = `${
      this.apiUrl
      }/exportrecipe?user_id=${id}&file_name=${recipe_file_name}&type=${type}&nor_id=${nor_id}`;
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
    localStorage.setItem('nor_id', nor_id)
    this.dialogRef.close();
    this.router.navigate(['settings/temp-zone']);
  }
  viewEventLog(nor_id) {
    localStorage.setItem('nor_id', nor_id)
    this.dialogRef.close()
    this.router.navigate(['/tools/eventLog'])
  }

  // onNoClick() {
  //   this.dialogRef.close();
  // }

  // blockUnblockUser(checked, userData) {
  //   if (checked.checked) {
  //     this.adminService.blockUser(userData.id).subscribe(
  //       (data: any) => {
  //         this.userData.status = 2;
  //       },
  //       err => {
  //         console.error('err', err);
  //       }
  //     );
  //   } else {
  //     this.adminService.unBlockUser(userData.id).subscribe(
  //       (data: any) => {
  //         this.userData.status = 1;
  //       },
  //       err => {
  //         console.error('err', err);
  //       }
  //     );
  //   }
  // }

  // deleteUser(id) {
  //   this.adminService.deleteUser(id).subscribe(
  //     (data: any) => {
  //       this.userData = null;
  //       this.userData.status = 3;
  //     },
  //     err => {
  //       console.error('err', err);
  //     }
  //   );
  // }

  // onSubmit() {
  //   const formDataEmail = {
  //     newemail: this.adminUserForm.getRawValue().email,
  //     email: this.userData.email
  //   };

  //   this.adminService.changeEmail(formDataEmail, this.userData.id).subscribe(
  //     (data: any) => {
  //       this.dialogRef.close();
  //       this.userData.email = formDataEmail.newemail;
  //     },
  //     err => {
  //       this.dialogRef.close();
  //       console.error('err', err);
  //     }
  //   );
  // }
}
