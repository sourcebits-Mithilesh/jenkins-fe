import { Component, OnInit, Input, Inject } from '@angular/core';
import { EquipmentService } from 'src/app/equipment.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateSerialNo } from '../../shared/serial-number-validator.directive';
import { validateUID } from '../../shared/uid-validator.directive'
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { accessType } from 'src/app/settings/access-type-check';
import { AuthService } from 'src/app/auth.service';


export interface DialogData { }
@Component({
  selector: 'nordson-equipment-registration',
  templateUrl: './equipment-registration.component.html',
  styleUrls: ['./equipment-registration.component.css']
})
export class EquipmentRegistrationComponent implements OnInit {
  showHide: boolean;
  subUser: boolean;
  user: any;
  equipments: any;
  equipments2: any;
  sno: String;
  ccode: String;
  equip = null;
  id: any;
  apiUrl: string = environment.BASE_URI;
  norfile: any;
  fileUrl;
  accessType: number;
  userType: number;
  equipmentslength: any;
  descriptionOn = false;
  count: any[];
  pages: any[];
  currentPage: number=1;
  userId: any;
  userRole: any;
  userData: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private eqipmentService: EquipmentService,
    private toaster: ToastrService,
    private authService:AuthService
  ) {
    this.showHide = false;
  }
  cancel() {
    this.subUser = !this.subUser;
  }
  openEditDialog(id): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(DailogEditEquipment, {
      width: '700px',
      height: '100%',
      id,
      panelClass: 'mateditequipment',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.ngOnInit();
    });
  }

  OpenNorFileEditModal(data,norId): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(DialogNorFileEquipment, {
      width: '550px',
      panelClass: 'mateditnorfile',
      disableClose: true,
      data: {
        description: data,
        norId: norId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.showEquipmets();
    });
  }
  opendeleteModalEquip(nor_id): void {
    const dialogRef = this.dialog.open(DeleteNorFileEquip, {
      width: '460px',
      height: '271px',
      panelClass: 'matnorfilemodalequip',
      disableClose: true,
      data:{
        nor_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.ngOnInit()
    });
  }
  onSubmit() {

  }
  openAddDialog(equipmentlength): void {
    // if (!(equipmentlength >= 20)) {
      const dialogRef = this.dialog.open(DailogAddEquipment, {
        width: '700px',
        height: '100%',
        panelClass: 'mataddequipment',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        //this.ngOnInit();
      });
   // }
    // else {
    //   this.toaster.error('Maximum Model limit is 20', '', {
    //     timeOut: 3000
    //   });
    //}
  }

  ngOnInit() {
    // get equipments
    this.showEquipmets();
  }

  //soft delete nor file
  

  edit(norId, locationUrl): void {
    this.eqipmentService.editEquipment(norId, locationUrl).subscribe((data: any) => {
      if (data.status === 'Success') {
        this.router.navigate(['settings/temp-zone']);
      }
    });
  }

  editAsNewfile(norId): void {
    const formData={nor_id:norId}
    this.eqipmentService.editAsNewEquipment(formData).subscribe((data: any) => {
      if (data.status) {
        this.authService.setNorId(data.nor_id);
        this.router.navigate(['settings/temp-zone']);
      }
    });
  }

  showEquipmets() {
    const userData = this.userService.setProfile();
    this.userData=userData;
    if (userData.Status === 'Success') {
      this.accessType = accessType.check(userData.data);
      this.userType = userData.data.user_type_id;
      const userRole = userData.data.user_type_id;
      this.userRole=userRole
      const user_id = userData.data.id;
      this.userId=user_id;
      const parent_id = userData.data.parent_user_id;
      const formData = {
        user_id,
        parent_id,
        page: 1
      };

      this.equipments=this.eqipmentService.equipments
      this.eqipmentService.equipmentsCount.subscribe(data=>{
        if(!Array.isArray(data)){
          this.count=data;
          console.log(this.count)
        }
      })
      this.eqipmentService.equipmentsPage.subscribe(data=>{
        if(!Array.isArray(data)){
          this.pages=data;
          console.log(this.pages)
        }
      })
      if (userRole === 4) {
        // sub user
         this.getPage(1)
      } else {
        // user
        this.getPage(1)
      }
    }
  }
  getPage(event){
    if(this.userRole==4){
      const formData = {
        user_id:this.userData.data.id,
        parent_id:this.userData.data.parent_user_id,
        page: event
      };
      this.currentPage=event
      this.eqipmentService.getSubuserEquipment(formData)
    }
    else{
      this.currentPage=event
      this.eqipmentService.getEquipments(this.userId, this.currentPage)
    } 
  }
  onDown(fileName, userId, nor_id) {
    if (userId && fileName) {
      this.eqipmentService.onDownload(fileName, userId, nor_id)
      .subscribe((data:any)=>{
        console.log(data)
        const blob = new Blob([data], { type: 'application/attachment' });
        saveAs(blob, `${fileName}`);
      },(err:any)=>{
        console.log('err',err);
      })
    }
  }

  addequipment() {
    this.subUser = true;
  }

  // close modal pop up
  closeModal() {
    this.subUser = !this.subUser;
  }

  // delete equipment
  del(id) { }
}
@Component({
  selector: 'nordson-dialog-add-subuser',
  templateUrl: './dialog-add-equipment.html',
  styleUrls: ['./equipment-registration.component.css']
})
export class DailogAddEquipment implements OnInit {
  equipmentRegForm: FormGroup;
  equipments: any;
  disableButton: boolean = false;
  serialNoUidVal: string;
  constructor(
    public dialogRef: MatDialogRef<DailogAddEquipment>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private eqipmentService: EquipmentService,
    private userService: UserService,
    private toaster: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.equipmentRegForm = this.fb.group({
      equipment_model: ['PROBLUE FLEX'],
      equipment_pn: [
        '',
        [Validators.required]
      ],
      equipment_sn: [
        '',
        Validators.compose([Validators.required, validateSerialNo]),
      ],
      uid: [
        '',
        Validators.compose([Validators.required, validateUID]),
        // pass checkquipment api
      ],
      equipment_uid: [],
      equipment_description: ['',
      Validators.compose(
        [
        Validators.required, 
        Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")])
      ]
    },      
    {asyncValidators:  this.eqipmentService.ValidateEquipment()}
    );
  }
  uniqeEqupementErr=false;
  get f() {
     if(this.equipmentRegForm.errors?this.equipmentRegForm.errors.uniqueEquipment:false){
       this.uniqeEqupementErr=true;
     }else{
       this.uniqeEqupementErr=false;
     }
    return this.equipmentRegForm.controls;
  }

  // Add Model submit @Gaurav
  onSubmit() {
    let formData = this.equipmentRegForm.getRawValue();
    const userData = this.userService.setProfile();
    if (userData.Status === 'Success') {
      formData.user_id = userData.data.id;
      this.eqipmentService.addEquipment(formData,this.disableButton,this.dialogRef,this.toaster)
    }
  }

  onNoClick() {
    this.dialogRef.close();
    return false;
  }
  validateSerialNo() {
    let uid = this.equipmentRegForm.get('uid').value
    let serialNo = this.equipmentRegForm.get('equipment_sn').value
    this.serialNoUidVal = ''
    if (uid.length > 6 && serialNo.length > 9) {
      let data = {
        "uid": uid,
        "equipment_sn": serialNo
      }
      this.getConfigCode(uid, serialNo)
      // this.eqipmentService.getSerialNumValidation(data).subscribe(
      //   (data: any) => {
      //     this.getConfigCode(uid, serialNo)
      //     if (data != null) {
      //       if (data.status == 'Success') {
      //         this.getConfigCode(uid, serialNo)
      //       } else {
      //         this.equipmentRegForm.get('equipment_pn').setValue('')
      //         if (data.message) {
      //           this.serialNoUidVal = 'Serial Number and UID must Match'
      //         }
      //       }
      //     }
      //   }
      // );
    }
  }
  getConfigCode(uid, sno) {
    this.eqipmentService.getConfigurationCode({ "uid": uid, "sn": sno }).subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          let ccode = data.data.configuration_code;
          this.equipmentRegForm.get('equipment_pn').setValue(ccode)
        } else {
          this.equipmentRegForm.get('equipment_pn').setValue('')
          this.serialNoUidVal = 'Enter valid Serial Number and Unique Number to get Configuration Code'
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }
  preventalpha(event) {
    return this.authService.preventalpha(event);
  }
}

@Component({
  selector: 'nordson-dialog-edit-subuser',
  templateUrl: './dialog-edit-equipment.html',
  styleUrls: ['./equipment-registration.component.css']
})
export class DailogEditEquipment implements OnInit {
  editEquipmentForm: FormGroup;
  equiModel: any;
  serialNoUidVal: string = '';
  equipmentData: any;
  constructor(
    public dialogRef: MatDialogRef<DailogEditEquipment>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private eqipmentService: EquipmentService,
    private toaster: ToastrService,
    private authService: AuthService
  ) { }

  onNoClick() {
    this.dialogRef.close();
    return false;
  }

  ngOnInit() {
    const equipmentId = this.dialogRef.id;
    this.editEquipmentForm = this.fb.group({
      equipment_model: [''],
      equipment_pn: [
        '',
        [Validators.required]
      ],
      equipment_sn: [
        '',
        Validators.compose([Validators.required, validateSerialNo]),
      ],
      uid: [
        '',
        Validators.compose([Validators.required, validateUID]),
      ],
      equipment_description: ['',
      Validators.compose(
        [
        Validators.required, 
        Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")])
      ]
    });
    this.eqipmentService.getEquipment(equipmentId).subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          this.equipmentData = data.data
          this.equiModel = data.data.equipment_model;
          this.editEquipmentForm.patchValue({
            equipment_description: data.data.equipment_description,
            equipment_model: this.equiModel,
            equipment_pn: data.data.equipment_pn,
            equipment_sn: data.data.equipment_sn,
            uid: data.data.uid
          });
        }
      },
      err => {
        console.log('err', err);
      }
    );
  }

  get f() {
    return this.editEquipmentForm.controls;
  }

  onSubmit() {
    const equipmentId = this.dialogRef.id;
    const formData = this.editEquipmentForm.getRawValue();
    this.eqipmentService.updateEquipment(equipmentId, formData,this.toaster,this.dialogRef)
  }
  validateSerialNo() {
    let uid = this.editEquipmentForm.get('uid').value
    let serialNo = this.editEquipmentForm.get('equipment_sn').value
    //validate Serial NUmber
    this.serialNoUidVal = ''
    if (uid.toString().length > 6 && serialNo.length > 9) {
      if ((uid == this.equipmentData.uid.toString() && serialNo == this.equipmentData.equipment_sn)) {
        this.editEquipmentForm.get('equipment_pn').setValue(this.equipmentData.equipment_pn)
      } else {
        this.getConfigCode(uid, serialNo)
        // this.eqipmentService.getSerialNumValidation({ "uid": uid, "equipment_sn": serialNo }).subscribe(
        //   (data: any) => {
        //     this.getConfigCode(uid, serialNo)
        //     if (data != null) {
        //       if (data.status == 'Success') {
        //         this.getConfigCode(uid, serialNo)
        //       } else {
        //         this.editEquipmentForm.get('equipment_pn').setValue('')
        //         if (data.message) {
        //           this.serialNoUidVal = 'Serial Number and UID must Match'
        //         }
        //       }
        //     }
        //   }
        // );
      }
    }
  }
  getConfigCode(uid, sno) {
    this.eqipmentService.getConfigurationCode({ "uid": uid, "sn": sno }).subscribe(
      (data: any) => {
        if (data.Status === 'Success') {
          let ccode = data.data.configuration_code;
          this.editEquipmentForm.get('equipment_pn').setValue(ccode)
        } else {
          this.editEquipmentForm.get('equipment_pn').setValue('')
          this.serialNoUidVal = 'Enter valid Serial Number and Unique Number to get Configuration Code'
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }
  preventalpha(event) {
    return this.authService.preventalpha(event);
  }
}



@Component({
  selector: 'nordson-dialog-edit-norfile',
  templateUrl: './equipment-norfile-dialog.html',
  styleUrls: ['./equipment-registration.component.css']
})
export class DialogNorFileEquipment implements OnInit {
  description: string;
  norId: number;
  constructor(
    private eqipmentService: EquipmentService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<DialogNorFileEquipment>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,

  ) { }

  onNoClick() {
    this.dialogRef.close();
    return false;
  }
  ngOnInit() {
      this.description = this.dialogRef.componentInstance.data['description'];
      this.norId = this.dialogRef.componentInstance.data['norId'];
  }
  onSubmit() {
    let formatData = {
      "norfile_description": this.description,
      "nor_id": this.norId
    }
    this.eqipmentService.saveNorFileDesc(formatData,this.toaster,this.dialogRef)
  }
}
@Component({
  selector: 'nordson-logout-modal',
  templateUrl: './deletefileequip.html',
  styleUrls: ['./equipment-registration.component.css']
})
export class DeleteNorFileEquip implements OnInit{
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeleteNorFileEquip>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eqipmentService:EquipmentService,
    private toaster:ToastrService,
    private router: Router,
  ) {}
  ngOnInit(){
  }
 
  deleteNor(){
    this.eqipmentService.deleteNorFile({nor_id:this.dialogRef.componentInstance.data.nor_id?this.dialogRef.componentInstance.data.nor_id:''},this.dialogRef,this.toaster)
  }
  onNoClick(){
    this.dialogRef.close()
    return false;
  }

}
