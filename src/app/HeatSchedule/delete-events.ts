export const deleteEvent = (toaster,startM,endM,eventType,day, startTime, endTime, obj, startHour, endHour, startMinutes, endMinutes, startType,endType,counter?) => {
    let indexes = [0, 1, 2, 3, 4, 5]
    let eventObj={};
    const psH =parseInt(day[startHour].Value) * 60 + parseInt(day[startMinutes].Value)
    const peH =parseInt(day[endHour].Value) * 60 + parseInt(day[endMinutes].Value)
   console.log(day)
    const sH=parseInt(startTime) * 60 + parseInt(startM)
    const eH=parseInt(endTime) * 60 + parseInt(endM)

    if(eventType=="3"){
        for (let i = 0; i < indexes.length; i++) {
            const propertyStartHour = `SchedulerEvent${i}StartHour`;
            const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
            const propertyEndHour = `SchedulerEvent${i}EndHour`;
            const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
            const propertyStartType = `SchedulerEvent${i}StartType`;

            const psH =parseInt(day[propertyStartHour].Value) * 60 + parseInt(day[propertyStartMinute].Value);
            const peH =parseInt(day[propertyEndHour].Value) * 60 + parseInt(day[propertyEndMinute].Value);
            const sH = parseInt(startTime) * 60 + parseInt(startM);
            const eH = parseInt(endTime) * 60 + parseInt(endM);

 


            if (psH == sH && peH == eH && propertyStartType=='3') {
                obj={}
                obj[`SchedulerEvent${i}StartHour`] = 255;
                obj[`SchedulerEvent${i}EndHour`] = 255;
                obj[`SchedulerEvent${i}StartMinute`] = 255;
                obj[`SchedulerEvent${i}EndMinute`] = 255;
                obj[`SchedulerEvent${i}StartType`] = 0;
                obj[`SchedulerEvent${i}EndType`] = 0;
                 eventObj = obj;
                 return eventObj;
            }
            

        }
      if((psH!=sH)||(peH!=eH)){
          return {};
      }

    }

    //validate if user tries to delete the event which is not between the time range
    // if((psH!=sH) || (peH!=eH)){
    //     return false;
    // }


    //for single heat event delete

    if(counter!=0 && eventType=="2"){
        for (let i = 0; i < indexes.length; i++) {
            const propertyStartType = `SchedulerEvent${i}StartType`;
            const propertyStartHour = `SchedulerEvent${i}StartHour`;
            const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
            const propertyEndHour = `SchedulerEvent${i}EndHour`;
            const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
            const psH =parseInt(day[propertyStartHour].Value) * 60 + parseInt(day[propertyStartMinute].Value);
            const peH =parseInt(day[propertyEndHour].Value) * 60 + parseInt(day[propertyEndMinute].Value);
            
            const sH = parseInt(startTime) * 60 + parseInt(startM);
            const eH = parseInt(endTime) * 60 + parseInt(endM);
            
            let setBackEventType=parseInt(day[propertyStartType].Value)
            

            if (psH >= sH && peH <= eH && setBackEventType==3) {
                obj={}
                obj[`SchedulerEvent${i}StartHour`] = 255;
                obj[`SchedulerEvent${i}EndHour`] = 255;
                obj[`SchedulerEvent${i}StartMinute`] = 255;
                obj[`SchedulerEvent${i}EndMinute`] = 255;
                obj[`SchedulerEvent${i}StartType`] = 0;
                obj[`SchedulerEvent${i}EndType`] = 0;

                Object.assign(eventObj,obj)
            }

           

            if (psH == sH && peH == eH) {
                obj={}
                obj[`SchedulerEvent${i}StartHour`] = 255;
                obj[`SchedulerEvent${i}EndHour`] = 255;
                obj[`SchedulerEvent${i}StartMinute`] = 255;
                obj[`SchedulerEvent${i}EndMinute`] = 255;
                obj[`SchedulerEvent${i}StartType`] = 0;
                obj[`SchedulerEvent${i}EndType`] = 0;
                // obj[startHour] = 255;
                // obj[endHour] = 255;
                // obj[startMinutes] = 255;
                // obj[endMinutes] = 255;
                // obj[startType] = 0;
                // obj[endType] = 0;
                Object.assign(eventObj,obj)
                
            }

        }
        return eventObj
    }

//for deleting setback within heat event
    if(counter==0 && eventType=="2"){
        for (let i = 0; i < indexes.length; i++) {
            const propertyStartType = `SchedulerEvent${i}StartType`;
            const propertyStartHour = `SchedulerEvent${i}StartHour`;
            const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
            const propertyEndHour = `SchedulerEvent${i}EndHour`;
            const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
            const psH =parseInt(day[propertyStartHour].Value) * 60 + parseInt(day[propertyStartMinute].Value);
            const peH =parseInt(day[propertyEndHour].Value) * 60 + parseInt(day[propertyEndMinute].Value);
            ///for checking setBack
            let setBackEventType=parseInt(day[propertyStartType].Value)
            const sH = parseInt(startTime) * 60 + parseInt(startM);
            const eH = parseInt(endTime) * 60 + parseInt(endM);
           
           
        
            if (psH >= sH && peH <= eH && setBackEventType==3) {
                obj={}
                obj[`SchedulerEvent${i}StartHour`] = 255;
                obj[`SchedulerEvent${i}EndHour`] = 255;
                obj[`SchedulerEvent${i}StartMinute`] = 255;
                obj[`SchedulerEvent${i}EndMinute`] = 255;
                obj[`SchedulerEvent${i}StartType`] = 0;
                obj[`SchedulerEvent${i}EndType`] = 0;

                Object.assign(eventObj,obj)
            }


            if (psH == sH && peH == eH) {
                obj={}
                obj[`SchedulerEvent${i}StartHour`] = 255;
                obj[`SchedulerEvent${i}EndHour`] = 255;
                obj[`SchedulerEvent${i}StartMinute`] = 255;
                obj[`SchedulerEvent${i}EndMinute`] = 255;
                obj[`SchedulerEvent${i}StartType`] = 0;
                obj[`SchedulerEvent${i}EndType`] = 0;
                Object.assign(eventObj,obj)
                 eventObj
            }
        }
    }
    else{
         eventObj = obj;

    }
    console.log('event',eventObj)
    return eventObj;
}

