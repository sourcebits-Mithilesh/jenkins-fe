import { Component, OnInit, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SideNavModal } from '../dashboard/dashboard-header/dashboard-header.component';
import { AuthService } from '../auth.service';
import { SetupToolsService } from '../shared/setup-tools.service';
import { NotificationService } from '../toastr-notification/toastr-notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EquipmentService } from '../equipment.service';
import { UserService } from '../user.service';

@Component({
  selector: 'nordson-setuptool',
  templateUrl: './setuptool.component.html',
  styleUrls: ['./setuptool.component.css']
})
export class SetuptoolComponent implements OnInit {
  isShown: boolean = false;
  enableNavbar=false;
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
  editDescription;
  selected:any;
  loadPrevious: boolean=false;
  constructor(    private ref:ApplicationRef,
    private cdRef : ChangeDetectorRef,
    public dialogRef: MatDialogRef<SideNavModal>,
    private authService: AuthService,
    private setup: SetupToolsService,
    private fb: FormBuilder,
    private _notificationservice: NotificationService,
    private router: Router,
    private toaster: ToastrService,
    private equipmentService:EquipmentService,
    private userService: UserService) { }

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
        (err: any) => {
          console.error('err', err);
        }
      );
  
      this.getUserEquipments()
    }
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
          this.editDescription=this.equipmentData.equRes[0].equipment_desc


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
            if(Object.keys(this.dialogRef).length != 0){
              this.dialogRef.close();
            }
            this.authService.setNorId(data.nor_id);
            this.router.navigate(['settings/temp-zone']);
          }else{
            this.loadsidenav=false;
            this.isDescriptionOnLoad=false
            this.toaster.error(
              'Please select valid nor file',
              '',
              { timeOut: 3000 }
            );
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
            if(Object.keys(this.dialogRef).length != 0){
              this.dialogRef.close();
            }
            
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
            if(Object.keys(this.dialogRef).length != 0){
              this.dialogRef.close();
            }
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
      if(data.equipment_desc){
        this.editDescription=data.equipment_desc
      }

    }

  

  }

