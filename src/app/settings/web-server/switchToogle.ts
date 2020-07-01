export const switchToogle=(obj,istooglePLcAccess,self)=>{
    if(obj){
      const toInt=parseInt(obj);
      switch(toInt) {
        case 0:
          sendToogleVal(false,false,istooglePLcAccess,self)
          break;
        case 1:
          sendToogleVal(true,false,istooglePLcAccess,self)
          break;
        case 2:
          sendToogleVal(false,true,istooglePLcAccess,self)
          break;
        case 3:
          sendToogleVal(true,true,istooglePLcAccess,self)
          break;
        default:
      }
      
    }
}

export const sendToogleVal=(f,t,istooglePLcAccess?,self?)=>{
    let plcObj={};
    if(istooglePLcAccess){
      plcObj={
        External_Web_Access:f,
        External_Web_AccessRO:t
      }
      self.patchValue(plcObj)
    }
    else{
      if(f===0 && t===0){
        plcObj={iExtWebSrvAcc:0}
      }
      else if(f===1 && t===0){
        plcObj={iExtWebSrvAcc:1}
      }
      else if(f===0 && t===1){
        plcObj={iExtWebSrvAcc:2}
      }
      else if(f===1 && t===1){
        plcObj={iExtWebSrvAcc:3}
      }
      return plcObj;
    }
    
  }