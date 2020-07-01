import { Component, OnInit,Renderer2,ElementRef, Inject } from '@angular/core';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/user.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { DialogNorFileEquipment } from '../equipment-registration/equipment-registration.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { accessType } from 'src/app/settings/access-type-check';
import { EquipmentService } from 'src/app/equipment.service';
import { ToastrService } from 'ngx-toastr';


export interface DialogData { }


@Component({
  selector: 'nordson-imported-settings-files',
  templateUrl: './imported-settings-files.component.html',
  styleUrls: ['./imported-settings-files.component.css']
})
export class ImportedSettingsFilesComponent implements OnInit{
  apiUrl: string = environment.BASE_URI;
  accessType: number;
  noRecord: any;
  userRole: any;
  // Pagination
  pageNo: number;
  p: number = 1;
  total: number;
  loading: boolean=false;
  isNoRecords: boolean = false;


  importednorfile: any;
  constructor(
    public dialog: MatDialog,
    private setuService: SetupToolsService,
    private userService: UserService,
    private authServices: AuthService,
    private router: Router,
    private eqService:EquipmentService
  ) {}

  OpenNorFileEditModalSettings(data,norId): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(DialogNorFileEquipment, {
      width: '550px',
      panelClass: 'mateditnorfilesettings',
      disableClose: true,
      data: {
        description: data,
        norId: norId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.shownorfiles();
    });
  }
  opendeleteModal(nor_id): void {
    const dialogRef = this.dialog.open(DeleteNorFile, {
      width: '460px',
      height: '271px',
      panelClass: 'matnorfilemodal',
      disableClose: true,
      data:{
        nor_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit()
    });
  }

  ngOnInit() {
  this.shownorfiles();  
    let userData = this.userService.setProfile()
    if(userData) {
        this.accessType = accessType.check(userData.data);
        this.userRole = userData.data.user_type_id;
    }
  }
  shownorfiles(){
    this.pageNo = 1;
    this.setuService.showNorFiles(this.pageNo).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.loading = true
          if (data.result.length == 0) {
            this.noRecord = 'No Files Created or Imported recently!';
            this.isNoRecords = false;
          } else {
            this.isNoRecords = true;
            this.importednorfile = data.result;
            this.total = data.count as number;
          }
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }
  onDown(fileName, userId, norId) {
    if (userId && fileName) {
      this.eqService.onDownload(fileName,userId,norId)
    .subscribe((data:any)=>{
      const blob = new Blob([data], { type: 'application/attachment'});
      saveAs(blob, `${fileName}`);
    },(err:any)=>{
      console.log('err',err);
    })
    }
  }
  goToSetupTools(norId){
    localStorage.removeItem('user_id')
    this.authServices.setNorId(norId);
    this.router.navigate(['settings/temp-zone']);
  }
  getPage(page: number) {
    this.setuService.showNorFiles(page).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.loading = true
          if (data.result.length == 0) {
            this.noRecord = 'No Files Created or Imported recently!';
            this.isNoRecords = false;
          } else {
            this.isNoRecords = true;
            this.importednorfile = data.result;
            this.total = data.count as number;
          }
          this.p = page;
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }
 
}
@Component({
  selector: 'nordson-logout-modal',
  templateUrl: './deleteNorfileModal.html',
  styleUrls: ['./imported-settings-files.component.css']
})
export class DeleteNorFile implements OnInit{
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteNorFile>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eqipmentService:EquipmentService,
    private toaster:ToastrService,
  ) {}
  ngOnInit(){
  }
 
  deleteNorFile(){
    this.eqipmentService.deleteNorFile({nor_id:this.dialogRef.componentInstance.data.nor_id?this.dialogRef.componentInstance.data.nor_id:''},this.dialogRef,this.toaster)
  }
  onNoClick(){
    this.dialogRef.close();

  }

}
