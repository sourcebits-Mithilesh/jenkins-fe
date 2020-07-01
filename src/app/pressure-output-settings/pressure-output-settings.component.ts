import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder,  Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { inputrange } from 'src/config/inputrange';
import { ToastrService } from 'ngx-toastr';
import { PressureService } from '../shared/pressure.service';

@Component({
  selector: 'nordson-pressure-output-settings',
  templateUrl: './pressure-output-settings.component.html',
  styleUrls: ['./pressure-output-settings.component.css']
})
export class PressureOutputSettingsComponent implements OnInit {
  @ViewChild('aForm') aForm: ElementRef;
  constructor(private fb:FormBuilder,
    private authService: AuthService, 
    private toast: ToastrService,
    private pressureService:PressureService

    ) { }


  pressureOutput:FormGroup;

  pressureUnit;

  lineSpeedUnit;
  
  lineSpUnt;
   
  errExist:boolean=false;

  pressureScalingUnit;//hydraulic 1

  disableBtn=true;
  focusField:string;
  ngOnInit() {
   this.pressureOutput=this.fb.group({
    lowSpeedPresSett:[],
    lowLineSpeedSett:[],
    highSpeedPresSett:[],
    highLineSpeedSett:[],
    maxPressureLimit:[],
    minPressureLimit:[],
    zeroLineSpeedPress:[],
    fullScaleLineSpeed:[]
   })
   this.initialValueSet()
  }

  initialValueSet(){
    this.authService.getxmlData().subscribe((data:any)=>{
      if ((data.status = 'Success')) {
        this.authService.setNorId(data.result.nor_id);
        this.pressureUnitChoose(data.result.systemPreferences.PressureUnits.Value)
        this.lineSpUnt=parseInt(data.result.systemPreferences.LinespeedUnits?data.result.systemPreferences.LinespeedUnits.Value:0)
        this.lineSpeedUnit= this.lineSpUnt?"m/min":"ft/min";
        let pressureCntrl=data.result.pressureControll;
        let systemControl=data.result.systemPreferences
        this.pressureScalingUnit=systemControl.ePressureScaling.Value
        let lowSpdPr=this.pressureUnit=="BAR"?(pressureCntrl.usPressureCalPtMin.Value/1000).toFixed(2):(pressureCntrl.usPressureCalPtMin.Value/1000).toFixed()
        let highSpdPr=this.pressureUnit=="BAR"?(pressureCntrl.usPressureCalPtMax.Value/1000).toFixed(2):(pressureCntrl.usPressureCalPtMax.Value/1000).toFixed()
        let mxPrLmt=this.pressureUnit=="BAR"?(pressureCntrl.usPressureMax.Value/1000).toFixed(2):(pressureCntrl.usPressureMax.Value/1000).toFixed()
        let mnPrLmt=this.pressureUnit=="BAR"?(pressureCntrl.usPressureMin.Value/1000).toFixed(2):(pressureCntrl.usPressureMin.Value/1000).toFixed()
        this.pressureOutput=this.fb.group({
           lowSpeedPresSett:lowSpdPr,
           highSpeedPresSett:highSpdPr,
           maxPressureLimit: mxPrLmt,
           minPressureLimit: mnPrLmt,
           lowLineSpeedSett: this.lineSpeedUnitChoose(pressureCntrl.usLinespeedCalPtMin.Value),
           highLineSpeedSett:this.lineSpeedUnitChoose(pressureCntrl.usLinespeedCalPtMax.Value),
           zeroLineSpeedPress:pressureCntrl.eIdleSpeedPressureCutoff.Value,
           fullScaleLineSpeed:this.lineSpeedUnitChoose(pressureCntrl.ulFullScaleLineSpeed.Value)
        })
      
      }
    })
  }


  pressureUnitChoose(data){
  if(data==="1"){
    this.pressureUnit = 'kPa';
  }else if(data==="2"){
    this.pressureUnit = 'BAR';
  }else{
    this.pressureUnit = 'PSI';
  }
  }

  //ft/min or m/min
  lineSpeedUnitChoose(value){
   if(!this.lineSpUnt){
   return (value/100).toFixed()
   }else{
     return ((value/100)*0.3048).toFixed(2)
   }
  }
 
  toogleAirPressure(evt){
    return evt.checked;
  }

  onSubmit(){
   this.pressureOutput.markAsUntouched()
    this.errExist=false;
   this.unitCheckValidation()
  if(!this.errExist) this.submitter()
  
   
  }

  statusCheck(){
    if(this.pressureOutput.touched){
      return false;
    }else{
      return true;
    }
  }

  validationCheck(low,high ,min ,max,minl,maxl,unit){
    low=parseFloat(low);
    high=parseFloat(high)
    if(!(low<=min&&low>=minl))return "lesser"
     else if(!(high<=max&&high>=maxl))return "higher"
     else if(low>high)return "inbtw"
     else if((high-low)<=inputrange[`diff${unit.toLowerCase()}`]) return "diff"
    
  }

