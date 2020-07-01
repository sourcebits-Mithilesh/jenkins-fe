import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';

import {switchToogle,sendToogleVal} from './switchToogle'
@Component({
  selector: 'nordson-web-server',
  templateUrl: './web-server.component.html',
  styleUrls: ['./web-server.component.css']
})
export class WebServerComponent implements OnInit {
  webServernetworkForm: FormGroup;
  errorMsg: any;
  accessType: any;
  load: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.webServernetworkForm = this.fb.group({
      External_Web_Access: [''],
      External_Web_AccessRO: ['']
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
          // implemet generic function inside plc network later @Gaurav
          console.log(obj.iExtWebSrvAcc)
          switchToogle(obj.iExtWebSrvAcc,true,this.webServernetworkForm)
        }
      }, (err: any) => {
        console.log('err', err);
      });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }

 
  onSubmit() {
    this.webServernetworkForm.markAsPristine();
    const formData = this.webServernetworkForm.getRawValue();
    const formVal=sendToogleVal(+formData.External_Web_Access,+formData.External_Web_AccessRO)
    this.authService.submitNetworPlc(formVal)
      .subscribe((data:any)=>{
        if(data.status=='success'){
          this.toastr.success('Web Server Updated Successfully', '', {
            timeOut: 3000
          });
        }
      },(err:any)=>{
        console.log('err',err)
      })
  }  

}
