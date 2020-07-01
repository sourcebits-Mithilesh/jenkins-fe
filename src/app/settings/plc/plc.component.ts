import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { NetworkService } from '../../shared/network.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';
import { Router } from '@angular/router';

import {plcIOConfig,CCLinkBaud,mapWithFormKey} from './networkPlcConfig'

@Component({
  selector: 'nordson-plc',
  templateUrl: './plc.component.html',
  styleUrls: ['./plc.component.css']
})
export class PlcComponent implements OnInit {
  plcNetworkForm: FormGroup;
  errorMsg: any;
  accessType: any;
  load: boolean = false;
  plcIORange=plcIOConfig
  CCLinkBaudRange=CCLinkBaud;
  errors:any=new Array();
  editIcon=true;
  xmlProfinetName: any;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private networkService: NetworkService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }
  ngOnInit() {
    this.plcNetworkForm = this.fb.group({
      plcAccess: [''],
      plcAccessRead: [''],
      PlcIO: [''],
      ProfibusAddr: ['Profibus Device Address',Validators.compose([
        Validators.required,
        //Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")
      ])],
      ProfinetName: ['Profinet Station Name',Validators.compose([
        Validators.required,
        Validators.pattern("^([a-z0-9]+ )+[a-z0-9]+$|^[a-z0-9-.]+$")
      ])],
      CCLinkAddr: ['CC-Link Station Number',Validators.compose([
        Validators.required,
        //Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")
      ])],
      CCLinkBaud:[''],
      PwrLnkNdId:[1,Validators.compose([Validators.required])],
      SercosIIIAddr:['',Validators.compose([Validators.required])],
      CCLinkIEFAddr:['',Validators.compose([Validators.required])]
    });
    this.plcNetworkForm.get(`ProfinetName`).disable();
    this.authService.getxmlData()
      .subscribe((data: any) => {
        if (data.status === 'Success') {
          this.authService.setNorId(data.result.nor_id);
          this.load = true;
          const networkData = data.result.communicationNetwork;
          let obj: any = {};
          for (let plcnNetwork in networkData) {
             obj[plcnNetwork] = networkData[plcnNetwork].Value
          }
          this.xmlProfinetName = obj.ProfinetName;
          obj.PlcIO=obj.PlcIO ? this.plcIORange.find(c => c.id ==obj.PlcIO) : this.plcIORange.find(c => c.id ==0)
          obj.CCLinkBaud=obj.CCLinkBaud ? this.CCLinkBaudRange.find(c => c.id ==obj.CCLinkBaud) :this.CCLinkBaudRange.find(c => c.id ==2)
          this.tooglePLcAccess(obj.ExternalCommLockout,true)
          this.plcNetworkForm.patchValue(obj);
        }
      }, (err: any) => {
        console.log('err', err);
      });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
 
  tooglePLcAccess(obj,istooglePLcAccess){
    if(obj){
      const toInt=parseInt(obj);
      switch(toInt) {
        case 0:
          //this.sendToogleVal(false,false,istooglePLcAccess)
          this.sendToogleVal(true,false,istooglePLcAccess)
          break;
        case 1:
          this.sendToogleVal(false,false,istooglePLcAccess)
          break;
        case 2:
          this.sendToogleVal(true,true,istooglePLcAccess)
          break;
        case 3:
          this.sendToogleVal(false,true,istooglePLcAccess)
          break;
        default:
      }
      
    }
  }

  sendToogleVal(f,t,istooglePLcAccess?){
    let plcObj={};
    if(istooglePLcAccess){
      plcObj={
        plcAccess:f,
        plcAccessRead:t
      }
      this.plcNetworkForm.patchValue(plcObj)
    }
    else{
      if(f===0 && t===0){
        plcObj={ExternalCommLockout:1}
      }
      else if(f===1 && t===0){
        plcObj={ExternalCommLockout:0}
      }
      else if(f===0 && t===1){
        plcObj={ExternalCommLockout:3}
      }
      else if(f===1 && t===1){
        plcObj={ExternalCommLockout:2}
      }
      return plcObj;
    }
    
  }
  
  toogle(e,type) {
    console.log(e.checked,type)
  }

  editHose(){
    this.plcNetworkForm.get(`ProfinetName`).enable();
   this.editIcon=!this.editIcon;

  }
  
  onSubmit() {
    this.plcNetworkForm.markAsPristine();
    const formData = this.plcNetworkForm.getRawValue();
    let validationStatus = true;
    for(let key in this.plcNetworkForm.controls){
      const formKey=key;
      const formError=this.plcNetworkForm.controls[key].errors
      if(formError){
        this.errors.push(formKey,formError)
      }
    }
    // Show Validation
    if(this.errors.length>0){
      let str='';
      let formKey:any='';
      const key=this.errors[0]
      formKey=mapWithFormKey[key];
      if(this.errors[1].hasOwnProperty('required')){
        str=`${formKey.label} can not be empty`;
      }
      else if(this.errors[1].hasOwnProperty('pattern')){
        if(this.errors[0] == "ProfinetName"){
          this.plcNetworkForm.get("ProfinetName").patchValue(this.xmlProfinetName);
        }
        str=`Invalid value for ${formKey.label}`;
        this.editIcon=true
      }
      else if(this.errors[1].hasOwnProperty('min')){
        str=`${formKey.label} value should be between ${formKey.min} and ${formKey.max}`;
      }
      else if(this.errors[1].hasOwnProperty('max')){
        str=`${formKey.label} value should be between ${formKey.min} and ${formKey.max}`;
      }
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();  
      this.toastr.error(`${str}`, '', {
        timeOut: 3000
      });
      this.errors=new Array()
      return;
    }
    // submit data
    if(formData && this.errors.length<1){
      const alphanum = /^(?!\.|-)[\w.-]*$(?<!\.|\-)/; //no hyphen in starting and in ending
      const ipaddress = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
      const port = /^((?!port-[0-9]).)*$/;
      if(formData.ProfinetName != this.xmlProfinetName){
        if(!formData.ProfinetName.match(alphanum)){
          validationStatus = false;
          this.plcNetworkForm.get("ProfinetName").patchValue(this.xmlProfinetName);
          this.toastr.error(`Invalid value for Profinet Station Name`, '', {
            timeOut: 3000
          });
          this.editIcon=true
        }
        if(formData.ProfinetName.match(ipaddress)){
          validationStatus = false;
          this.plcNetworkForm.get("ProfinetName").patchValue(this.xmlProfinetName);
          this.toastr.error(`Invalid value for Profinet Station Name`, '', {
            timeOut: 3000
          });
          this.editIcon=true
        }
        if(!formData.ProfinetName.match(port)){
          validationStatus = false;
          this.plcNetworkForm.get("ProfinetName").patchValue(this.xmlProfinetName);
          this.toastr.error(`Invalid value for Profinet Station Name`, '', {
            timeOut: 3000
          });
          this.editIcon=true
        }
      }
      if(validationStatus){
        this.xmlProfinetName = formData.ProfinetName;
        const tooglePLc=this.sendToogleVal(+formData.plcAccess,+formData.plcAccessRead)
        const obj={PlcIO:formData.PlcIO.id,CCLinkBaud:formData.CCLinkBaud.id}
        const {plcAccessRead,plcAccess,...data}=formData;
        const formVal={...data,...tooglePLc,...obj}
        this.authService.submitNetworPlc(formVal)
        .subscribe((data:any)=>{
          if(data.status=='success'){
            this.errors=new Array()
            this.toastr.success('Network PLC Updated Successfully', '', {
              timeOut: 3000
            });
            //this.editIcon=!this.editIcon;
            this.editIcon=true
          }
          
        },(err:any)=>{
          console.log('err',err)
        })
      } 
    }
  }
    
}