  validationCheckFulScale(low,high,val,unit){
    let asUnit=''
    if(unit=="mmin"){asUnit="m/min"}
    else{
      asUnit="ft/min"
    }

     if(val<low||val>high){
       return ` Full Scale Line Speed range should be ${low} ${asUnit} to ${high} ${asUnit} `
     }
  }


  //unitwise validation
  unitCheckValidation(){
    let unitChooser=this.pressureScalingUnit==1?15:1
    let dataObj={
      lowPrSt:this.pressureOutput.get('lowSpeedPresSett').value,
      higPrSt:this.pressureOutput.get('highSpeedPresSett').value,
      mnPrLmt:this.pressureOutput.get('minPressureLimit').value,
      mxPrLmt:this.pressureOutput.get('maxPressureLimit').value,
      mnPrMx:(inputrange["prsrOtpt_usPressureMin_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPrmx:(inputrange["prsrOtpt_usPressureMax_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mnPrmn:(inputrange["prsrOtpt_usPressureMin_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPrmn:(inputrange["prsrOtpt_usPressureMax_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mnPlmtmx:(inputrange["prsrOtpt_usPressureCalPtMin_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPlmtmx:(inputrange["prsrOtpt_usPressureCalPtMax_max_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mnPlmtmn:(inputrange["prsrOtpt_usPressureCalPtMin_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      mxPlmtmn:(inputrange["prsrOtpt_usPressureCalPtMax_min_"+(this.pressureUnit).toLowerCase()])*unitChooser,
      unit:this.pressureUnit,      
    }
    if(this.pressureUnit=="PSI"){
     this.validationComposer(dataObj)
    }
     if(this.pressureUnit=="BAR"){
      this.validationComposer(dataObj)
    }
     if(this.pressureUnit=="kPa"){
       this.validationComposer(dataObj)
    }
    
      if(!this.errExist){
      let lowlineSpeed=this.pressureOutput.get('lowLineSpeedSett').value;
      let highlineSpeed=this.pressureOutput.get('highLineSpeedSett').value
      let lnspdObj={
        lsMnMxm:inputrange.prsrOtpt_usLinespeedCalPtMin_max_mm,
        lsMxMxm:inputrange.prsrOtpt_usLinespeedCalPtMax_max_mm,
        lsMnMnm:inputrange.prsrOtpt_usLinespeedCalPtMin_min_mm,
        lsMxMnm:inputrange.prsrOtpt_usLinespeedCalPtMax_min_mm,
        lsMnMxf:inputrange.prsrOtpt_usLinespeedCalPtMin_max_ftm,
        lsMxMxf:inputrange.prsrOtpt_usLinespeedCalPtMax_max_ftm,
        lsMnMnf:inputrange.prsrOtpt_usLinespeedCalPtMin_min_ftm,
        lsMxMnf:inputrange.prsrOtpt_usLinespeedCalPtMax_min_ftm,


        fSlspmnm:inputrange.prsrOtpt_usFulScaleLinespeed_min_mmin,
        fSlspmxm:inputrange.prsrOtpt_usFulScaleLinespeed_max_mmin,
        fSlspmnft:inputrange.prsrOtpt_usFulScaleLinespeed_min_ftmin,
        fSlspmxft:inputrange.prsrOtpt_usFulScaleLinespeed_max_ftmin,
        
        unit:this.lineSpeedUnit,
      }

          //for m/mn
          let  lnspdMsgm=this.validationCheck(lowlineSpeed,highlineSpeed,lnspdObj.lsMnMxm,lnspdObj.lsMxMxm, lnspdObj.lsMnMnm,lnspdObj.lsMxMnm,"mmin")
          //for ft/min
          let  lnspdmsgFt=this.validationCheck(lowlineSpeed,highlineSpeed,lnspdObj.lsMnMxf,lnspdObj.lsMxMxf,lnspdObj.lsMnMnf,lnspdObj.lsMxMnf,"mft")

          let fulSclSpdmn=this.validationCheckFulScale(lnspdObj.fSlspmnm,lnspdObj.fSlspmxm,this.pressureOutput.get('fullScaleLineSpeed').value,"mmin")

          let fulSclSpdft=this.validationCheckFulScale(lnspdObj.fSlspmnft,lnspdObj.fSlspmxft,this.pressureOutput.get('fullScaleLineSpeed').value,"mft")
          if(lnspdMsgm&&this.lineSpUnt==1){
            this.focusField = lnspdMsgm=='lesser' ? 'lowLineSpeedSett' : 'highLineSpeedSett'
            this.errExist=true;
            return this.errMsgShow(this.cmpErrMsg(lnspdMsgm,Names.llsp,Names.hlsp,lnspdObj.lsMnMnm,lnspdObj.lsMnMxm,lnspdObj.lsMxMnm,lnspdObj.lsMxMxm,lnspdObj.unit,"mmin"))
           }
          else this.errExist=false;

          if(lnspdmsgFt&&this.lineSpUnt==0){
            this.focusField = lnspdmsgFt=='higher' ? 'highLineSpeedSett' : 'lowLineSpeedSett'
            this.errExist=true;
            return this.errMsgShow(this.cmpErrMsg(lnspdmsgFt,Names.llsp,Names.hlsp,lnspdObj.lsMnMnf,lnspdObj.lsMnMxf,lnspdObj.lsMxMnf,lnspdObj.lsMxMxf,lnspdObj.unit,"mft"))
          }

          if(fulSclSpdmn&&this.lineSpUnt==1){
            this.focusField = 'fullScaleLineSpeed'
            this.errExist=true;
            return this.errMsgShow(fulSclSpdmn)
          }

          if(fulSclSpdft&&this.lineSpUnt==0){
            this.focusField = 'fullScaleLineSpeed'
            this.errExist=true;
            return this.errMsgShow(fulSclSpdft)
          }


          else this.errExist=false;
}

    if(!this.errExist){
      this.submitter()
    }

  }
  
  cmpErrMsg(val,lName,hName,lMin,lMax,hMin,hMax,unit,units){

    if(val=="lesser") return `${lName} range should be ${lMin } ${unit} to ${lMax} ${unit}`;
    if(val=="higher") return `${hName} range should be ${hMin}  ${unit} to ${hMax} ${unit}`;
    if(val=="inbtw") return `${lName} Range should be less than ${hName}`;
    if(val=="diff")  return `Minimum difference of ${hName} and ${lName} should be ${inputrange[`diff${units.toLowerCase()}`]} ${units}`;
  }

  errMsgShow(msg){
    const ele = this.aForm.nativeElement[this.focusField];
    if (ele) {
      ele.focus();
    }
    if(msg){
    this.toast.error(msg, '', {
      timeOut: 3000
    });
  }
  }

  //To make common to all Units composing functions
  validationComposer(obj){
  const{lowPrSt,higPrSt,mnPrLmt,mxPrLmt,mnPrMx,mxPrmx,mnPrmn,mxPrmn,mnPlmtmx,mxPlmtmx,mnPlmtmn,mxPlmtmn,unit}=obj
  let msgPressSetPSI=this.validationCheck(lowPrSt, higPrSt,mnPrMx,mxPrmx,mnPrmn,mxPrmn,this.pressureUnit)
 
  let msgPressLmtPSI=this.validationCheck(mnPrLmt,mxPrLmt,mnPlmtmx,mxPlmtmx,mnPlmtmn,mxPlmtmn,this.pressureUnit)                           
 
  if(msgPressSetPSI){
    this.focusField = msgPressSetPSI=='lesser' ? 'lowSpeedPresSett' : 'highSpeedPresSett'
    this.errExist=true;
    return this.errMsgShow(this.cmpErrMsg(msgPressSetPSI,Names.lsps,Names.hsps,mnPrmn,mnPrMx,mxPrmn,mxPrmx,unit,unit))
   }
    
  if(msgPressLmtPSI){
    this.focusField = msgPressLmtPSI=='lesser' ? 'minPressureLimit' : 'maxPressureLimit'
    this.errExist=true;
     return this.errMsgShow(this.cmpErrMsg(msgPressLmtPSI,Names.mnpl,Names.mxpl,mnPlmtmn,mnPlmtmx,mxPlmtmn,mxPlmtmx,unit,unit))
    }

    // if(!this.errExist){
    //   return false;
    // }else{
    //   return true;
    // }
     
  }

  preventalpha(evt) {
    // if (this.pressureUnit != 'BAR') {
    
    // if(this.pressureUnit != 'BAR'){
    //   return this.authService.preventalpha(event);
    // } else {
      
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    // }
  }
// }
    keyupFunc(){
     this.disableBtn=false; 
    }

//to submit 

  submitter(){
  
  let data={
      "usPressureCalPtMin":this.pressureOutput.get('lowSpeedPresSett').value,
      "usPressureCalPtMax":this.pressureOutput.get('highSpeedPresSett').value,
      "usPressureMax":this.pressureOutput.get('maxPressureLimit').value,
      "usPressureMin":this.pressureOutput.get('minPressureLimit').value,
      "usLinespeedCalPtMin":this.pressureOutput.get('lowLineSpeedSett').value,
      "usLinespeedCalPtMax":this.pressureOutput.get('highLineSpeedSett').value,
      "eIdleSpeedPressureCutoff":this.pressureOutput.get('zeroLineSpeedPress').value,
      "ulFullScaleLineSpeed":this.pressureOutput.get('fullScaleLineSpeed').value
      }
      
      this.pressureService.updatePressure(data).subscribe((data: any) => {
        if (data.status === 'success') {
          this.disableBtn=true;
          this.toast.success('Pressure output updated successfully', '', {
            timeOut: 3000
          });
        }
      })

  }

  changeSelect(){
    this.disableBtn=false; 

  }

}

export const Names={
  llsp:"Low Line Speed Pressure",
  hlsp:"High Line Speed Pressure",
  mxpl:"Maximum Pressure Limit",
  mnpl:"Minimum Pressure Limit",
  lsps:"Low Speed Pressure Setting",
  hsps:"High Speed Pressure Setting",
}