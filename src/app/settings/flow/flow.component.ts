import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { ToastrService } from 'ngx-toastr';
import {polarity,sourcing,mode} from './flowCongif'

@Component({
  selector: 'nordson-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css']
})
export class FlowComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  focusField:string;
  flowForm:FormGroup
  mode=mode
  polarity=polarity;
  sourcing=sourcing;
  targetAddon: any;
  isError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.flowForm = this.fb.group({
      ATSAlertDelay:['',Validators.compose([
        Validators.required,
      ])],
      ATSAlertEnable:[''],
      ATSAlertLowerLimit:['',Validators.compose([
        Validators.required,
      ])],
      ATSAlertUpperLimit:['',Validators.compose([
        Validators.required,
      ])],
      ATSFaultDelay:['',Validators.compose([
        Validators.required,
      ])],
      ATSFaultEnable:[''],
      ATSFaultLowerLimit:['',Validators.compose([
        Validators.required,
      ])],
      ATSFaultUpperLimit:['',Validators.compose([
        Validators.required,
      ])],
      ATSKFactor:['',Validators.compose([
        Validators.required,
      ])],
      ATSNumProdToAverage:['',Validators.compose([
        Validators.required,
      ])],
      ATSNumProdToSkip:['',Validators.compose([
        Validators.required,
      ])],
      ATSProdSkipTime:['',Validators.compose([
        Validators.required,
      ])],
      ATSSpecificGravity:['',Validators.compose([
        Validators.required,
      ])],
      ATSStartupSkipCount:['',Validators.compose([
        Validators.required,
      ])],
      ATSTargetAddon:['',Validators.compose([
        Validators.required,
      ])],
      ATSTriggerPol:[''],
      source:[''],
      capture:['']
    });
    // ATSTriggerModeType:['',Validators.compose([
    //   Validators.required,
    // ])],
    // ATSTriggerType:['',Validators.compose([
    //   Validators.required,
    // ])],
    this.authService.getxmlData()
    .subscribe((data: any) => {
      if (data.status === 'Success') {
        this.authService.setNorId(data.result.nor_id);
        const flowData = data.result.flow;
        let obj: any = {};
        for (let flow in flowData) {
          obj[flow] = flowData[flow].Value;
        }
        obj.ATSSpecificGravity = obj.ATSSpecificGravity/100;
        obj.ATSKFactor = obj.ATSKFactor/1000;
        obj.ATSTriggerPol=obj.ATSTriggerPol ? this.polarity.find(c => c.id ==obj.ATSTriggerPol) : this.polarity.find(c => c.id ==0);
        obj.ATSAlertEnable = obj.ATSAlertEnable == "0" ? false : true;
        obj.ATSFaultEnable = obj.ATSFaultEnable == "0" ? false : true;
        this.targetAddon = flowData.ATSTargetAddon.Value;
        this.flowForm.patchValue(obj);
        this.flowForm.patchValue({
          source:obj.ATSTriggerType ? this.sourcing.find(c => c.id ==obj.ATSTriggerType) :this.sourcing.find(c =>   c.id ==0),
          capture:obj.ATSTriggerModeType ? this.mode.find(c => c.id ==obj.ATSTriggerModeType) :this.mode.find(c =>   c.id ==0)
        })
      }
    }, (err: any) => {
      console.log('err', err);
    });
  }
  toogleMat(e,tag) {
    if (e.checked === true) {
      this.flowForm.get(tag).patchValue(1);
    } else {
      this.flowForm.get(tag).patchValue(0);
    }
  }
  preventalpha(evt){
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) ){
      return false;
    }
  }
  preventalphaDecimal(evt){
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46  ){
      return false;
    }
  }
  onSubmit(){
    const formData = this.flowForm.getRawValue();
    this.getValidation(formData);
    if(!this.isError){
      const formVal={
        ATSAlertDelay:formData.ATSAlertDelay,
        ATSAlertEnable:formData.ATSAlertEnable,
        ATSAlertLowerLimit:formData.ATSAlertLowerLimit,
        ATSAlertUpperLimit:formData.ATSAlertUpperLimit,
        ATSFaultDelay:formData.ATSFaultDelay,
        ATSFaultEnable:formData.ATSFaultEnable,
        ATSFaultLowerLimit:formData.ATSFaultLowerLimit,
        ATSFaultUpperLimit:formData.ATSFaultUpperLimit,
        ATSKFactor:formData.ATSKFactor,
        ATSNumProdToAverage:formData.ATSNumProdToAverage,
        ATSNumProdToSkip:formData.ATSNumProdToSkip,
        ATSProdSkipTime:formData.ATSProdSkipTime,
        ATSSpecificGravity:formData.ATSSpecificGravity,
        ATSStartupSkipCount:formData.ATSStartupSkipCount,
        ATSTargetAddon:formData.ATSTargetAddon,
        ATSTriggerPol:formData.ATSTriggerPol.id,
        ATSTriggerModeType:formData.capture.id,
        ATSTriggerType:formData.source.id
      }
      console.log(formVal)
      this.authService.submitFlowData(formVal)
      .subscribe((data:any)=>{
        if(data.status=='success'){
          this.toastr.success('Flow Updated Successfully', '', {
            timeOut: 3000
          });
        }
        
      },(err:any)=>{
        console.log('err',err)
      })
    }
  }
  getValidation(formData){
    const minLowerLimit = 0.05 * this.targetAddon;
    const maxLowerLimit = 0.5 * this.targetAddon;
    this.isError = false;
    if(Number(formData.ATSAlertDelay) < 1 || Number(formData.ATSAlertDelay) > 15){
      this.isError = true;
      this.focusField = 'ATSAlertDelay'
      this.toastr.error('Alert Delay Count should be between 1 and 15', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSAlertLowerLimit) < minLowerLimit || Number(formData.ATSAlertLowerLimit) > maxLowerLimit){
      this.isError = true;
      this.focusField = 'ATSAlertLowerLimit'
      this.toastr.error('Low Alert Threshold should be between '+ minLowerLimit+' and '+maxLowerLimit, '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSAlertUpperLimit) < minLowerLimit || Number(formData.ATSAlertUpperLimit) > maxLowerLimit){
      this.isError = true;
      this.focusField = 'ATSAlertUpperLimit'
      this.toastr.error('High Alert Threshold should be between '+minLowerLimit+' and '+maxLowerLimit, '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSFaultDelay) < 1 || Number(formData.ATSFaultDelay) > 15){
      this.isError = true;
      this.focusField = 'ATSFaultDelay'
      this.toastr.error('Stop Delay Count should be between 1 and 15', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSFaultLowerLimit) < minLowerLimit || Number(formData.ATSFaultLowerLimit) > maxLowerLimit){
      this.isError = true;
      this.focusField = 'ATSFaultLowerLimit'
      this.toastr.error('Low Stop Threshold should be between '+minLowerLimit+' and '+maxLowerLimit, '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSFaultUpperLimit) < minLowerLimit || Number(formData.ATSFaultUpperLimit) > maxLowerLimit){
      this.isError = true;
      this.focusField = 'ATSFaultUpperLimit'
      this.toastr.error('High Stop Threshold should be between '+minLowerLimit+' and '+maxLowerLimit, '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSSpecificGravity) < 0.80 || Number(formData.ATSSpecificGravity) > 1.20){
      this.isError = true;
      this.focusField = 'ATSSpecificGravity'
      this.toastr.error('Specific Gravity should be between 0.80 and 1.20', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSKFactor) < 0.50 || Number(formData.ATSKFactor) > 1.5){
      this.isError = true;
      this.focusField = 'ATSKFactor'
      this.toastr.error('Calibration Constant Setting should be between 0.5 and 1.5', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSNumProdToSkip) < 0 || Number(formData.ATSNumProdToSkip) > 255){
      this.isError = true;
      this.focusField = 'ATSNumProdToSkip'
      this.toastr.error('Products to Skip should be between 0 and 255', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSNumProdToAverage) < 1 || Number(formData.ATSNumProdToAverage) > 1000){
      this.isError = true;
      this.focusField = 'ATSNumProdToAverage'
      this.toastr.error('Products to Average should be between 1 and 1000', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSProdSkipTime) < 1 || Number(formData.ATSProdSkipTime) > 255){
      this.isError = true;
      this.focusField = 'ATSProdSkipTime'
      this.toastr.error('Idle Skip Time should be between 1 and 255', '', {
        timeOut: 3000
      });
    }
    else if(Number(formData.ATSStartupSkipCount) < 0 || Number(formData.ATSStartupSkipCount) > 1000){
      this.isError = true;
      this.focusField = 'ATSStartupSkipCount'
      this.toastr.error('Startup Skip Count should be between 0 and 1000', '', {
        timeOut: 3000
      });
    }
    const ele = this.aForm.nativeElement[this.focusField];
    if (ele) {
      ele.focus();
    }
  }
}
