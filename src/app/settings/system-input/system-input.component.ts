import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { range } from '../system-input/input-range';
import { stdrange } from '../system-input/std-input-range';
import { FlashserviceService } from 'src/app/shared/flashservice.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { accessType } from '../access-type-check';
import { LanguageService } from 'src/app/share/language.service';

@Component({
  selector: 'nordson-system-input',
  templateUrl: './system-input.component.html',
  styleUrls: ['./system-input.component.css']
})
export class SystemInputComponent implements OnInit {
  systemForm: FormGroup;
  accessType: any;
  ranges = range;
  stdranges = stdrange;
  select5;
  toSelect5;
  toSelect6;
  toSelect7;
  toSelect8;
  curretSelect:any;
  isDisabled:any ={};
  defaultInputOptions1: number;
  defaultInputOptions2: number;
  defaultInputOptions3: number;
  defaultInputOptions4: number;
  trackingSystemIO: { 'InputOptions1': number; 'InputOptions2': number; 'InputOptions3': number; 'InputOptions4': number; };
  valueLanguage: boolean = true;
  isL1CheckboxDisabled: boolean = false;
  isL2CheckboxDisabled: boolean = false;
  isL3CheckboxDisabled: boolean = false;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private flash: FlashserviceService,
    private toastr: ToastrService,
    private userService: UserService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.languageChange.subscribe(data => {
      this.valueLanguage = !this.valueLanguage;
    })
    this.systemForm = this.fb.group({
      InputOptions0: [''],
      InputOptions1: [''],
      InputOptions2: [''],
      InputOptions3: [''],
      InputOptions4: [''],
      InvertOutput0: [''],
      InvertOutput1: [''],
      InvertOutput2: [''],
      InvertOutput3: [''],
      InvertOutput4: ['']
    });

