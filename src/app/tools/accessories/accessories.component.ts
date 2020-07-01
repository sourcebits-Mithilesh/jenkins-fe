import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { AccessoriesService } from './accessories.service';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import { accessType } from 'src/app/settings/access-type-check';

@Component({
  selector: 'nordson-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.css']
})
export class AccessoriesComponent implements OnInit {
  showHide: boolean;
  subUser: boolean;
  transformerRange: any;
  accessoryType = 'transformer';
  addAccessory: any;
  trasnformerData: string;
  selectedVal: any;
  modifyAccessory: string;
  accessType: any;
  addStatus: boolean = false;
  modifyStatus: boolean = false;
  ioAccessories:any=[];
  baseAccessories:any=[];
  modifyAccessory2: any;
  transformerValue: any;
  constructor(
    private authService: AuthService,
    private accessories: AccessoriesService,
    private userService: UserService
  ) {
    this.showHide = false;
    this.subUser = false;
  }

  ngOnInit() {
    this.transformerRange = [
      { name: 'None', value: 0 },
      { name: '3.0 KVA Small', value: 1 },
      { name: '3.0 KVA Medium', value: 2 },
      { name: '9.0 KVA Small', value: 3 },
      { name: '9.0 KVA Medium', value: 4 },
      { name: '9.0 KVA Large', value: 5 },
      { name: '13.5 KVA Remote', value: 6 }
    ];
    this.getTransformerdata();

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
  }
  removeLastComma(strng) {
    var n = strng.lastIndexOf(',');
    var a = strng.substring(0, n);
    return a;
  }

  getTransformerdata() {
    this.authService.getxmlData().subscribe((data: any) => {
      this.authService.setNorId(data.result.nor_id);
      const accssMgmt=data.result.accessoriesManagement;
      this.trasnformerData =
        data.result.accessoriesManagement.CFC_Xformer.Value;
      let transformerValue =
        data.result.accessoriesManagement.CFC_Xformer.Value;
      this.transformerValue=transformerValue
      this.modifyAccessory = this.transformerRange[transformerValue].value;
      this.addAccessory = this.transformerRange[transformerValue].value;
      if (transformerValue != '') {
        this.selectedVal = transformerValue.split(',').map(Number);
        this.transformerRange.forEach(obj => {
          if (this.selectedVal.some(val => val == obj.value)) {
            this.trasnformerData = obj.name.trim();
          }
        });
      }
      
      this.validateIfaceAcc(accssMgmt)
      this.validateBaseCtrl(accssMgmt)
    });
  }

  validateIfaceAcc(accssMgmt){
    let IfaceAccset=new Set();
    // push unique values only
    if(accssMgmt.CFC_IfaceAcc0.Value=="0"){
      IfaceAccset.add('No Signal Light Membrane')
    }
    else if(accssMgmt.CFC_IfaceAcc0.Value=="1"){
      IfaceAccset.add('A Signal Light Membrane')
    }
    if(accssMgmt.CFC_IfaceAcc1.Value=="0"){
      IfaceAccset.add('No 7” Touch Screen')
    }
    else if(accssMgmt.CFC_IfaceAcc1.Value=="1"){
      IfaceAccset.add('A 7” Touch Screen')
    }
    if(accssMgmt.CFC_IfaceAcc2.Value=="0"){
      IfaceAccset.add('No WiFi card is present')
    }
    else if(accssMgmt.CFC_IfaceAcc2.Value=="1"){
      IfaceAccset.add('A WiFi card is present')
    }
    if(accssMgmt.CFC_IfaceAcc3.Value=="0"){
      IfaceAccset.add('No Light tower board is present')
    }
    else if(accssMgmt.CFC_IfaceAcc3.Value=="1"){
      IfaceAccset.add('A Light tower board is present')
    }
    this.ioAccessories=[...IfaceAccset]
    //return [...this.ioAccessories]
  }

  validateBaseCtrl(accssMgmt){
    let BaseCtrlset=new Set();
    if(accssMgmt.CFC_BaseCtrl0.Value=="0"){
      BaseCtrlset.add('No Ecobead 4 channel')
    }
    else if(accssMgmt.CFC_BaseCtrl0.Value=="1"){
      BaseCtrlset.add('Ecobead 4 channel')
    }
    if(accssMgmt.CFC_BaseCtrl1.Value=="0"){
      BaseCtrlset.add('No Ecobead 8 channel')
    }
    else if(accssMgmt.CFC_BaseCtrl1.Value=="1"){
      BaseCtrlset.add('Ecobead 8 channel')
    }
    if(accssMgmt.CFC_BaseCtrl2.Value=="0"){
      BaseCtrlset.add('No Pattern Control 4 channel')
    }
    else if(accssMgmt.CFC_BaseCtrl2.Value=="1"){
      BaseCtrlset.add('Pattern Control 4 channel')
    }
    if(accssMgmt.CFC_BaseCtrl3.Value=="0"){
      BaseCtrlset.add('No Pattern Control 8 channel')
    }
    else if(accssMgmt.CFC_BaseCtrl3.Value=="1"){
      BaseCtrlset.add('Pattern Control 8 channel')
    }
    if(accssMgmt.CFC_BaseCtrl4.Value=="0"){
      BaseCtrlset.add('No Verification 4 channel')
    }
    else if(accssMgmt.CFC_BaseCtrl4.Value=="1"){
      BaseCtrlset.add('Verification 4 channel')
    }
    if(accssMgmt.CFC_BaseCtrl5.Value=="0"){
      BaseCtrlset.add('No Verification 8 channel')
    }
    else if(accssMgmt.CFC_BaseCtrl5.Value=="1"){
      BaseCtrlset.add('Verification 8 channel')
    }
    if(accssMgmt.CFC_BaseCtrl6.Value=="0"){
      BaseCtrlset.add('No 2 Hose/Gun Expansion')
    }
    else if(accssMgmt.CFC_BaseCtrl6.Value=="1"){
      BaseCtrlset.add('A 2 Hose/Gun Expansion')
    }
    this.baseAccessories=[...BaseCtrlset]
  }

  addAccessories() {
    //this.fillForm.markAsPristine();
    let DataFormat = {
      CFC_Xformer: this.addAccessory
    };
    this.callAccessoriesAPI(DataFormat);
  }
  updateAccessory() {
    let DataFormat = {
      CFC_Xformer: this.modifyAccessory
    };
    this.callAccessoriesAPI(DataFormat);
  }
  deleteAccessory() {
    let DataFormat = {
      CFC_Xformer: 0
    };
    this.callAccessoriesAPI(DataFormat);
  }

  callAccessoriesAPI(DataFormat) {
    this.accessories.accessoriesOperations(DataFormat).subscribe(
      (data: any) => {
        if (data.status == 'success') {
          this.close();
          this.getTransformerdata();
        }
      },
      (err: Error) => {
        console.log('error xml Data', err);
      }
    );
  }
  add() {
    this.showHide = true;
  }
  edit() {
    //this.transformerRange=this.transformerRange.filter(item=>item.name!='None')
    this.modifyAccessory = this.transformerRange[this.transformerValue].value;
    console.log(this.modifyAccessory)
    this.subUser = true;
  }
  close() {
    this.modifyAccessory = this.transformerRange[this.transformerValue].value;
    this.showHide = false;
    this.subUser = false;
    this.modifyStatus = false;
    this.addStatus = false;
  }
  addAccesStatus() {
    this.addStatus = true;
  }
  modifyAccesStatus() {
    this.modifyStatus = true;
  }
}