export const deleteEventShift=(date,obj,startH,endH,startM,endM)=>{
    let eventObj={};
    for(let i=0;i<5; i++){
  
        let iStartHr=date[`ShiftEvent${i}StartHour`].Value;
        let iStartMn=date[`ShiftEvent${i}StartMinute`].Value;
        let iEndHr=date[`ShiftEvent${i}EndHour`].Value;
        let iEndMn=date[`ShiftEvent${i}EndMinute`].Value;   
      

        const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker values
        const e2 = parseInt(endH) * 60 + parseInt(endM);    // time picker values
        // getting values from current xml tag and converting to minutes.
        const s1 =
            parseInt(iStartHr) * 60 +
            parseInt(iStartMn); // converting  to minutes
        const e1 =
            parseInt(iEndHr) * 60 +
            parseInt(iEndMn); // converting  to minutes
              console.log(s2,s1,e2,e1,  (s2 == s1),(e2 == e1),date,date[`ShiftEvent${i}StartHour`].Value)
            if (s2 == s1 && e2 == e1) {
                obj={}
                obj[`ShiftEvent${i}StartHour`] = 255;
                obj[`ShiftEvent${i}EndHour`] = 255;
                obj[`ShiftEvent${i}StartMinute`] = 255;
                obj[`ShiftEvent${i}EndMinute`] = 255;
         
              eventObj = obj;
            }
            // if((s2!=s1)||(e2!=e1)){  
            //     return {};
            // }

        }
        return eventObj;


}