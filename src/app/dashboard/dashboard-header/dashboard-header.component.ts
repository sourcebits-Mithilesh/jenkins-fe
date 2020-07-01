import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LanguageService } from 'src/app/share/language.service';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { NotificationService } from 'src/app/toastr-notification/toastr-notification.service';
import { ToastrService } from 'ngx-toastr';
import { EquipmentService } from 'src/app/equipment.service';

export interface DialogData { }

@Component({
  selector: 'nordson-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {
  user: any;
  userName: string;
  clicked: any;
  current=false;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  nativeElement: any;
  isMenuOpen = false;
  languages =[{name:'English',file:'en-English'}];
  // languages =[{name:'German',file:'de-Germen'},{name:'English',file:'en-English'},{name:'Spanish',file:'es-Spanish'},{name:'French',file:'fr-French'},{name:'Italian',file:'it-Italian'},{name:'Japanese',file:'ja-Japanese'},{name:'Dutch',file:'nl-Dutch'},{name:'Portuguese',file:'pt-Portuguese'},{name:'chinese',file:'zh-Chinese'}];
  currentLang = localStorage.getItem('currentLang') ? localStorage.getItem('currentLang') : 'en-English';
  profilePhoto;
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private languageService: LanguageService,
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {
    /**
     * This events get called by all clicks on the page
     */
    this.renderer.listen('document', 'click', (e: Event) => {
      if (
        this.toggleButton &&
        this.menu &&
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.menu.nativeElement
      ) {
        this.isMenuOpen = false;
        this.toggleButton.nativeElement.style = '';
      }
    });
  }
  switchLang(langSelect){
    this.languageService.setCurrentLanguage(langSelect);

  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.toggleButton.nativeElement.style =
      'border-radius: 19px;	background-color: #E2F5FF';
  }

  ngOnInit() {
    let userData = this.userService.setProfile()
    if(userData) {
        this.userName = userData.data.full_name;
    } else {
      this.authService.logout()
      this.router.navigate(['/login'])
    }
    if(window.innerWidth<511){
      this.profilePhoto=true;
    }
  }

  openUserModal(): void {
    const dialogRef = this.dialog.open(UserProfileModal, {
      width: '800px',
      height: '100%',
      panelClass: 'matuserprofilemodal'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  openSideMenu(): void {
    // if(){
      const dialogRef = this.dialog.open(SideNavModal, {
        width: '300px',
        height: '100%',
        panelClass: 'matsidenavmodal',
        backdropClass:'sidenavmodalbackdrop'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }
    // }
    
  
  

  OpenLogoutModal(): void {
    const dialogRef = this.dialog.open(LogoutModal, {
      width: '460px',
      height: '271px',
      panelClass: 'matlogoutmodal',
      disableClose: true,
      backdropClass: 'popupBackdropClassLog',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'nordson-userprofile-modal',
  templateUrl: './userprofile-modal.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class UserProfileModal implements OnInit {
  profile: any;
  edituserForm: FormGroup;
  countries: any;
  inputIsOn = false;
  disabled: boolean;
  role: number;
  userType: number;
  countryCode:string
  valueLanguage: boolean =true;
  disablePhone:boolean = true;

  constructor(
    public dialogRef: MatDialogRef<UserProfileModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private authService: AuthService,
    private languageService: LanguageService
  ) { }


  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    });
    this.edituserForm = this.fb.group({
      full_name: [
        '',
        [
          Validators.required,
          Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")
        ]
      ],
      mobile_number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{7,15}$')]
      ],
      company_type: [null, Validators.required],
      plant: [
        '',
        Validators.compose([
          Validators.pattern(
            "^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$"
          )
        ])
      ],
      company_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$"
          )
        ])
      ],
      country: ['', Validators.required],
      address: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^([A-Za-z0-9,-]+ )+[A-Za-z0-9,-]+$|^[A-Za-z0-9,-]+$"
          )
        ])
      ]
    });

    const getCountry = this.userService.getCountries()
    const getProfile = this.userService.getProfile();

    // forkJoin([getProfile, getCountry]).subscribe(([profile, country]) => {
    //   if (profile['Status'] === 'Success') {
    //     this.profile = profile['data'];
    //     this.profile.address = profile['data'].company_address;
    //     this.userType = this.profile.user_type_id;
    //     this.edituserForm.patchValue(Object.assign({}, { ...this.profile }));
    //     const userole = this.profile.user_type_id;
    //     this.role = userole;
    //     // disable if sub user
    //     if (userole === 4 && userole) {
    //       this.edituserForm.get('company_name').disable();
    //       this.edituserForm.get('country').disable();
    //     } else if (userole === 3 || (userole === 2 && userole)) {
    //       this.edituserForm.get('company_type').disable();
    //       this.edituserForm.get('plant').disable();
    //     }
    //   };
    //   if (country['suceess']) this.countries = country;

    //   let countryDetail = this.countries.country.find(country => country.name == this.profile.country);
    //   this.countryCode = '+'+countryDetail.code
    // });
    forkJoin([getProfile, getCountry]).subscribe(([profile, country]) => {
      if (profile['Status'] === 'Success') {
        this.userService.userProfile = profile;
        localStorage.setItem('userData', JSON.stringify(this.userService.userProfile))
        this.profile = profile['data'];
        this.profile.address = profile['data'].company_address;
        this.userType = this.profile.user_type_id;
        this.edituserForm.patchValue(Object.assign({}, { ...this.profile }));
        const userole = this.profile.user_type_id;
        this.role = userole;
        // disable if sub user
        if (userole === 4 && userole) {
          this.edituserForm.get('company_name').disable();
          (this.profile.country=='' || this.profile.country===null) ? '':this.edituserForm.get('country').disable();
        } else if (userole === 3 || (userole === 2 && userole)) {
          this.edituserForm.get('company_type').disable();
          this.edituserForm.get('plant').disable();
        }
      };
      if (country['suceess']) this.countries = country;

      let countryDetail = this.countries.country.find(country => country.name == this.profile.country);
      countryDetail?this.countryCode = '+'+countryDetail.code:''
      if(countryDetail != undefined){
        this.disablePhone = false;
      }
    });
  }
 

  get f() {
    return this.edituserForm.controls;
  }
  editProfile() {
    this.inputIsOn = true;
    if (!this.edituserForm.touched) this.disabled = true;
  }
  onNoClick(): void {
    this.dialogRef.close();
    this.router.navigateByUrl('/change-password');
  }

  cancel() {
    this.inputIsOn= false;
    this.ngOnInit();
  }

  setCountryCode(event) {
    let countryDetail = this.countries.country.find(country => country.name == event);
    countryDetail?this.countryCode = '+'+countryDetail.code:''
      this.disablePhone=false;
    
  }

  onSubmit() {
    const formData = this.edituserForm.getRawValue();
    this.userService.updateProfile(formData).subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          this.userService.getProfile().subscribe(
            (userData:any)=>{
            if (userData.Status === 'Success') {
              this.userService.userProfile = userData;
              localStorage.setItem('userData', JSON.stringify(this.userService.userProfile))
            }
          })
          this.authService.setUserfullName(formData.full_name);
          sessionStorage.setItem('fullName', formData.full_name);
          Object.assign(this.profile, { ...formData })
          this.toaster.success('User Profile Updated Successfully', '', {
            timeOut: 3000
          });
          this.inputIsOn = false;
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );
  }
}

