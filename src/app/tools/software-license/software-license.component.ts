import { Component, OnInit } from '@angular/core';
import { LicenseService } from 'src/app/shared/license.service';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FlashserviceService } from 'src/app/shared/flashservice.service';
import { validateConfig } from '@angular/router/src/config';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  FormControl,
  Validators
} from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';

@Component({
  selector: 'nordson-software-license',
  templateUrl: './software-license.component.html',
  styleUrls: ['./software-license.component.css']
})
export class SoftwareLicenseComponent implements OnInit {
  showHide: boolean;
  softLic: boolean;
  selectedOption: string;
  key1: string;
  key2: string;
  key3: string;
  key4: string;
  dkey1: string;
  dkey2: string;
  dkey3: string;
  dkey4: string;
  addLicenseForm: FormGroup;
  removeLicenseForm: FormGroup;
  validateAddKey: boolean = false;
  validateEditKey: boolean = false;
  accessType: any;
  hideBtn:boolean=false;
  hideBtn2:boolean=false;
  removeBtn:boolean=true;
  removeBtn2:boolean=true;
  licenseObj=new Array();
  obj:any;
  obj2:any=[]
  noLicense:boolean=true;
  licenseObj2=new Array();

  licenseInfo = [
    { value: 0, productType: 'Web Server', type: '', status: '' },
    { value: 0, productType: 'PLC Communications', type: '', status: '' }
  ];

  constructor(
    private licenseService: LicenseService,
    private auth: AuthService,
    private flash: FlashserviceService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.showHide = false;
    this.softLic = false;
  }
  ngOnInit() {
    this.selectedOption = '10';
    this.getLicenseDetails();
    this.addLicenseForm = this.fb.group({
      key1: ['', [Validators.required, Validators.minLength(4)]],
      key2: ['', [Validators.required, Validators.minLength(4)]],
      key3: ['', [Validators.required, Validators.minLength(4)]],
      key4: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.removeLicenseForm = this.fb.group({
      dkey1: ['', [Validators.required, Validators.minLength(4)]],
      dkey2: ['', [Validators.required, Validators.minLength(4)]],
      dkey3: ['', [Validators.required, Validators.minLength(4)]],
      dkey4: ['', [Validators.required, Validators.minLength(4)]]
    });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
  // End of init

  add() {
    this.showHide = true;
  }

  getLicenseDetails() {
    this.licenseService.getLicenseDetails().subscribe(
      (data: any) => {
        if (data.status) {
          const res=data.data;
          this.noLicense=true;
          for(let key in res){
            for(let child in res[key])
            {
              if(res[key][child].isDisplay){
                this.noLicense=false;
                break;
              }
            }
            if(!this.noLicense) break;
          }
          // for add and remove button
          const swLicensee= res.Software_License
          const plc=swLicensee.PLC_COMMUNICATIONS.isDisplay
          const webServer= swLicensee.WEB_SERVER.isDisplay
          if(plc){
            this.removeBtn = true
          }
          else if(webServer){
            this.removeBtn=true
          }
          else {
            this.removeBtn = false;
          }
          if(webServer && plc){
            this.hideBtn = false;
            this.removeBtn=true;
          }
          else if(!webServer && !plc){
            this.hideBtn = true;
            this.removeBtn=false;
          }
          else this.hideBtn = true;
          
          // for loop for later if all keys required @Gaurav
          // for(let key in isActive){
          //   if(key=='PLC_COMMUNICATIONS'){
          //     if(isActive[key].isDisplay){
          //       this.hideBtn=true;
          //       this.removeBtn=true
          //       break;
          //     }
          //     else{
          //       this.hideBtn=false;
          //       this.removeBtn=false;
          //     } 
          //   }
          //   else if(key=='WEB_SERVER'){
          //     if(isActive[key].isDisplay){
          //       this.hideBtn2=true;
          //       this.removeBtn=true
          //       break;
          //     }
          //     else{
          //       this.hideBtn2=false;
          //       this.removeBtn=false;
          //     } 
          //   }
          //   else {
          //     this.removeBtn=false;
          //     this.hideBtn=false;
          //     this.hideBtn2=false;
          //   }
          // }

          this.obj=res;
          // this.licenseObj=Object.keys(res)
          // for(let i=0;i<this.licenseObj.length;i++){
          //   this.obj2=Object.keys(res[this.licenseObj[i]])
          // }
          for(let parent in this.obj){
            for(let child in this.obj[parent]){
              const {name,isDisplay,type,status}=this.obj[parent][child]
              if(isDisplay){
                  //console.log(name,isDisplay)
                  this.licenseObj2.push({
                    name,
                    isDisplay,
                    type,
                    status,
                    parentKey:parent
                  })
              }
            }
          }
          console.log(this.licenseObj2)
          
        }
      },
      err => {
        console.error('err', err);
      }
    );
  }
  edit() {
    this.softLic = true;
  }

  changeLicenseFor(event, value) {
    this.selectedOption = event.value as string;
  }

  onAddLicence() {
    // if value is 0000
    if(
      this.addLicenseForm.get('key1').value=="0000" 
      && this.addLicenseForm.get('key2').value=="0000"
      && this.addLicenseForm.get('key3').value=="0000"
      && this.addLicenseForm.get('key4').value=="0000"
    ){
      this.toastr.error('Invalid License Key', '', {
        timeOut: 3000
      });
      return;
    }
    var validLicense = 0;
    // var licenseKey = "" + this.key1 + "-" + this.key2 + "-" + this.key3 + "-" + this.key4;
    var licenseKey =
      this.addLicenseForm.value.key1 +
      '-' +
      this.addLicenseForm.value.key2 +
      '-' +
      this.addLicenseForm.value.key3 +
      '-' +
      this.addLicenseForm.value.key4;
    if (this.validateLicenseKey(this.addLicenseForm.value.key1)) {
      if (this.validateLicenseKey(this.addLicenseForm.value.key2)) {
        if (this.validateLicenseKey(this.addLicenseForm.value.key3)) {
          if (this.validateLicenseKey(this.addLicenseForm.value.key4)) {
            validLicense = 1;
          }
        }
      }
    }

    if (validLicense === 0) {
      this.toastr.error('Invalid License Key', '', {
        timeOut: 3000
      });
      return;
    }
    var licenseDetails = {
      productType: this.selectedOption,
      licKey: licenseKey
    };

    this.licenseService.addLicense(licenseDetails).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.licenseObj2=new Array()
          this.toastr.success('License added successfully', '', {
            timeOut: 3000
          });
          this.showHide = false;
          this.softLic = false;
          this.addLicenseForm.reset();
          this.getLicenseDetails();
        }
        else if(data.status === 'Fail'){
          this.toastr.error(data.message, '', {
            timeOut: 3000
          });
        }
      },
      err => {
        this.toastr.error('Error in adding License', err.error.message, {
          timeOut: 3000
        });
        console.error('err', err);
      }
    );
  }

