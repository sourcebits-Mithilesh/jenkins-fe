import { Component, OnInit } from '@angular/core';
import { PlcService } from 'src/app/shared/plc.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
import { accessType } from 'src/app/settings/access-type-check';
import convert from 'xml-js'
import blurImportedXML from './blurInput'



@Component({
  selector: 'nordson-plc-mapping',
  templateUrl: './plc-mapping.component.html',
  styleUrls: ['./plc-mapping.component.css']
})
export class PlcMappingComponent implements OnInit {
  plcNumber: any;
  index: number = 1;
  index2: number = 1;
  droppedItems = [];
  plcForm: FormGroup;
  words: number = 4;
  plcObject = new Array();
  count: number;
  plcCount = new Array();
  position: number;
  permisssion: any;
  dragenable: boolean = true;
  sum: number = 0;
  readArr = new Array();
  writeArr = new Array();
  disabled: boolean = false;
  range: number = 64;
  accessType: any;
  prev: any;
  next: any;
  index3: number = 1;
  previousWords: number;
  previousWords2: number;
  preVal: number;
  preVal2: number;
  editIndex: number = 0;
  readStatus:boolean = false
  writeStatus:boolean = false
  constructor(
    private plcService: PlcService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private router:Router
  ) { 
  
  }

  ngOnInit() {
    let group = {};
    for (let i = 1; i <= this.range; i++) {
      group[`input${i}`] = [''];
      group[`inputs${i}`] = [''];
    }
    this.plcForm = this.fb.group(group);
    this.getPlcData((res)=>{
      this.plcService.readPlc().subscribe(
        (data: any) => {
          if (data.status === 'Success') {
            const inADIs = data.result.plcData.Mapping.inADIs.ADI;
            const outADIs = data.result.plcData.Mapping.outADIs.ADI;
            blurImportedXML(inADIs,outADIs,this)
            this.plcForm.markAsPristine()
          }
        },
        err => {
          console.log(err);
        }
      );
    });
   
    let userData = this.userService.setProfile()
    if(userData) {
        this.accessType = accessType.check(userData.data);
    }
    
  }

