import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { NetworkService } from '../../shared/network.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';
import { Router } from '@angular/router';
@Component({
  selector: 'nordson-public-wired-network',
  templateUrl: './public-wired-network.component.html',
  styleUrls: ['./public-wired-network.component.css']
})
export class PublicWiredNetworkComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  networkForm: FormGroup;
  errorMsg: any;
  accessType: any;
  load: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private networkService: NetworkService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }
  ngOnInit() {
    this.networkForm = this.fb.group({
      PublicDhpCli: [''],
      PublicSubnetMask: ['',Validators.required],
      PublicIPAddress: ['',Validators.required],
      ProfinetName: ['',Validators.required],
      GatewayIP: ['',Validators.required],
      ExternalCommLockout: ['']
    });
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
          obj.ExternalCommLockout = parseInt(obj.ExternalCommLockout);
          obj.PublicDhpCli = parseInt(obj.PublicDhpCli);
          this.networkForm.patchValue(obj);
          if(this.networkForm.get('PublicDhpCli').value){
            this.toogleDhCP('disable')
          }
          else{
            this.toogleDhCP('enable')
            
          } 
        }
      }, (err: any) => {
        console.log('err', err);
      });
    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
  isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
      return false;
  }
  toogleNetwork(e) {
    const networkForm=this.networkForm;
    if(!e.checked){
      networkForm.get('PublicDhpCli').patchValue(0)
      this.toogleDhCP('enable')
    }
    else{
      networkForm.get(`PublicDhpCli`).patchValue(1);
      this.toogleDhCP('disable')
     
    }
  }
  toogleDhCP(dhcpType){
    if(dhcpType==='enable'){
      this.networkForm.enable()
    }
    if(dhcpType==='disable'){
      this.networkForm.disable()
      this.networkForm.get('PublicDhpCli').enable()
    }
  }
  onSubmit() {
    const formData = this.networkForm.getRawValue();
    let validationStatus = true;
    const isValidIp = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/;
    const numbtext = /^[0-9a-zA-Z]+$/;
    const networkSettingForm = this.networkForm.controls;
    let focusField:string
    if (!networkSettingForm.GatewayIP.value.match(isValidIp)) {
      this.errorMsg = 'Invalid Gateway IP';
      validationStatus = false;
      focusField = 'GatewayIP'
    } else if (!networkSettingForm.PublicIPAddress.value.match(isValidIp)) {
      this.errorMsg = 'Invalid Public IP';
      validationStatus = false;
      focusField = 'PublicIPAddress'
    } else if (!networkSettingForm.PublicSubnetMask.value.match(isValidIp)) {
      this.errorMsg = 'Invalid Public Subnet IP ';
      validationStatus = false;
      focusField = 'someid'
    }
    if (!this.networkForm.valid || validationStatus === false) {
      const ele = this.aForm.nativeElement[focusField];
      if (ele) {
        ele.focus();
      }
      this.toastr.error(this.errorMsg, '', {
        timeOut: 3000
      });
    }
    else {
      this.networkForm.markAsPristine();
      this.networkService.updateNetwork(formData)
        .subscribe((data: any) => {
          if (data.status === 'success') {
            this.toastr.success('Public Wired Network updated successfully', '', {
              timeOut: 3000
            });
          }
        });
    }
  }  
}