    let userData = this.userService.setProfile()
    if(userData) {
      this.accessType = accessType.check(userData.data);
    }
    this.authService.getxmlData().subscribe((data: any) => {
      
      if (data.status === 'Success') {
        this.authService.setNorId(data.result.nor_id);
        const InputOptios = data.result.systemIoControll.InputOptions;
        const InputOptions0 = parseInt(InputOptios.InputOptions0.Value);
        const InputOptions1 = parseInt(InputOptios.InputOptions1.Value);
        const InputOptions2 = parseInt(InputOptios.InputOptions2.Value);
        const InputOptions3 = parseInt(InputOptios.InputOptions3.Value);
        const InputOptions4 = parseInt(InputOptios.InputOptions4.Value);
        //filter dropdown values
        // if(InputOptions1==0 && InputOptions2 ==0 && InputOptions3==0 && InputOptions4 == 0){
          // const ranges = this.ranges;
          this.toSelect8 =[...this.ranges];
          console.log("option1 index",this.toSelect8.findIndex(c => c.id == 29));
          this.toSelect8.splice(this.toSelect8.findIndex(c => c.id == 29),1);
          this.toSelect7 =[...this.ranges];
          // this.toSelect7.splice(16,1);
          this.toSelect7.splice(this.toSelect7.findIndex(c => c.id == 29),1);
          this.toSelect7.splice(this.toSelect7.findIndex(c => c.id == 27),1);
          this.toSelect6 =[...this.ranges];
          // this.toSelect6.splice(16,1);
          this.toSelect6.splice(this.toSelect6.findIndex(c => c.id == 29),1);
          this.toSelect6.splice(this.toSelect6.findIndex(c => c.id == 27),1);
          this.toSelect6.splice(this.toSelect6.findIndex(c => c.id == 26),1);
          this.toSelect5 = [...this.ranges];
          this.toSelect5.splice(this.toSelect5.findIndex(c => c.id == 29),1);
          this.toSelect5.splice(this.toSelect5.findIndex(c => c.id == 27),1);
          this.toSelect5.splice(this.toSelect5.findIndex(c => c.id == 26),1);
          this.toSelect5.splice(this.toSelect5.findIndex(c => c.id == 25),1);
        // }
        // else{
          // this.toSelect8 = this.ranges.filter(c => c.id !=InputOptions3 && c.id !=InputOptions2 && c.id !=InputOptions4);
          // this.toSelect5 = this.ranges.filter(c => c.id !=InputOptions3 && c.id !=InputOptions2 && c.id !=InputOptions1);
          // this.toSelect6 = this.ranges.filter(c => c.id !=InputOptions2 && c.id !=InputOptions1);
          // this.toSelect7 = this.ranges.filter(c => c.id !=InputOptions1);
         
        // }
        
        //filter removed
        const InvertOutput = data.result.systemIoControll.InvertInput;
        const InvertOutput0 = parseInt(InvertOutput.InvertInput0.Value);
        const InvertOutput1 = parseInt(InvertOutput.InvertInput1.Value);
        const InvertOutput2 = parseInt(InvertOutput.InvertInput2.Value);
        const InvertOutput3 = parseInt(InvertOutput.InvertInput3.Value);
        const InvertOutput4 = parseInt(InvertOutput.InvertInput4.Value);
        this.defaultInputOptions1 = InputOptions1;
        this.defaultInputOptions2 = InputOptions2;
        this.defaultInputOptions3 = InputOptions3;
        this.defaultInputOptions4 = InputOptions4;
        // if(InputOptions1 == 0 || this.ranges.find(c => c.id == InputOptions1) == undefined){
        //   this.defaultInputOptions1 = 10;
        // }
        // if(InputOptions2 == 0 || this.ranges.find(c => c.id == InputOptions2) == undefined){
        //   this.defaultInputOptions2 = 1;
        // }
        // if(InputOptions3 == 0 || this.ranges.find(c => c.id == InputOptions3) == undefined){
        //   this.defaultInputOptions3 = 2;
        // }
        // if(InputOptions4 == 0 || this.ranges.find(c => c.id == InputOptions4) == undefined){
        //   this.defaultInputOptions4 = 4;
        // }

        const toSelect1 = this.stdranges.find(c => c.id == InputOptions0);
        const toSelect2 = this.toSelect8.find(c => c.id == this.defaultInputOptions1);
        if(this.defaultInputOptions1 == 25){
          this.removeOption(this.toSelect6,this.defaultInputOptions1)
        }
        if(this.defaultInputOptions2 == 29){
          this.setOption(this.toSelect7,this.defaultInputOptions2)
        }
        if(this.defaultInputOptions3 == 29){
          this.setOption(this.toSelect6,this.defaultInputOptions3)
        }
        const toSelect3 = this.toSelect7.find(c => c.id == this.defaultInputOptions2);
        const toSelect4 = this.toSelect6.find(c => c.id == this.defaultInputOptions3);
        if(this.defaultInputOptions4 == 29){
          this.setOption(this.toSelect5,this.defaultInputOptions4);
          // const select5 = this.toSelect5.find(c => c.id == this.defaultInputOptions4);
        }
           const select5 = this.toSelect5.find(c => c.id == this.defaultInputOptions4);
           this.trackingSystemIO = {
            'InputOptions1':this.defaultInputOptions1,
            'InputOptions2':this.defaultInputOptions2,
            'InputOptions3':this.defaultInputOptions3,
            'InputOptions4':this.defaultInputOptions4
          }
        this.systemForm.setValue({
          InputOptions0: toSelect1, 
          InputOptions1: toSelect2,
          InputOptions2: toSelect3,
          InputOptions3: toSelect4,
          InputOptions4: select5,
          InvertOutput0: InvertOutput0,
          InvertOutput1: InvertOutput1,
          InvertOutput2: InvertOutput2,
          InvertOutput3: InvertOutput3,
          InvertOutput4: InvertOutput4
        });
        if(toSelect2.id == 27){
          this.isL1CheckboxDisabled = true;
          this.isDisabled['InputOptions2'] = true;
          this.isDisabled['InputOptions3'] = true;
          this.isDisabled['InputOptions4'] = true;
        }else if(toSelect2.id == 26){
          this.isL1CheckboxDisabled = true;
          this.isDisabled['InputOptions2'] = true;
          this.isDisabled['InputOptions3'] = true;
        }else if(toSelect2.id == 25){
          this.isL1CheckboxDisabled = true;
          this.isDisabled['InputOptions2'] = true;
        }
        this.isL2CheckboxDisabled = this.isDisabled['InputOptions2'] == undefined ? false : this.isDisabled['InputOptions2'];
        this.isL3CheckboxDisabled = this.isDisabled['InputOptions3'] == undefined ? false : this.isDisabled['InputOptions3'];
        if(toSelect3.id == 26){
          this.isL2CheckboxDisabled = true;
          this.isL3CheckboxDisabled = true;
          this.isDisabled['InputOptions3'] = true;
          this.isDisabled['InputOptions4'] = true;
        }else if(toSelect3.id == 25){
          this.isL2CheckboxDisabled = true;
          this.isL3CheckboxDisabled = true;
          this.isDisabled['InputOptions3'] = true;
        }

        if(toSelect4.id == 25){
          this.isL3CheckboxDisabled =true;
          this.isDisabled['InputOptions4'] = true;
        }
        
      }
    });
  }

  checkValue1(e) {
    if (e.checked === true) {
      this.systemForm.get('InvertOutput0').setValue(1);
    } else if (e.checked === false) {
      this.systemForm.get('InvertOutput0').setValue(0);
    }
  }

  checkValue2(e) {
    if (e.checked === true) {
      this.systemForm.get('InvertOutput1').setValue(1);
    } else if (e.checked === false) {
      this.systemForm.get('InvertOutput1').setValue(0);
    }
  }

  checkValue3(e) {
    if (e.checked === true) {
      this.systemForm.get('InvertOutput2').setValue(1);
    } else if (e.checked === false) {
      this.systemForm.get('InvertOutput2').setValue(0);
    }
  }

  checkValue4(e) {
    if (e.checked === true) {
      this.systemForm.get('InvertOutput3').setValue(1);
    } else if (e.checked === false) {
      this.systemForm.get('InvertOutput3').setValue(0);
    }
  }

  checkValue5(e) {
    if (e.checked === true) {
      this.systemForm.get('InvertOutput4').setValue(1);
    } else if (e.checked === false) {
      this.systemForm.get('InvertOutput4').setValue(0);
    }
  }

  onSubmit() {
    this.systemForm.markAsPristine();
    const formData = this.systemForm.getRawValue();
    const formValue = {
      InputOptions0: formData.InputOptions0.id,
      InputOptions1: formData.InputOptions1.id,
      InputOptions2: formData.InputOptions2.id,
      InputOptions3: formData.InputOptions3.id,
      InputOptions4: formData.InputOptions4.id,
      InvertInput0: formData.InvertOutput0,
      InvertInput1: formData.InvertOutput1,
      InvertInput2: formData.InvertOutput2,
      InvertInput3: formData.InvertOutput3,
      InvertInput4: formData.InvertOutput4
    };
    this.authService.updateInput(formValue).subscribe(
      (data: any) => {
        if (data.status === 'success') {
          this.toastr.success('System Input updated successfully', '', {
            timeOut: 3000
          });
        }
      },
      (err: any) => {
        console.log('err', err);
        this.toastr.error(err.error.message, '', {
          timeOut: 3000
        });
      }
    );
  }
  setRemoteRecipeOptions(event){
    let defaultCurrentJSON = {};
    
    if(event.value.id > 24 && event.value.id < 29){
      this.isDisabled = {}
      this.removeZeroOption();
      if(event.source.ngControl.name == 'InputOptions1'){
        if(event.value.id == 25){
          this.removeOption(this.toSelect6,25)
        }else{
          this.setOption(this.toSelect6,25)
        }
      }
      let selectedOption = event.value.id;
      let numOptionChange = selectedOption - 25;
      let currentJSON = {};
      let selectedIndex = parseInt(event.source.ngControl.name.substr(-1));
      // if(event.source == undefined){
      //   selectedIndex = 1
        
      // }else{
      //   let selectedId =event.source.id.split("-");
      //   selectedIndex = parseInt(selectedId[2]);
      // }
      
      for (let index = selectedIndex + 1; index <= (numOptionChange + selectedIndex + 1); index++) {
        let optionIndex = "InputOptions"+index;
        if(index == numOptionChange + selectedIndex + 1){
          this.setZeroOption(optionIndex);
          currentJSON[optionIndex] = this.ranges.find(c => c.id == 29)
          this.setTrakingSystemIO(this.trackingSystemIO,optionIndex,29);
        }else{
          let findOption = selectedOption - index + 1;
          if(findOption < 25){
            findOption = 25
          }
          currentJSON[optionIndex] = this.ranges.find(c => c.id == findOption)
          this.setTrakingSystemIO(this.trackingSystemIO,optionIndex,findOption);
        }
        this.isDisabled[optionIndex] = true;
      }
      if(event.source.ngControl.name == 'InputOptions1'){
        this.isL1CheckboxDisabled = true;
        this.isL2CheckboxDisabled = this.isDisabled['InputOptions2'];
        this.isL3CheckboxDisabled = this.isDisabled['InputOptions3'] == undefined ? false : this.isDisabled['InputOptions3'];
          currentJSON = this.setDefaultValue(currentJSON,'InputOptions2',this.ranges.find(c => c.id == 1));
          if((this.trackingSystemIO['InputOptions3'] > 24 && this.trackingSystemIO['InputOptions3'] < 30)){
            currentJSON = this.setDefaultValue(currentJSON,'InputOptions3',this.ranges.find(c => c.id == 2));
          }
          if((this.trackingSystemIO['InputOptions4'] > 24 && this.trackingSystemIO['InputOptions4'] < 30)){
            currentJSON = this.setDefaultValue(currentJSON,'InputOptions4',this.ranges.find(c => c.id == 4));
          }
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions1',event.value.id);
      }
      if(event.source.ngControl.name == 'InputOptions2'){
        this.isL2CheckboxDisabled = true;
        this.isL3CheckboxDisabled = this.isDisabled['InputOptions3'] == undefined ? false : this.isDisabled['InputOptions3'];
        currentJSON = this.setDefaultValue(currentJSON,'InputOptions3',this.ranges.find(c => c.id == 2));
        currentJSON = this.setDefaultValue(currentJSON,'InputOptions4',this.ranges.find(c => c.id == 4));
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions2',event.value.id)
      }
      if(event.source.ngControl.name == 'InputOptions3'){
        this.isL3CheckboxDisabled = true;
        currentJSON = this.setDefaultValue(currentJSON,'InputOptions4',this.ranges.find(c => c.id == 4));
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions3',event.value.id)
      }
      this.unSetCheckedInvert();
        this.systemForm.patchValue(currentJSON);
    }else{
      if(event.source.ngControl.name == 'InputOptions1'){
        this.setOption(this.toSelect6,25)
        if(this.trackingSystemIO['InputOptions1'] > 24 && this.trackingSystemIO['InputOptions1'] < 29){
          this.isL1CheckboxDisabled = false;
          this.isL2CheckboxDisabled = false;
          this.isL3CheckboxDisabled = false;
          this.isDisabled['InputOptions2'] = false;
          this.isDisabled['InputOptions3'] = false;
          this.isDisabled['InputOptions4'] = false;
          defaultCurrentJSON = this.setDefaultValue(defaultCurrentJSON,'InputOptions2',this.ranges.find(c => c.id == 1));
          this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions2',1);
          if(this.trackingSystemIO['InputOptions3'] > 24 && this.trackingSystemIO['InputOptions3'] < 30){
            defaultCurrentJSON = this.setDefaultValue(defaultCurrentJSON,'InputOptions3',this.ranges.find(c => c.id == 2));
            this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions3',2);
          }
          if(this.trackingSystemIO['InputOptions4'] > 24 && this.trackingSystemIO['InputOptions4'] < 30){
          defaultCurrentJSON = this.setDefaultValue(defaultCurrentJSON,'InputOptions4',this.ranges.find(c => c.id == 4));
          this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions4',4);
          }
          this.removeZeroOption();
        }
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions1',event.value.id);
      }else if(event.source.ngControl.name == 'InputOptions2'){
        this.isL2CheckboxDisabled = false;
        this.isL3CheckboxDisabled = false;
        if(this.trackingSystemIO['InputOptions2'] > 24 && this.trackingSystemIO['InputOptions2'] < 30){
          this.isDisabled['InputOptions3'] = false;
        this.isDisabled['InputOptions4'] = false;
          defaultCurrentJSON = this.setDefaultValue(defaultCurrentJSON,'InputOptions3',this.ranges.find(c => c.id == 2));
          this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions3',2);
          if(this.trackingSystemIO['InputOptions4'] > 24 && this.trackingSystemIO['InputOptions4'] < 30){
          defaultCurrentJSON = this.setDefaultValue(defaultCurrentJSON,'InputOptions4',this.ranges.find(c => c.id == 4));
          this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions4',4);
          }
          this.removeZeroOption();
        }
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions2',event.value.id)
      }else if(event.source.ngControl.name == 'InputOptions3'){
        this.isL3CheckboxDisabled = false;
        if(this.trackingSystemIO['InputOptions3'] > 24 && this.trackingSystemIO['InputOptions3'] < 30){
          this.isDisabled['InputOptions4'] = false;
          defaultCurrentJSON = this.setDefaultValue(defaultCurrentJSON,'InputOptions4',this.ranges.find(c => c.id == 4));
          this.removeZeroOption();
        }
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions3',event.value.id)
      }else if(event.source.ngControl.name == 'InputOptions4'){
        this.setTrakingSystemIO(this.trackingSystemIO,'InputOptions4',event.value.id)
      }
        this.systemForm.patchValue(defaultCurrentJSON);
    }
    
  }
  unSetCheckedInvert(){
    if(this.isL1CheckboxDisabled){
      this.systemForm.get('InvertOutput1').setValue(0);
    }
    if(this.isL2CheckboxDisabled){
      this.systemForm.get('InvertOutput2').setValue(0);
    }
    if(this.isL3CheckboxDisabled){
      this.systemForm.get('InvertOutput3').setValue(0);
    }
    if(this.isDisabled['InputOptions4']){
      this.systemForm.get('InvertOutput4').setValue(0);
    }
   
  }
  setDefaultValue(currentJSON, key, defaultValue){
    if(!currentJSON.hasOwnProperty(key)){
      currentJSON[key] = defaultValue;
      this.setTrakingSystemIO(this.trackingSystemIO,key,defaultValue);
    }
    return currentJSON;
  }
  setZeroOption(optionName){
    if (optionName == 'InputOptions2') {
      this.toSelect7.push(this.ranges.find(c => c.id == 29));
    } else if(optionName == 'InputOptions3'){
      this.toSelect6.push(this.ranges.find(c => c.id == 29));
    }else if(optionName == 'InputOptions4'){
      this.toSelect5.push(this.ranges.find(c => c.id == 29));
    }
  }
  removeZeroOption(){
    if(this.toSelect7.findIndex(c => c.id == 29) > 0){
      this.toSelect7.splice(this.toSelect7.findIndex(c => c.id == 29),1);
    }
    if(this.toSelect6.findIndex(c => c.id == 29) > 0){
      this.toSelect6.splice(this.toSelect6.findIndex(c => c.id == 29),1);
    }
    if(this.toSelect5.findIndex(c => c.id == 29) > 0){
      this.toSelect5.splice(this.toSelect5.findIndex(c => c.id == 29),1);
    }
  }
  setOption(dataArray,value){
    if(dataArray.findIndex(c => c.id == value) < 0){
      dataArray.push(this.ranges.find(c => c.id == value));
    }
    return dataArray;
  }
  removeOption(dataArray,value){
    if(dataArray.findIndex(c => c.id == value) > 0){
      dataArray.splice(dataArray.findIndex(c => c.id == value),1);
    }
    return dataArray;
  }
  setTrakingSystemIO(data,key,value){
    data[key] = value;
    return data;
    // this.trackingSystemIO = {
    //   'InputOptions1':,
    //   'InputOptions2':,
    //   'InputOptions3':,
    //   'InputOptions4':
    // }
  }
}
