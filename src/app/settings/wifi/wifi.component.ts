import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { NetworkService } from '../../shared/network.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';
import { Router } from '@angular/router';
import {Channel,WAP_Mode,mapWithFormKey} from './config'
import {switchToogle,sendToogleVal} from './switchToogle'

@Component({
  selector: 'nordson-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.css']
})
export class WifiComponent implements OnInit {
  wifiNetworkForm: FormGroup;
  errorMsg: any;
  accessType: any;
  load: boolean = false;
  channnelRange=Channel;
  clientRange=Channel.filter(channel => channel.id <5)
  wapModeRange=WAP_Mode;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  editIcon:Boolean=true;
  errors:any=new Array();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private networkService: NetworkService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }
  ngOnInit() {
    this.wifiNetworkForm = this.fb.group({
      WAP_SSID:['',Validators.compose([
        Validators.required,
        Validators.pattern("^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$")
      ])],
      WAP_SecPwd:['',Validators.compose([
        Validators.required
      ])],
      WAP_MaxClients:[''],
      WAP_ChNum:[''],
      WAP_SecType:[''],
      SSID_ON:[''],
      SSID_BROADCAST_ON:['']
    });

    this.wifiNetworkForm.get(`WAP_SSID`).disable();

    this.authService.getxmlData()
      .subscribe((data: any) => {
        if (data.status === 'Success') {
          this.authService.setNorId(data.result.nor_id);
          this.load = true;
          const networkData = data.result.communicationNetwork;
          let obj: any = {};
          for (let network in networkData) {
            obj[network] = networkData[network].Value;
          }
          obj.WAP_ChNum=obj.WAP_ChNum ? this.channnelRange.find(c => c.id ==obj.WAP_ChNum) : this.channnelRange.find(c => c.id ==0)
          obj.WAP_MaxClients=obj.WAP_MaxClients ? this.clientRange.find(c => c.id == obj.WAP_MaxClients) :this.clientRange.find(c => c.id ==1)
          obj.WAP_SecType=obj.WAP_SecType ? this.wapModeRange.find(c => c.id == obj.WAP_SecType) :this.wapModeRange.find(c => c.id ==1)
          switchToogle(obj.WAP_Mode,true,this.wifiNetworkForm)
          this.wifiNetworkForm.patchValue(obj);
        }
      }, (err: any) => {
        console.log('err', err);
      });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

  editSSID(){
    this.wifiNetworkForm.get(`WAP_SSID`).enable();
    this.editIcon=!this.editIcon
  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  onSubmit() {
    this.wifiNetworkForm.markAsPristine();
    for(let key in this.wifiNetworkForm.controls){
      const formKey=key;
      const formError=this.wifiNetworkForm.controls[key].errors
      if(formError){
        this.errors.push(formKey,formError)
      }
    }
    if(this.errors.length>0){
      let str='';
      let formKey='';
      const key=this.errors[0]
      formKey=mapWithFormKey[key];

      if(this.errors[1].hasOwnProperty('maxlength') || this.errors[1].hasOwnProperty('minlength')){
        const json=this.errors[1]['maxlength'] || this.errors[1]['minlength']
        if(json.hasOwnProperty('requiredLength')){
          const errorStr=json['requiredLength']
          str=`${formKey} must be between 8 and 63 Characters`;
        }
      }
      else if(this.errors[1].hasOwnProperty('required')){
        const json=this.errors[1]['required']
        str=`${formKey} can not be empty`;
      }
      else if(this.errors[1].hasOwnProperty('pattern')){
        str=`Invalid value for ${formKey}`;
      }
      let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
      invalidFields[1].focus();  
      this.toastr.error(`${str}`, '', {
        timeOut: 3000
      });
      this.errors=new Array()
      return;
    }

    
    const formData = this.wifiNetworkForm.getRawValue();
    if(formData && this.errors.length<1){
      let obj;
      const {WAP_Mode}:any=sendToogleVal(+formData.SSID_ON,+formData.SSID_BROADCAST_ON)
      if(formData){
      obj={
        WAP_SSID:formData.WAP_SSID,
        WAP_SecPwd:formData.WAP_SecPwd,
        WAP_MaxClients:formData.WAP_MaxClients.id,
        WAP_ChNum: formData.WAP_ChNum.id,
        WAP_SecType: formData.WAP_SecType.id,
        WAP_Mode:WAP_Mode
      }
    }
      this.authService.submitNetworPlc(obj)
      .subscribe((data:any)=>{
        if(data.status=='success'){
          this.editIcon=!this.editIcon
          this.errors=new Array()
          this.toastr.success('Wifi Updated Successfully', '', {
            timeOut: 3000
          });
        }
        
      },(err:any)=>{
        console.log('err',err)
      })
    }
    
  }
       

}
