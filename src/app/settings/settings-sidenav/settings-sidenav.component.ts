import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatDialogRef} from '@angular/material/dialog';
import { SideNavModal } from 'src/app/dashboard/dashboard-header/dashboard-header.component';
import { saveAs } from 'file-saver';


@Component({
  selector: 'nordson-settings-sidenav',
  templateUrl: './settings-sidenav.component.html',
  styleUrls: ['./settings-sidenav.component.css']
})
export class SettingsSidenavComponent implements OnInit {
  apiUrl: string = environment.BASE_URI;
  authToken: any;
  multi = false;
  panelOpenState: any;
  norFileDownload;
  showTempratureZoneMenu = false;
  systemSettings = false;
  comminucationSetting = false;
  nor_Id: any;
  Tools = false;
  userRole: any;
  @Output() loadsettings = new EventEmitter();
  norFileName:any;
  constructor(
    private setuService: SetupToolsService,
    private authservice: AuthService,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<SideNavModal>,

  ) { }
  ngOnInit() {
    const { user_id } = this.authservice.decodeToken();
    this.norFileDownload = user_id;

    let userData = this.userService.setProfile()
    if(userData) {
      this.userRole = userData.data.user_type_id;
    }

    // this.authservice.getxmlData().subscribe(
    //   (data: any) => {
    //     if (data.status === 'Success') {
    //       this.norFileName=data.result.fName;
    //     }
    //   });

    if (
      this.router.url === '/settings/temp-zone'||
      this.router.url === '/settings/pressure'
    ) {
      this.showTempratureZoneMenu = true;
      this.Tools = false;
      this.systemSettings = false;
      this.comminucationSetting = false;
    }
    if (
      this.router.url === '/settings/temperaturesettings'||
      this.router.url === '/fill'  ||
      this.router.url === '/pump' ||
      this.router.url === '/user-management/modify-privilage' ||
      this.router.url === '/system-io' ||
      this.router.url === '/zone' ||
      this.router.url === '/heat-shedule' ||
      this.router.url === '/tools/preferences' ||
      this.router.url === '/tools/networking'
    ) {
      this.systemSettings = true;
      this.Tools = false;
      this.showTempratureZoneMenu = false;
      this.comminucationSetting = false;
    }
    if (this.router.url === '/plc-mapping') {
      this.comminucationSetting = true;
      this.Tools = false;
      this.showTempratureZoneMenu = false;
      this.systemSettings = false;
    }
    if (
      this.router.url === '/tools/system-configuration-main' ||
      this.router.url === '/tools/eventLog'
    ) {
      this.Tools = true;
      this.showTempratureZoneMenu = false;
      this.systemSettings = false;
      this.comminucationSetting = false;
    }
    if (this.router.url === '/recipe') {
      this.Tools = false;
      this.showTempratureZoneMenu = false;
      this.systemSettings = false;
      this.comminucationSetting = false;
    }
  }

 
  dashboardRoute() {
    if(Object.keys(this.dialogRef).length != 0){
      this.dialogRef.close();
    }
    switch (this.userRole) {
      case 0:
        this.router.navigate(['/dashboard']);
        break;
      case 1:
        this.router.navigate(['/superadmin/superadmin-dashboard']);
        break;
      case 2:
        this.router.navigate(['/Admin/admin-dashboard']);
        break;
      case 3:
        this.router.navigate(['/tech/tech-support']);
        break;
      case 4:
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
  onDownload(userId, norId?) {
    if (userId) {
      let norId = this.authservice.getNorId();
      this.setuService.downloadNorFile1(userId, norId)
        .subscribe((data: any) => {
          const fileName = data.headers.get('file-name');
          const blob = new Blob([data.body], { type: 'application/attachment' });
          saveAs(blob, fileName);
        }, (err: any) => {
          console.log('err', err);
        })
      
    } 
  }
  closeModal(){
    if(Object.keys(this.dialogRef).length != 0){
      this.dialogRef.close();
    }
   }
   routeReciepe(){
    this.router.navigate(['/recipe']);
   }
}