@Component({
  selector: 'nordson-logout-modal',
  templateUrl: './logoutmodal.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class LogoutModal implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<LogoutModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService,
    private Router: Router,

  ) {}
  ngOnInit(){

  }
  onClick() {
    this.authService.logout();
    this.dialogRef.close();
    this.Router.navigate(['/']);
  }
  onNoClick(){
    this.dialogRef.close();

  }

}
@Component({
  selector: 'nordson-logout-modal',
  templateUrl: './sidenavmodal.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class SideNavModal implements OnInit{
  isShown: boolean = false;
  sideNavDashboardModal = false;
  sideNaveSettingsModal = false;
  sideNavAdminModal = false;
  norFilesCount: boolean = false;
  userRole: any;
  uploadForm: FormGroup;
  status: boolean = false;
  loadsidenav: boolean = false;
  loadercreatenew: boolean=false;
  loaderpreviousfile:boolean = false;
  isDescriptionOn: boolean = false;
  isDescriptionOnLoad: boolean = false;
  description: string="";
  uploadFormData: any;
  disable;
  equipmentData:any;
  selected:any;
  loadPrevious: boolean=false;
  constructor(
    public dialogRef: MatDialogRef<SideNavModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private authService: AuthService,
    private setup: SetupToolsService,
    private fb: FormBuilder,
    private _notificationservice: NotificationService,
    private toaster: ToastrService,
    private equipmentService:EquipmentService,
    private userService: UserService
  ) {}
  ngOnInit(){
    this.enableNavbar(this.router.url);
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
      (err: any) => {
        console.error('err', err);
      }
    );
  }
  enableNavbar(routerName) {
    let dashboard = [
      '/dashboard',
      '/equipment-registration',
      '/manage-subuser',
      '/subuser',
      '/user-profile',
      '/imported-settings-files',
      '/event-log-files',
      '/media-center',
      '/setuptool',
      '/contactUs'
    ];
    let admin = [
      '/superadmin/superadmin-dashboard',
      '/Admin/admin-dashboard',
      '/Admin/admin-users',
      '/tech/tech-support',
      '/tech/tech-user',
      '/nor-files'
    ];
    let settings = [
      '/settings/temp-zone',
      '/settings/temperaturesettings',
      '/settings/fill',
      '/settings/pressure',
      '/settings/pump',
      '/security',
      '/settings/system-io',
      '/settings/zone',
      '/user-management/modify-privilage',
      '/settings/system-io/system-input',
      '/settings/system-io/system-output',
      '/tools/accessories',
      '/settings/preferences',
      '/user-profile',
      '/tools/system-configuration',
      '/tools/flow',
      '/tools/software-license',
      '/tools/maintenance',
      '/scheduler/heat-schedule',
      '/plc-mapping',
      '/scheduler/shift-schedule',
      '/tools/configuration-code',
      '/settings/networking',
      '/settings/public-wired-network',
      '/settings/plc',
      '/settings/wifi',
      '/settings/web-server',
      '/tools/system-configuration-main',
      '/tools/eventLog',
      '/tools/network',
      '/tools/maintenance-history',
      '/tools/maintenance-status',
      '/recipe',
      '/recipe/settings?page=update',
      '/recipe/settings?page=create'
      ];

    if (dashboard.includes(routerName)) {
      this.sideNavDashboardModal = true;
      this.sideNaveSettingsModal = false;
      this.sideNavAdminModal = false;
    } else if (settings.includes(routerName)) {
      this.sideNaveSettingsModal = true;
      this.sideNavDashboardModal = false;
      this.sideNavAdminModal = false;
    } else if (admin.includes(routerName)) {
      this.sideNavDashboardModal = false;
      this.sideNaveSettingsModal = false;
      this.sideNavAdminModal = true;
    } else {
      this.sideNavDashboardModal = false;
      this.sideNaveSettingsModal = false;
      this.sideNavAdminModal = false;
    }
  }
  closeModal(){
    this.dialogRef.close();
  }
  // toggleShow(){
  //   this.isShown = !this.isShown;
  //   // this.dialogRef.close();
  // }
  // hideModal(){
  //   this.isShown = false;
  //   // this.isDescriptionOn = false;
  //   // this.isDescriptionOnLoad = false;
  //   // this.loadercreatenew=false;
  // }
  addDescriptionCreate() {
    this.isDescriptionOn = true;

  }

  getUserEquipments(){
    this.equipmentService.getUserEquipment()
    .subscribe((data:any)=>{
      if(data.Status){
        console.log(data.Status)
        this.loadercreatenew == true;
        this.equipmentData=data;
        console.log('equipment',this.equipmentData)
        this.selected=this.equipmentData.equRes[0];
      }
    },(err:any)=>{
      console.log('err',err)
    })
  }

  removeDescriptionCreate() {
    this.isDescriptionOn = false;
    this.description = '';
    this.loadPrevious=false;
    this.loadercreatenew=false;
  }
  removeDescriptionNor() {
    this.description = '';
    this.isDescriptionOnLoad = false;

  }
  CreteNorFromUsb() {
    // let formData = {
    //   norfile_description: this.description 
    // };
    this.uploadFormData.append('norfile_description',this.description);
     this.authService.uploadNor(this.uploadFormData).subscribe(
      (data: any) => {
        if (data.status === true) {
          this.authService.setNorId(data.nor_id);
          this.router.navigate(['settings/temp-zone']);
        }else{
            if(!data.status && data.message){
              this.loadsidenav=false;
              this.isDescriptionOnLoad=false
              this.toaster.error(data.message,'',{ timeOut: 3000 });
            }
        }
      },
      err => {
        console.log('err', err);
        this.loadsidenav=false;
        this.isDescriptionOnLoad=false
        this.toaster.error(
          'Please select a valid nor file with .nor extension',
          '',
          { timeOut: 3000 }
        );
      }
    );
  }

  createNorFile() {
    let formData = {
      norfile_description: this.description,
      equip_id:this.selected?this.selected.equipment_id:''
    };
    this.setup.createNorFile(formData).subscribe(
      (data: any) => {
        if (data.status == 'success') {
          this.loadsidenav=true;
          this.authService.setNorId(data.nor_id);
          this.router.navigate(['settings/temp-zone']);
        }
      },
      (err: any) => {
        console.error('err', err);
      }
    );
  }

  showPreviousNorFilePopup() {
    this.loadPrevious=true;
    // this.setup.previousNorFile().subscribe(
    //   (data: any) => {
    //     if (data.status == 'success') {
    //       this.authService.setNorId(data.nor_id);
    //       this.router.navigate(['settings/temp-zone']);
    //     }
    //   },
    //   (err: any) => {
    //     this._notificationservice.error('No nrfile loaded previously');
    //     console.error('err', err);
    //   }
    // );
  }
  submitPreviousFile(){
    const formData={
      equipment_id:this.selected?this.selected.equipment_id:''
    }
    this.setup.previousNorFile(formData).subscribe(
      (data: any) => {
        if (data.status == 'success') {
          this.authService.setNorId(data.nor_id);
          this.router.navigate(['settings/temp-zone']);
        }
        else if(data.status == 'fail'){
          this.isShown=false;
          this.loadsidenav=false;
          this.loadPrevious=false;
          this.toaster.error('No norfile loaded previously','',
          { timeOut: 3000 });
        }
      },
      (err: any) => {
        this.isShown=false
        this.loadsidenav=false;
        this.loadPrevious=false;
        this.toaster.error('No norfile loaded previously','',
        { timeOut: 3000 });
        console.error('err', err);
      }
    );
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      if (fileExt === 'nor') {
        this.uploadForm.get('norfile').setValue(file);
        const formData = new FormData();
        formData.append('norfile', this.uploadForm.get('norfile').value);
        this.isDescriptionOnLoad = true;
        this.uploadFormData = formData;
      } else {
        this.toaster.error('Please select a file with .nor extension', '', {
          timeOut: 3000
        });
      }
    }
  }
  selectEquipment(data){
    this.selected=data;
  }
  toggleShow(){this.isShown = !this.isShown;
    //  this.getUserEquipments()
  }
  
  hideModal(){
    this.isShown = false;
    this.isDescriptionOn = false;
    this.isDescriptionOnLoad = false;
    this.loadercreatenew=false;
  }

}