  // import functionality @Gaurav
  importXML(event){
    try{
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (fileExt === 'xml' || fileExt === 'plc') {
        let fileReader: FileReader = new FileReader();
        fileReader.onloadend=(x)=>{
        try{
         const fileContent:any = fileReader.result;
         const result:any = convert.xml2json(fileContent, {compact: true, spaces: 4});
          if(result){
            const parsedRes=JSON.parse(result);
            if(parsedRes.Mapping.hasOwnProperty('inADIs') || parsedRes.Mapping.hasOwnProperty('outADIs')){
              let inADIs=parsedRes.Mapping.hasOwnProperty('inADIs') ? parsedRes.Mapping.inADIs.ADI : ''
              let outADIs=parsedRes.Mapping.hasOwnProperty('outADIs')? parsedRes.Mapping.outADIs.ADI :''
              blurImportedXML(inADIs,outADIs,this,true)
            }
          }
        }
        catch(err){
          console.log(err)
        }
        }
        fileReader.readAsText(file);
      } else {
        this.toastr.error('Please select a file with .xml or .plc extension', '', {
          timeOut: 3000
        });
        return true;
      }
    }
  }
  catch(err){
    console.log(err)
  }
  }

  navigate(){
    this.router.navigate(['settings/temp-zone'])
  }
  chunkArray(myArray, chunk_size) {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }

  getPlcData(cb) {
    this.plcService.getPlc().subscribe(
      (data: any) => {
        if (data.status === 'success') {
          for (let i = 1; i <= this.range; i++) {
            this.plcCount.push(i);
          }
          
          delete data.status;
          delete data.message;

          for(let key in data){
            if(Array.isArray(data[key])){
              let keyArr=this.chunkArray(data[key],5)
              this.pushPlcObj(keyArr,key)
            }
            else{
              for(let objkey in data[key]){
                let keyArr=this.chunkArray(data[key][objkey],5)
                this.pushPlcObj(keyArr,objkey,true,key)
              }
            }
          }
          cb(this.plcObject)
        }
      },
      err => {
        console.log('err', err);
      }
    );
   
  }
  
  pushPlcObj(keyArr,key,isChild?,parentkey?){
    for (let i = 0; i < keyArr.length; i++) {
      this.plcObject.push({
        parentkey:isChild ? parentkey : null,
        type: key,
        name: keyArr[i][0],
        words: keyArr[i][1],
        read: keyArr[i][2],
        write: keyArr[i][3],
        number: keyArr[i][4]
      });
    }
  }

  onAnyDrop(e, i, type) {
    let baseI = i;
    let enableSaveBtn = false
    const dragData = e.dragData;
    const words = dragData.words;
    const words2 = dragData.words;
    this.droppedItems.push(e.dragData);
    this.plcNumber = dragData.number;
    
    if (dragData.read === 'yes' && type === 'read') {
      
      if (this.readArr.includes(this.plcNumber)) {
        this.toastr.error('Dupliate ADI Number is not allowed', '', {
          timeOut: 3000
        });
        this.plcForm.markAsPristine()
        return;
      }
      let tidx, t1idx;
      tidx = 1;
      t1idx = 1;
      
      for (let i = 1; i <= 64; i++) {

        
        if (!(this.plcForm.get(`input${i}`).value || (this.plcForm.get(`input${i}`).disabled))) {
          tidx = i;

          let enoughSpace = true;
          for (let j = 0; j < words; j++) {
            if ((this.plcForm.get(`input${i + j}`).value || (this.plcForm.get(`input${i + j}`).disabled))) {
              enoughSpace = false;
              j = words;
              
            }
          }
          if(enoughSpace == true)
          {
            i = 64;
          }
        }
      }
      this.index = tidx;
      this.readArr.push(this.plcNumber);
      this.readArr.push(`pos${this.index}`);
      this.readArr.push(words - 1);
      let arrlength = this.readArr.length;
      if (arrlength > 0) {
        enableSaveBtn = true
        this.readStatus = true
      }else{
        this.readStatus = false
      }
      this.plcForm.get(`input${this.index}`).patchValue(this.plcNumber);
      for (let i = this.index; i < words + this.index - 1; i++) {
        this.plcForm.get(`input${i + 1}`).disable();
      }
      this.index = this.index + words;
      this.saveBtnMode(enableSaveBtn)
    }
    
    else if (dragData.write === 'yes' && type === 'write') {
      if (this.writeArr.includes(this.plcNumber)) {
        this.toastr.error('Dupliate ADI Number is not allowed', '', {
          timeOut: 3000
        });
        this.plcForm.markAsPristine()
        return;
      }
      let tidx, t1idx;
      tidx = 1;
      t1idx = 1;
      for (let i = 1; i <= 64; i++) {
        if (!(this.plcForm.get(`inputs${i}`).value || (this.plcForm.get(`inputs${i}`).disabled))) {
          tidx = i;

          let enoughSpace = true;
          for (let j = 0; j < words; j++) {
            if ((this.plcForm.get(`inputs${i + j}`).value || (this.plcForm.get(`inputs${i + j}`).disabled))) {
              enoughSpace = false;
              j = words;
            }
          }
          if(enoughSpace == true)
          {
            i = 64;
          }
        }
      }
    this.index2 = tidx;
      this.writeArr.push(this.plcNumber);
      this.writeArr.push(`pos${this.index2}`);
      this.writeArr.push(words - 1);
      this.plcForm.get(`inputs${this.index2}`).patchValue(this.plcNumber);
      for (let j = this.index2; j < words2 + this.index2 - 1; j++) {
        this.plcForm.get(`inputs${j + 1}`).disable();
      }
      let arrlength = this.writeArr.length;
      if (arrlength > 0) {
        enableSaveBtn = true
        this.writeStatus = true
      }else{
        this.writeStatus = false
      }
      this.index2 = this.index2 + words2;
      this.saveBtnMode(enableSaveBtn)
    }
    
    else{
      
      if(type==='read'){
        this.toastr.error('Wrong value in Read Area', '', {
          timeOut: 3000
        });
        this.plcForm.markAsPristine()
        return;
      }
      
      else if(type==='write'){
        this.toastr.error('Wrong value in Write Area', '', {
          timeOut: 3000
        });
        this.plcForm.markAsPristine()
        return;
      }
    }
    
  }
  saveBtnMode(enableSaveBtn) {
    if (enableSaveBtn == true) {
      this.plcForm.markAsDirty();
    } else {
      
    }
  }
  onSubmit() {
    let inputData: any = [];
    let outputData: any = [];
    let inADIs: any = {};
    let outADIs: any = {};
    let formData: any = {};

    for (let i = 1; i <= this.range; i++) {
      if (this.plcForm.get(`input${i}`).value) {
        inputData.push({
          id: this.plcForm.get(`input${i}`).value,
          pos: i - 1
        });
      }
    }

    for (let i = 1; i <= this.range; i++) {
      if (this.plcForm.get(`inputs${i}`).value) {
        outputData.push({
          id: this.plcForm.get(`inputs${i}`).value,
          pos: i - 1
        });
      }
    }

    inADIs = inputData;
    outADIs = outputData;

    formData = {
      inADIs,
      outADIs
    };

    if (this.readArr.length === 0 && this.writeArr.length === 0) {
      this.toastr.error('Cannot generate xml with Empty Forms', '', {
        timeOut: 3000
      });
      this.plcForm.markAsPristine()
    } else {
      
    this.plcForm.markAsPristine();
    this.plcService.saveXml(formData).subscribe(
      (data: any) => {
        //this.downloadFile(data);
      },
      (err: any) => {
        //this.downloadFile(err.error.text);
      }
    );
    }
  }

  cancel() {
    this.plcForm.reset();
    this.plcForm.enable();
    this.readArr = [];
    this.writeArr = [];
    this.index = 1;
    this.index2 = 1;
    return false;
  }

  setImportObj(){
    let newArr = new Array();
    for (let j = 0; j < this.plcObject.length; j++) {
      newArr.push(
        this.plcObject[j].number,
        this.plcObject[j].words,
        this.plcObject[j].read,
        this.plcObject[j].write
      );
    }
    return newArr;
  }
  setObject() {
    let newArr = new Array();
    for (let j = 0; j < this.plcObject.length; j++) {
      newArr.push(
        this.plcObject[j].number,
        this.plcObject[j].words,
        this.plcObject[j].read
      );
    }
    return newArr;
  }
  setWrite() {
    let newArr = new Array();
    for (let j = 0; j < this.plcObject.length; j++) {
      newArr.push(
        this.plcObject[j].number,
        this.plcObject[j].words,
        this.plcObject[j].write
      );
    }
    return newArr;
  }

  remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

  onBlurRead(i, type,isImport?) {
    let enableSaveBtn: boolean = false;
    if (type === 'read') {
      let baseI = i;
      const val = parseInt(this.plcForm.get(`input${i}`).value);
      const index = this.setObject().indexOf(val) + 1;
      const read = this.setObject().indexOf(val) + 2;
      let prevIdx;
      let prevValWords;
      let prevWords;
      if (this.readArr.includes(`pos${baseI}`)) {
        prevIdx = this.readArr.indexOf(`pos${baseI}`) - 1;
        prevValWords = this.readArr[prevIdx + 2];
        prevWords = this.readArr[prevIdx + 2];
        const val2 = parseInt(this.plcForm.get(`input${baseI}`).value);
        if (this.setObject()[read] != 'yes') {
          if (!isNaN(val2)) {
            this.plcForm.get(`input${i}`).patchValue(this.readArr[prevIdx]);
            this.toastr.error('Wrong value in Read Area', '', {
              timeOut: 3000
            });
            this.plcForm.markAsPristine()
            return;
          }
        }
        if (this.readArr.includes(val2)) {
          this.plcForm.get(`input${i}`).patchValue(this.readArr[prevIdx]);
          this.toastr.error('Dupliate ADI Number is not allowed', '', {
            timeOut: 3000
          });
          this.plcForm.markAsPristine()
          return;
        }
        if (isNaN(val2)) {
          let eIdx = 0;
          while (prevValWords > 0) {
            --prevValWords;
            eIdx++;
            this.plcForm.get(`input${baseI + eIdx}`).enable();
          }
          this.readArr.splice(prevIdx, 3);
          const totalADIs = this.readArr.length / 3;
          const currentADI = prevIdx / 3;
          if (totalADIs === currentADI) this.index = this.index - prevWords - 1;
          return;
        }
        const index2 = this.setObject().indexOf(val2) + 1;
        const currentWords = this.setObject()[index2] - 1;
        let diff = currentWords - prevValWords;
        let err: boolean = false;
        if (currentWords > prevValWords) {
          for (let i = baseI + 1; i < baseI + 1 + currentWords; i++) {
            let tempVal = parseInt(this.plcForm.get(`input${i}`).value);
            if (tempVal) {
              err = true;
              break;
            }
          }
        }
        if (err) {
          this.toastr.error('Not enough space', '', { timeOut: 3000 });
          this.plcForm.get(`input${baseI}`).patchValue(this.readArr[prevIdx]);
          this.plcForm.markAsPristine()
          return;
        }
        if (diff == 0) {
        } else if (diff < 0) {
          var enableIndex = currentWords;
          while (diff < 0) {
            ++diff;
            enableIndex++;
            this.plcForm.get(`input${baseI + enableIndex}`).enable();
          }
          
        } else if (diff > 0) {
          var disableIndex = prevValWords;
          while (diff > 0) {
            --diff;
            disableIndex++;
            this.plcForm.get(`input${baseI + disableIndex}`).disable();
          }
        }
        const words1 = this.setObject()[index];
        this.readArr.splice(prevIdx, 3);
        this.readArr.push(val);
        this.readArr.push(`pos${baseI}`);
        this.readArr.push(words1 - 1);
        this.index = baseI + currentWords + diff + 1;
        return;
      } else if (
        this.setObject().includes(val) &&
        this.setObject()[read] === 'yes'
      ) {
        let err: boolean = false;
        {
          for (
            let i = baseI + 1;
            i < baseI + 1 + this.setObject()[index] - 1;
            i++
          ) {
            let tempVal = parseInt(this.plcForm.get(`input${i}`).value);
            if (tempVal) {
              err = true;
              break;
            }
          }
        }
        if (err) {
          this.toastr.error('Not enough space', '', { timeOut: 3000 });
          this.plcForm.get(`input${baseI}`).patchValue(this.readArr[prevIdx]);
          this.plcForm.markAsPristine()
          return;
        } else {
          this.index = baseI;
        }
        this.preVal2 = val;
        if (i > this.index) this.index = i;
        if (this.readArr.includes(val)) {
          this.plcForm.get(`input${i}`).patchValue('');
          this.toastr.error('Dupliate ADI Number is not allowed', '', {
            timeOut: 3000
          });
          this.plcForm.markAsPristine()
          return;
        }
        const words1 = this.setObject()[index];
        this.readArr.push(val);
        this.readArr.push(`pos${baseI}`);
        this.readArr.push(words1 - 1);
        this.previousWords = words1 - 1;
        let arrlength = this.readArr.length;
        if (arrlength > 0) {
          enableSaveBtn = true
        }
        for (let i = this.index; i < words1 - 1 + this.index; i++) {
          this.plcForm.get(`input${i + 1}`).disable();
        }
        this.index = this.index + words1;
        this.editIndex = this.index;
      } 
      else {
        const wrongVal=this.plcForm.get(`input${i}`).value;
        if(wrongVal!=null && wrongVal && !isImport){
          this.plcForm.get(`input${i}`).patchValue('');
          this.toastr.error('Wrong value in Read Area', '', { timeOut: 3000 });
          this.plcForm.markAsPristine()
        }
      }
    }
    if(this.writeStatus == false){
      this.saveBtnMode(enableSaveBtn)
    }
    
  }

  onBlurWrite(i, type,isImport) {
    let enableSaveBtn: boolean = false;
    if (type === 'write') {
      let baseI2 = i;
      const val = parseInt(this.plcForm.get(`inputs${i}`).value);
      const index = this.setWrite().indexOf(val) + 1;
      const write = this.setWrite().indexOf(val) + 2;
      let prevIdx2;
      let prevValWords2;
      let prevWords2;
      if (this.writeArr.includes(`pos${baseI2}`)) {
        prevIdx2 = this.writeArr.indexOf(`pos${baseI2}`) - 1;
        prevValWords2 = this.writeArr[prevIdx2 + 2];
        prevWords2 = this.writeArr[prevIdx2 + 2];
        const val2 = parseInt(this.plcForm.get(`inputs${baseI2}`).value);
        if (this.setWrite()[write] != 'yes') {
          if (!isNaN(val2)) {
            this.plcForm.get(`inputs${i}`).patchValue(this.writeArr[prevIdx2]);
            this.toastr.error('Wrong value in Write Area', '', {
              timeOut: 3000
            });
            this.plcForm.markAsPristine()
            return;
          }
        }
        if (this.writeArr.includes(val2)) {
          this.plcForm.get(`inputs${i}`).patchValue(this.writeArr[prevIdx2]);
          this.toastr.error('Dupliate ADI Number is not allowed', '', {
            timeOut: 3000
          });
          this.plcForm.markAsPristine()
          return;
        }
        if (isNaN(val2)) {
          let eIdx2 = 0;
          while (prevValWords2 > 0) {
            --prevValWords2;
            eIdx2++;
            this.plcForm.get(`inputs${baseI2 + eIdx2}`).enable();
          }
          this.writeArr.splice(prevIdx2, 3);
          const totalADIs2 = this.writeArr.length / 3;
          const currentADI2 = prevIdx2 / 3;
          if (totalADIs2 === currentADI2)
            this.index2 = this.index2 - prevWords2 - 1;
          return;
        }
        const index2 = this.setWrite().indexOf(val2) + 1;
        const currentWords = this.setWrite()[index2] - 1;
        let diff = currentWords - prevValWords2;
        let err2: boolean = false;
        if (currentWords > prevValWords2) {
          for (let i = baseI2 + 1; i < baseI2 + 1 + currentWords; i++) {
            let tempVal2 = parseInt(this.plcForm.get(`inputs${i}`).value);
            if (tempVal2) {
              err2 = true;
              break;
            }
          }
        }
        if (err2) {
          this.toastr.error('Not enough space', '', { timeOut: 3000 });
          this.plcForm
            .get(`inputs${baseI2}`)
            .patchValue(this.writeArr[prevIdx2]);
            this.plcForm.markAsPristine()
          return;
        }

        if (diff == 0) {
        } else if (diff < 0) {
          var enableIndex = currentWords;
          while (diff < 0) {
            enableIndex++;
            this.plcForm.get(`inputs${baseI2 + enableIndex}`).enable();
            ++diff;
          }
        } else if (diff > 0) {
          var disableIndex = prevValWords2;
          while (diff > 0) {
            diff--;
            disableIndex++;
            this.plcForm.get(`inputs${baseI2 + disableIndex}`).disable();
          }
        }
        const words1 = this.setWrite()[index];
        this.writeArr.splice(prevIdx2, 3);
        this.writeArr.push(val);
        this.writeArr.push(`pos${baseI2}`);
        this.writeArr.push(words1 - 1);
        this.index2 = baseI2 + currentWords + diff + 1;
        return;
      } else if (
        this.setWrite().includes(val) &&
        this.setWrite()[write] === 'yes'
      ) {
        let err3: boolean = false;
        for (
          let i = baseI2 + 1;
          i < baseI2 + 1 + this.setWrite()[index] - 1;
          i++
        ) {
          let tempVal = parseInt(this.plcForm.get(`inputs${i}`).value);
          if (tempVal) {
            err3 = true;
            break;
          }
        }
        
        if (err3) {
          this.toastr.error('Not enough space', '', { timeOut: 3000 });
          this.plcForm
            .get(`inputs${baseI2}`)
            .patchValue(this.readArr[prevIdx2]);
            this.plcForm.markAsPristine()
          return;
        } else {
          this.index2 = baseI2 - 1;
        }
        this.preVal = val;
        if (i > this.index2) this.index2 = i;
        if (this.writeArr.includes(val)) {
          this.plcForm.get(`inputs${i}`).patchValue('');
          this.toastr.error('Dupliate ADI Number is not allowed', '', {
            timeOut: 3000
          });
          this.plcForm.markAsPristine()
          return;
        }
        const words1 = this.setWrite()[index];
        this.writeArr.push(val);
        this.writeArr.push(`pos${baseI2}`);
        this.writeArr.push(words1 - 1);
        this.previousWords = words1 - 1;
        let arrlength = this.writeArr.length;
        if (arrlength > 0) {
          enableSaveBtn = true
        }
        for (let i = this.index2; i < words1 - 1 + this.index2; i++) {
          this.plcForm.get(`inputs${i + 1}`).disable();
        }
        this.index2 = this.index2 + words1;
        this.editIndex = this.index2;
      } 
      else {
        const wrongVal=this.plcForm.get(`inputs${i}`).value;
        if(wrongVal!=null && wrongVal && !isImport){
          this.plcForm.get(`inputs${i}`).patchValue('');
          this.toastr.error('Wrong value in Write Area', '', { timeOut: 3000 });
          this.plcForm.markAsPristine()
        }
      }
    }
    if(this.readStatus == false){
      this.saveBtnMode(enableSaveBtn)
    }
  }
  export(){
    if(this.plcForm.dirty){
      this.toastr.error('Please save your changes before exporting', '', {
        timeOut: 3000
      });
      return;
    }
    else{
      this.plcService.exportPLc()
      .subscribe((data)=>{
        console.log('data',data);
        this.downloadFile(data)
      },(err)=>{
        console.log('err')
      })
    }

  }
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/attachment' });
    console.log(blob)
    const date = new Date().getTime();
    saveAs(blob, `${date}.PLC`);
  }
}
