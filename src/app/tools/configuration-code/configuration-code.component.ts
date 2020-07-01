import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  CFC_Ser,
  CFC_Tank,
  CFC_Pump,
  CFC_Warmup,
  CFC_NumHG,
  CFC_PresMgmt,
  CFC_ProdPerformUpgr,
  CFC_UI,
  CFC_PresSW
} from './configuration-range';
import { AuthService } from 'src/app/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SetupToolsService } from 'src/app/shared/setup-tools.service';
import { UserService } from 'src/app/user.service';
import { ToastrService } from 'ngx-toastr';
import { accessType } from 'src/app/settings/access-type-check';
import { parse } from 'querystring';


export interface DialogData {}
@Component({
  selector: 'nordson-configuration-code',
  templateUrl: './configuration-code.component.html',
  styleUrls: ['./configuration-code.component.css'],
  
})
export class ConfigurationCodeComponent implements OnInit {
  CFC_Ser = CFC_Ser;
  CFC_Tank = CFC_Tank;
  CFC_Pump = CFC_Pump;
  CFC_Warmup = CFC_Warmup;
  CFC_NumHG = CFC_NumHG;
  CFC_PresMgmt = CFC_PresMgmt;
  CFC_ProdPerformUpgr = CFC_ProdPerformUpgr;
  CFC_UI = CFC_UI;
  CFC_PresSW = CFC_PresSW;
  CODE: string;
  accessType: any;
  userType:any;
  originalCode: string;
  originalCodeDate: string;
  updatedCode:any[];
  loading: boolean;
  configCount:number;
  errorMsg:String='';
  currentCode:String;
  originalCodeErr:boolean=false;
  updatedCodeErr:boolean=false;

  constructor(
    public dialog: MatDialog, 
    public authService: AuthService, 
    private userService: UserService,
    private toaster: ToastrService) {}

  ngOnInit() {
    this.loading = true;
    let userData = this.userService.setProfile()
    if(userData) {
      this.userType = userData.data.user_type_id
      this.accessType = accessType.check(userData.data);
    }
    this.authService.getConfigCodeDataUpdatedCode().subscribe(
      (data: any) => {
        if (data.Status === true) {
          this.loading = false;
          //this.authService.setNorId(data.result.nor_id);
          this.originalCode = data.data.originalCode;
          this.originalCodeDate = data.data.originalCodeDate;
          this.currentCode = data.data.updatedCode.length>0 ? data.data.updatedCode.slice(-1):''
          if(!data.data.updatedCode.length){
            this.errorMsg='No Updated Code history found';
            this.originalCodeErr=true;
          }
          else{
            this.errorMsg='No Updated Code history found';
            this.originalCodeErr=false;
          }
        }
        else{
          if(data.message){
            this.CODE = "No Config code history found!";
          }
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );

    this.authService.getConfigCodeLog()
    .subscribe((data:any)=>{
      const {result,status}=data;
      if(status){
        this.configCount=result ? result.length : 0
        this.updatedCode=result
      }
      else if(!status){
        this.errorMsg='No Updated Code history found';
        this.updatedCodeErr=true;
      }
    },(err:any)=>{
      console.log('err',err);
    })

  }
  // getConfigData(configurationCode) {
  //   const CFC_Ser = configurationCode.CFC_Ser.Value;
  //   const CFC_Tank = configurationCode.CFC_Tank.Value;
  //   const CFC_Pump = configurationCode.CFC_Pump.Value;
  //   const CFC_Warmup =
  //     configurationCode.CFC_Warmup != undefined
  //       ? configurationCode.CFC_Warmup.Value
  //       : '';
  //   const CFC_NumHG = configurationCode.CFC_NumHG.Value;
  //   const CFC_PresMgmt = configurationCode.CFC_PresMgmt.Value;
  //   const CFC_ProdPerformUpgr = configurationCode.CFC_ProdPerformUpgr.Value;
  //   const CFC_UI = configurationCode.CFC_UI.Value;
  //   const CFC_PresSW = configurationCode.CFC_PresSW.Value;

  //   const toSelect1 = CFC_Ser != ''? this.CFC_Ser.find(c => c.id == CFC_Ser):null;
  //   const toSelect2 = CFC_Tank != '' ?this.CFC_Tank.find(c => c.id == CFC_Tank):null;
  //   const toSelect3 = CFC_Pump !='' ? this.CFC_Pump.find(c => c.id == CFC_Pump):null;
  //   const toSelect4 = CFC_Warmup != '' ? this.CFC_Warmup.find(c => c.id == CFC_Warmup):null;
  //   const toSelect5 = CFC_NumHG != '' ?this.CFC_NumHG.find(c => c.id == CFC_NumHG):null;
  //   const toSelect6 = CFC_PresMgmt != '' ?this.CFC_PresMgmt.find(c => c.id == CFC_PresMgmt):null;
  //   const toSelect7 =  CFC_ProdPerformUpgr != ''?this.CFC_ProdPerformUpgr.find(
  //     c => c.id == CFC_ProdPerformUpgr
  //   ):null;
  //   const toSelect8 = CFC_UI != '' ? this.CFC_UI.find(c => c.id == CFC_UI):null;
  //   const toSelect9 = CFC_PresSW != '' ?this.CFC_PresSW.find(c => c.id == CFC_PresSW):null;

  //   let ConfigCode = `
  //       ${toSelect1.name}//${toSelect2.name}
  //       //${toSelect3.name}//${toSelect4.name}
  //       //${toSelect5.name}//${toSelect6.name}
  //       //${toSelect7.name}//${toSelect8.name}
  //       //${toSelect9.name}
  //       `;
  //       console.log('originalCode11', ConfigCode)
  //   return ConfigCode;
  // }
  // viewConfig(): void {
  //   const dialogRef = this.dialog.open(ViewConfigurationCode, {
  //     width: '800px',
  //     height: '130%',
  //     panelClass: 'viewConfig',
  //     data: this.CODE,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {});
  // }
  editconfig(): void {
    const dialogRef = this.dialog.open(EditConfigurationCode, {
      width: '800px',
      height: '130%',
      panelClass: 'editConfig',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.type=='submit') this.ngOnInit();
    });
  }
  viewConfig(): void {
    const dialogRef = this.dialog.open(ViewModal, {
      width: '800px',
      height: '130%',
      panelClass: 'viewConfigcode',
      disableClose: true,
      data: this.originalCode
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.type=='submit') this.ngOnInit();
    });
  }
}

