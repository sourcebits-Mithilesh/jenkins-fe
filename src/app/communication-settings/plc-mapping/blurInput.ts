const blurImportedXML = (inADIs, outADIs, self, isImport?) => {
  let readArr = [];
  let writeArr=[];
  let err:boolean=false;
  let readErr=[];
  let writeErr=[];
  // import validation
  if (isImport) {
    let orignalArr=self.setImportObj();
    let arr = orignalArr.filter((_, i) => i % 4 == 0).sort()
    if(inADIs){
      if (inADIs.length > 1 ) {
        inADIs.sort((a, b) => a._attributes.pos - b._attributes.pos);
        inADIs.forEach((data)=>{
          if(data._attributes.id && data._attributes.pos){
          const adiVal=parseInt(data._attributes.id);
          const isRead=orignalArr[orignalArr.indexOf(adiVal)+2]
          if(isRead==='yes'){
            readArr.push(adiVal)
          }
          else{
            err=true;
            readErr.push(adiVal)
          }
        } 
        })
      }
    }
    if(outADIs){
    if (outADIs.length > 1) {
      outADIs.sort((a, b) => a._attributes.pos - b._attributes.pos);
      outADIs.forEach((data)=>{
        if(data._attributes.id && data._attributes.pos){
          const adiVal=parseInt(data._attributes.id);
          const isWrite=orignalArr[orignalArr.indexOf(adiVal)+3]
          console.log('orig',orignalArr.indexOf(adiVal))
          if(isWrite==='yes'){
            writeArr.push(adiVal)
          }
          else{
            err=true;
            writeErr.push(adiVal)
          }
        } 
      })
    }
  }
    else{
      if(inADIs && inADIs.length==undefined){
        if(inADIs._attributes.id && inADIs._attributes.id){
        const readAdiVal=parseInt(inADIs._attributes.id)
        const isRead=orignalArr[orignalArr.indexOf(readAdiVal)+2]
        if(isRead==='yes'){
          readArr.push(readAdiVal)
        }
        else{
          err=true;
          readErr.push(readAdiVal)
        }
      }
      }
      if(outADIs && outADIs.length==undefined){
        if(outADIs._attributes.id && outADIs._attributes.id){
        const writeAdiVal=parseInt(outADIs._attributes.id)
        const isWrite=orignalArr[orignalArr.indexOf(writeAdiVal)+3]
        if(isWrite==='yes'){
          writeArr.push(writeAdiVal)
        }
        else{
          err=true;
          writeArr.push(writeAdiVal)
        }
      }
      }
    }
    
    const intersection1 = arr.filter(element => readArr.includes(element));
    const intersection2 = arr.filter(element => writeArr.includes(element));
    
    if(intersection1.length!=readArr.length || intersection2.length!=writeArr.length || err){
      if(readErr.length>0){
        self.toastr.error(`File has invalid data ${readErr[0]} for the read area config`, '', {
          timeOut: 3000
        });
      }
      else if(writeErr.length>0){
        self.toastr.error(`File has invalid data ${writeErr[0]} for the write area config`, '', {
          timeOut: 3000
        });
      }
      else if(readArr.length!==intersection1.length){
        const [error] =[...new Set(readArr.filter((value, index, self) => self.indexOf(value) !== index))]
         self.toastr.error(`Dupplicate data ${error} for the read area config`, '', {
           timeOut: 3000
         });
       }
      else if(writeArr.length!==intersection2.length){
       const [error] =[...new Set(writeArr.filter((value, index, self) => self.indexOf(value) !== index))]
        self.toastr.error(`Dupplicate data ${error} for the write area config`, '', {
          timeOut: 3000
        });
      }
      return;
    }


    // reset form and index values
    self.cancel()
  }
  if (inADIs) {
    feedInput(inADIs,isImport,self,'inADIs')
  }
  if (outADIs) {
    feedInput(outADIs,isImport,self,'outADIs')
  }
}

const feedInput=(adiTypes,isImport,self,types)=>{
  let sum:any=0;
  let total:any=0;
  let orignalArr=self.setImportObj();
  // if multiple values in xml tag
  if (adiTypes.length > 1) {
    adiTypes.forEach(data => {
      if(isImport){
        const adiVal=parseInt(data._attributes.id);
        const words=orignalArr[orignalArr.indexOf(adiVal)+1]
        sum=total;
        total=sum+words;
      }
      
      if(data.pos || data._attributes.pos || data.id || data._attributes.id){
        const pos = !isImport ? (parseInt(data.pos) + 1) : (parseInt(sum) + 1)
        const id = !isImport ? (parseInt(data.id)) : (parseInt(data._attributes.id))
        types==='inADIs' ? self.plcForm.get(`input${pos}`).patchValue(id) : self.plcForm.get(`inputs${pos}`).patchValue(id)
        types==='inADIs' ? self.onBlurRead(pos, 'read', true) : self.onBlurWrite(pos, 'write', true)
      }

    });
  } else {
    // if single value inside xml tag
    if(isImport){
      let sum:any=0;
      let total:any=0;
      const adiVal=parseInt(adiTypes._attributes.id);
      const words=orignalArr[orignalArr.indexOf(adiVal)+1]
      sum=total;
      total=sum+words;
    }
    if(adiTypes.pos || adiTypes._attributes.pos || adiTypes.id || adiTypes._attributes.id){
    const pos = !isImport ? (parseInt(adiTypes.pos) + 1) : (parseInt(sum) + 1);
    const id = !isImport ? (parseInt(adiTypes.id)) : (parseInt(adiTypes._attributes.id));
    types==='inADIs' ? self.plcForm.get(`input${pos}`).patchValue(id) : self.plcForm.get(`inputs${pos}`).patchValue(id)
    types==='inADIs' ? self.onBlurRead(pos, 'read', true) : self.onBlurWrite(pos, 'write', true)
    }
  }
}


export default blurImportedXML