  validateLicenseKey(key) {
    var str = key.toString();
    var sum = 0;
    for (var i = 0; i < str.length - 1; i++) {
      sum += parseInt(str.charAt(i), 10);
    }
    sum = sum % 10;
    if (sum == str[str.length - 1]) {
      return true;
    } else {
      return false;
    }
  }

  removeLicense() {
    // var licenseKey = this.dkey1 + "-" + this.dkey2 + "-" + this.dkey3 + "-" + this.dkey4;
    var licenseKey =
      this.removeLicenseForm.value.dkey1 +
      '-' +
      this.removeLicenseForm.value.dkey2 +
      '-' +
      this.removeLicenseForm.value.dkey3 +
      '-' +
      this.removeLicenseForm.value.dkey4;

    var licenseDetails = {
      licKey: licenseKey
    };

    this.licenseService.removeLicense(licenseDetails).subscribe(
      (data: any) => {
        if (data.status === 'Success') {
          this.licenseObj2=new Array()
          this.toastr.success('Removed License Key successfully', '', {
            timeOut: 3000
          });
          this.showHide = false;
          this.softLic = false;
          this.removeLicenseForm.reset();
          this.getLicenseDetails();
        }
        else if(data.status === 'Fail'){
          this.toastr.error(data.message, '', {
            timeOut: 3000
          });
        }
      },
      err => {
        this.toastr.error('', err.error.message, {
          timeOut: 3000
        });
        console.error('err', err);
      }
    );
  }

  close() {
    this.showHide = false;
    this.softLic = false;
    this.removeLicenseForm.reset();
    this.addLicenseForm.reset();
  }
  hide() {
    this.showHide = false;
  }
  validateRemoveNUmKey(type) {
    if (
      this.removeLicenseForm.value[type] && this.removeLicenseForm.value[type].toString().length == 4
    ) {
      this.validateEditKey = true;
    } else {
      this.validateEditKey = false;
    }
  }
  validateAddNUmKey(type) {
    if (
      this.addLicenseForm.value[type] && this.addLicenseForm.value[type].toString().length == 4 
     
    ) {
      this.validateAddKey = true;
    } else {
      this.validateAddKey = false;
    }
  }
  preventalpha(event) {
    return this.auth.preventalpha(event);
  }
}