@Component({
  selector: 'view-configuration-code',
  templateUrl: './view-configuration-code.html',
  styleUrls: ['./configuration-code.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewModal implements OnInit {
  CODE: any;
  CFC_Ser = CFC_Ser;
  CFC_Tank = CFC_Tank;
  CFC_Pump = CFC_Pump;
  CFC_Warmup = CFC_Warmup;
  CFC_NumHG = CFC_NumHG;
  CFC_PresMgmt = CFC_PresMgmt;
  CFC_ProdPerformUpgr = CFC_ProdPerformUpgr;
  CFC_UI = CFC_UI;
  CFC_PresSW = CFC_PresSW;
  toSelect1;
  toSelect2;
  toSelect3;
  toSelect4;
  toSelect5;
  toSelect6;
  toSelect7;
  toSelect8;
  toSelect9;
  modalLoaded:boolean=false
  constructor(
    public dialogRef: MatDialogRef<ViewModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.modalLoaded=true
          // this.CODE=data.result.configurationCode
          const configurationCode = data.result.configurationCode;
          this.CODE = configurationCode.UnitConfigCode.Value;
          const CFC_Ser = configurationCode.CFC_Ser.Value;
          const CFC_Tank = configurationCode.CFC_Tank.Value;
          const CFC_Pump = configurationCode.CFC_Pump.Value;
          const CFC_Warmup =
            configurationCode.CFC_Warmup != undefined
              ? configurationCode.CFC_Warmup.Value
              : '';
          const CFC_NumHG =
            configurationCode.CFC_NumHG != undefined
              ? configurationCode.CFC_NumHG.Value
              : "0";
          const CFC_PresMgmt =
            configurationCode.CFC_PresMgmt != undefined
              ? configurationCode.CFC_PresMgmt.Value
              : '';
          const CFC_ProdPerformUpgr =
            configurationCode.CFC_ProdPerformUpgr != undefined
              ? configurationCode.CFC_ProdPerformUpgr.Value
              : '';
          const CFC_UI =
            configurationCode.CFC_UI != undefined
              ? configurationCode.CFC_UI.Value
              : "0";
          const CFC_PresSW =
            configurationCode.CFC_PresSW != undefined
              ? configurationCode.CFC_PresSW.Value
              : '';

          this.toSelect1 = this.CFC_Ser.find(c => c.id == CFC_Ser);
          this.toSelect2 = this.CFC_Tank.find(c => c.id == CFC_Tank);
          this.toSelect3 = this.CFC_Pump.find(c => c.id == CFC_Pump);

          this.toSelect4 =
            CFC_Warmup != ''
              ? this.CFC_Warmup.find(c => c.id == CFC_Warmup)
              : '';
          this.toSelect5 =
            CFC_NumHG != undefined ? this.CFC_NumHG.find(c => c.id == CFC_NumHG) : "0";
          this.toSelect6 =
            CFC_PresMgmt != ''
              ? this.CFC_PresMgmt.find(c => c.id == CFC_PresMgmt)
              : '';
          this.toSelect7 =
            CFC_ProdPerformUpgr != ''
              ? this.CFC_ProdPerformUpgr.find(c => c.id == CFC_ProdPerformUpgr)
              : '';
          this.toSelect8 =
            CFC_UI != undefined ? this.CFC_UI.find(c => c.id == CFC_UI) :"0";
          this.toSelect9 =
            CFC_PresSW != ''
              ? this.CFC_PresSW.find(c => c.id == CFC_PresSW)
              : '';
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }
  closeViewConfig(): void {
    this.dialogRef.close({type:'cancel'});
  }
}

@Component({
  selector: 'edit-configuration-code',
  templateUrl: './edit-configuration-code.html',
  styleUrls: ['./configuration-code.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditConfigurationCode implements OnInit {
  CFC_Ser:any = CFC_Ser;
  CFC_Tank = CFC_Tank;
  CFC_Pump = CFC_Pump;
  CFC_Warmup = CFC_Warmup;
  CFC_NumHG:any = CFC_NumHG;
  CFC_PresMgmt:any = CFC_PresMgmt;
  CFC_ProdPerformUpgr:any = CFC_ProdPerformUpgr;
  CFC_UI:any = CFC_UI;
  CFC_PresSW = CFC_PresSW;
  editconfigForm: FormGroup;
  toSelect5;
  toSelect6;
  toSelect8;
  accessType: number;
  constructor(
    public dialogRef: MatDialogRef<EditConfigurationCode>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService,
    private fb: FormBuilder,
    private setupService: SetupToolsService,
    private toast: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.editconfigForm = this.fb.group({
      CFC_Ser: [this.CFC_Ser],
      CFC_Tank: [this.CFC_Tank],
      CFC_Pump: [this.CFC_Pump],
      CFC_Warmup: [this.CFC_Warmup],
      CFC_NumHG: [this.CFC_NumHG],
      CFC_PresMgmt: [this.CFC_PresMgmt],
      CFC_UI: [this.CFC_UI],
      CFC_ProdPerformUpgr: [this.CFC_ProdPerformUpgr],
      CFC_PresSW: [this.CFC_PresSW]
    });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
    this.authService.getxmlData().subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.authService.setNorId(data.result.nor_id);
          let configurationCode = data.result.configurationCode;
          delete configurationCode.UnitConfigCode;
          
          this.CFC_Ser=configurationCode.CFC_Ser?this.CFC_Ser.filter(item=>parseInt(item.id)=== parseInt(configurationCode.CFC_Ser.Value)):this.CFC_Ser
          this.CFC_NumHG=configurationCode.CFC_NumHG?this.CFC_NumHG.filter(item=>parseInt(item.id)=== parseInt(configurationCode.CFC_NumHG.Value)):this.CFC_NumHG
          this.CFC_PresMgmt=configurationCode.CFC_PresMgmt?this.CFC_PresMgmt.filter(item=>parseInt(item.id)=== parseInt(configurationCode.CFC_PresMgmt.Value)):this.CFC_PresMgmt
          this.CFC_ProdPerformUpgr=configurationCode.CFC_ProdPerformUpgr?this.CFC_ProdPerformUpgr.filter(item=>parseInt(item.id)=== parseInt(configurationCode.CFC_ProdPerformUpgr.Value)):this.CFC_ProdPerformUpgr
          this.CFC_UI=configurationCode.CFC_UI?this.CFC_UI.filter(item=>parseInt(item.id)=== parseInt(configurationCode.CFC_UI.Value)):this.CFC_UI
          
          let obj:any={};
          for (let configcode in configurationCode) {
            const key= this.editconfigForm.get(configcode).value
            obj[configcode] = key.find(c => parseInt(c.id) ==parseInt(configurationCode[configcode].Value))
          }
          this.editconfigForm.patchValue(obj);
          const configForm=this.editconfigForm.value;
          // set default value if xml tag is not available
          for(let key in configForm){
            if(configForm[key].length>1){
             key==='CFC_Ser'? obj[key]=configForm[key].find(c => c.id ==1) : obj[key]=configForm[key].find(c => c.id ==0)
            }
          }
          this.editconfigForm.patchValue(obj);
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    )
  }

  onSubmit() {
    const formData = this.editconfigForm.getRawValue();
    let formObj={};
    if(formData){
    for(let configForm in formData){
      formObj[configForm]=formData[configForm].id
    }
    }
    this.editconfigForm.markAsPristine();
    this.setupService.updateConfigurationCode(formObj).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.toast.success('Configuration Code Updated Successfully', '', {
            timeOut: 3000
          });
          this.dialogRef.close({type:'submit'});
        }
      },
      (err: any) => {
        console.log('err', err);
      }
    );
  }

  closeEditConfig(): void {
    this.dialogRef.close({type:'cancel'});
  }
}
