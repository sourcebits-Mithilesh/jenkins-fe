import moment from 'moment';

export const validateEditSetBack = (
  date,
  startH,
  endH,
  startM,
  endM,
  eventNumber?
) => {
  let validSetBack = false;
  let indexes = [0, 1, 2, 3, 4, 5].filter(item => item !== eventNumber);
  for (let i = 0; i < indexes.length+1; i++) {
    const propertyStartHour = `SchedulerEvent${i}StartHour`;
    const propertyEndHour = `SchedulerEvent${i}EndHour`;
    const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
    const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
    const sH = parseInt(startH) * 60 + parseInt(startM);
    const eH = parseInt(endH) * 60 + parseInt(endM);
    const psH =
      parseInt(date[propertyStartHour].Value) * 60 +
      parseInt(date[propertyStartMinute].Value);
    const peH =
      parseInt(date[propertyEndHour].Value) * 60 +
      parseInt(date[propertyEndMinute].Value);
    console.log('sH >= psH----', ' ', sH, ' ', psH);
    console.log('eH <= peH----', ' ', eH, ' ', peH);
    if (sH >= psH && eH <= peH)return validSetBack=true;
    
  }
};

export const validateEditHeat = (date, startH, endH, eventNumber?) => {
  let validHeat = false;
  //let indexes = [0, 1, 2, 3, 4, 5].filter(item => item !== eventNumber);
  let indexes = [0, 1, 2, 3, 4, 5];

  for (let i = 0; i < indexes.length; i++) {
    const propertyStartHour = `SchedulerEvent${i}StartHour`;
    const propertyEndHour = `SchedulerEvent${i}EndHour`;
    const sH = parseInt(startH);
    const eH = parseInt(endH);
    const psH = parseInt(date[propertyStartHour].Value);
    const peH = parseInt(date[propertyEndHour].Value);
    console.log('sH >= psH----', ' ', sH, ' ', psH);
    console.log('eH <= peH----', ' ', eH, ' ', peH);
    if (sH >= psH && eH <= peH) {
      return (validHeat = true);
    }
  }
};

// validate Heat Event should not overlap with another Heat event.
export const validateHeatEvents = (startH, startM, endH, endM, date) => {
  let validHeatEvent = true;
  const indexes = [0, 1, 2, 3, 4, 5];
  // loop through all schedular xml tag
  for (let i = 0; i < indexes.length; i++) {
    const propertyStartHour = `SchedulerEvent${i}StartHour`;
    const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
    const propertyEndHour = `SchedulerEvent${i}EndHour`;
    const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
    const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker values
    const e2 = parseInt(endH) * 60 + parseInt(endM);    // time picker values
    // getting values from current xml tag and converting to minutes.
    const s1 =
      parseInt(date[propertyStartHour].Value) * 60 +
      parseInt(date[propertyStartMinute].Value); // converting  to minutes
    const e1 =
      parseInt(date[propertyEndHour].Value) * 60 +
      parseInt(date[propertyEndMinute].Value); // converting  to minutes
    // compare values
    (s2 < s1 && e2 < s1) || (s2 > e1 && e2 > e1)
      ? null
      : (validHeatEvent = false);
  }
  return validHeatEvent;
};


//finding the event to update 

export const FindHeatEvents = (startH, startM, endH, endM, date) => {
  let heatEvent;
  const indexes = [0, 1, 2, 3, 4, 5];
  // loop through all schedular xml tag
  for (let i = 0; i < indexes.length; i++) {
    const propertyStartHour = `SchedulerEvent${i}StartHour`;
    const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
    const propertyEndHour = `SchedulerEvent${i}EndHour`;
    const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
    const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker values
    const e2 = parseInt(endH) * 60 + parseInt(endM); // time picker values
    // getting values from current xml tag and converting to minutes.
    const s1 =
      parseInt(date[propertyStartHour].Value) * 60 +
      parseInt(date[propertyStartMinute].Value); // converting  to minutes
    const e1 =
      parseInt(date[propertyEndHour].Value) * 60 +
      parseInt(date[propertyEndMinute].Value); // converting  to minutes
    // compare values
    if(s2===s1){
      heatEvent=i;
    }
  }
  return heatEvent;
};


// validate SetBack Event
export const validateSetbackEvents = (startH, startM, endH, endM, date) => {
  let validEvent = true;
  const indexes = [0, 1, 2, 3, 4, 5];
  // loop through schedular xml tag
  for (let i = 0; i < indexes.length; i++) {
    const propertyStartHour = `SchedulerEvent${i}StartHour`;
    const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
    const propertyEndHour = `SchedulerEvent${i}EndHour`;
    const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
    const propertyStartType = `SchedulerEvent${i}StartType`;
    // schedular event type is setback(3)
    if (parseInt(date[propertyStartType].Value) == 3) {
      const s2 = parseInt(startH) * 60 + parseInt(startM);
      const e2 = parseInt(endH) * 60 + parseInt(endM);
      const s1 =
        parseInt(date[propertyStartHour].Value) * 60 +
        parseInt(date[propertyStartMinute].Value);
      const e1 =
        parseInt(date[propertyEndHour].Value) * 60 +
        parseInt(date[propertyEndMinute].Value);
      // time range is between Heat event than only add Setback
      (s2 < s1 && e2 < s1) || (s2 > e1 && e2 > e1)
        ? null
        : (validEvent = false);
    }
  }
  return validEvent;
};

export const validateEventsOnUpdate = (
  startH,
  startM,
  endH,
  endM,
  date,
  currentEvent,
  id?
) => {
  let validEvent = true;
  const indexes = [0, 1, 2, 3, 4, 5].filter(item => item !== currentEvent);
  // if event type is setback
  if (id === '3') {
    for (let i = 0; i < indexes.length; i++) {
      const propertyStartHour = `SchedulerEvent${indexes[i]}StartHour`;
      const propertyStartMinute = `SchedulerEvent${indexes[i]}StartMinute`;
      const propertyEndHour = `SchedulerEvent${indexes[i]}EndHour`;
      const propertyEndMinute = `SchedulerEvent${indexes[i]}EndMinute`;
      const propertyStartType = `SchedulerEvent${indexes[i]}StartType`;
      // if event type is SetBack
      if (parseInt(date[propertyStartType].Value) == 3) {
        const s2 = parseInt(startH) * 60 + parseInt(startM);
        const e2 = parseInt(endH) * 60 + parseInt(endM);
        const s1 =
          parseInt(date[propertyStartHour].Value) * 60 +
          parseInt(date[propertyStartMinute].Value);
        const e1 =
          parseInt(date[propertyEndHour].Value) * 60 +
          parseInt(date[propertyEndMinute].Value);
        // compare values
        (s2 <s1 && e2 <s1) || (s2 > e1 && e2 > e1)
          ? null
          : (validEvent = false);
      }
    }
  }
  // if event type is Heat
  else if (id === '2') {
    for (let i = 0; i < indexes.length; i++) {
      const propertyStartHour = `SchedulerEvent${indexes[i]}StartHour`;
      const propertyStartMinute = `SchedulerEvent${indexes[i]}StartMinute`;
      const propertyEndHour = `SchedulerEvent${indexes[i]}EndHour`;
      const propertyEndMinute = `SchedulerEvent${indexes[i]}EndMinute`;
      const propertyStartType = `SchedulerEvent${indexes[i]}StartType`;
      // if event type is heat event
      if (parseInt(date[propertyStartType].Value) == 2) {
        const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker value
        const e2 = parseInt(endH) * 60 + parseInt(endM); // time picker value

        const s1 =
          parseInt(date[propertyStartHour].Value) * 60 +
          parseInt(date[propertyStartMinute].Value);
        const e1 =
          parseInt(date[propertyEndHour].Value) * 60 +
          parseInt(date[propertyEndMinute].Value);

        // compare values with time picker and xml tag.
        (s2 < s1 && e2 < s1) || (s2 > e1 && e2 > e1)
          ? null
          : (validEvent = false);
      }
    }
  }
  return validEvent;
};

export const validate = (date, startH, endH, startM, endM) => {
  const indexes = [0, 1, 2, 3, 4, 5];
  let validateRange = false;
  console.log('--------------------------------------------');

  for (let i = 0; i < indexes.length; i++) {
    const propertyStartHour = `SchedulerEvent${i}StartHour`;
    const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
    const propertyEndHour = `SchedulerEvent${i}EndHour`;
    const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
    const s2 = parseInt(startH) * 60 + parseInt(startM);
    const e2 = parseInt(endH) * 60 + parseInt(endM);
    const s1 =
      parseInt(date[propertyStartHour].Value) * 60 +
      parseInt(date[propertyStartMinute].Value);
    const e1 =
      parseInt(date[propertyEndHour].Value) * 60 +
      parseInt(date[propertyEndMinute].Value);

    if (s2 >= s1 && e2 <= e1) {
      validateRange = true;
      // console.log(s2 + '>=' + s1 + '&&' + e2 + '<=' + e1 + '=' + validateRange);

    }
  }
  return validateRange;
};
// validate not to overlap heat event from other event while editing.
export const validateHeatRange = (
  date,
  startH,
  startM,
  endH,
  endM,
  number,
  currentStart,
  currentEnd
) => {
  let indexes = [0, 1, 2, 3, 4, 5];
  let validateHeatRange: boolean = true;
  if (number === '2') {
    for (let i = 0; i < indexes.length; i++) {
      const propertyStartHour = `SchedulerEvent${i}StartHour`;
      const propertyStartMinute = `SchedulerEvent${i}StartMinute`;
      const propertyEndHour = `SchedulerEvent${i}EndHour`;
      const propertyEndMinute = `SchedulerEvent${i}EndMinute`;
      const propertyStartType = `SchedulerEvent${i}StartType`;
      // current event time
      const currentStartH = currentStart.hours();
      const currentStartM = currentStart.minutes();
      const currentEndH = currentEnd.hours();
      const currentEndM = currentEnd.minutes();
      const s0 = parseInt(currentStartH) * 60 + parseInt(currentStartM);
      const e0 = parseInt(currentEndH) * 60 + parseInt(currentEndM);
      // if event type is SetBack.
      if (date[propertyStartType].Value === '3') {
        const s2 = parseInt(startH) * 60 + parseInt(startM);
        const e2 = parseInt(endH) * 60 + parseInt(endM);
        const s1 =parseInt(date[propertyStartHour].Value) * 60 +parseInt(date[propertyStartMinute].Value);
        const e1 =parseInt(date[propertyEndHour].Value) * 60 +parseInt(date[propertyEndMinute].Value);
        if (s0 <= s1 && e0 >= e1) {
          s2 <= s1 && e2 >= e1 ? (validateHeatRange = true): (validateHeatRange = false);
          if(!validateHeatRange)
          {
            return false;
          }
        }
      }
    }
  }
  return validateHeatRange;
};

export const HeatEditRange = (date, startH, startM, endH, endM, schedular) => {
  let validateRange: boolean = true;
  for (let i = schedular; i <= 4; i++) {
    const propertyStartType = `SchedulerEvent${schedular + 1}StartType`;
    const propertyStartHour = `SchedulerEvent${schedular + 1}StartHour`;
    const propertyStartMinute = `SchedulerEvent${schedular + 1}StartMinute`;
    const propertyEndHour = `SchedulerEvent${schedular + 1}EndHour`;
    const propertyEndMinute = `SchedulerEvent${schedular + 1}EndMinute`;
    const sH = parseInt(startH) * 60 + parseInt(startM);    
    const eH = parseInt(endH) * 60 + parseInt(endM);
    const psH =
      parseInt(date[propertyStartHour].Value) * 60 +
      parseInt(date[propertyStartMinute].Value);
    const peH =
      parseInt(date[propertyEndHour].Value) * 60 +
      parseInt(date[propertyEndMinute].Value);
    // event type is Heat event
    if (date[propertyStartType].Value === '2') {
      (eH >= psH && eH <= peH) || (sH >= psH && sH <= peH)
        ? (validateRange = true)
        : (validateRange = false);
    }
  }
  return validateRange;
};


export const validShiftEvent=(date, startH, endH, startM, endM)=>{
  //TODO
 let validShift=true;
  // let currntStartTime=moment().hour(startH).minute(startM).minutes()
  // let currntEndTime=moment().hour(endH).minute(endM).minutes()
  // console.log(currntStartTime,currntEndTime)

  for(let i=0;i<5; i++){
  
      let iStartHr=date[`ShiftEvent${i}StartHour`].Value;
      let iStartMn=date[`ShiftEvent${i}StartMinute`].Value;
      let iEndHr=date[`ShiftEvent${i}EndHour`].Value;
      let iEndMn=date[`ShiftEvent${i}EndMinute`].Value;
      // let iStartTime=moment().hour(iStartHr).minute(iStartMn)
      // let iEndTime=moment().hour(iEndHr).minute(iEndMn)
      

      const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker values
      const e2 = parseInt(endH) * 60 + parseInt(endM);    // time picker values
      // getting values from current xml tag and converting to minutes.
      const s1 =
        parseInt(iStartHr) * 60 +
        parseInt(iStartMn); // converting  to minutes
      const e1 =
        parseInt(iEndHr) * 60 +
        parseInt(iEndMn); // converting  to minutes
      // compare values
      (s2 < s1 && e2 < s1) || (s2 > e1 && e2 > e1)?null:(validShift=false)
  
      
  }
  return validShift;
      

  }
  
 
export const validateShiftsOnUpdate=(startH,startM,endH,endM,day,currentEvent)=>{
  let validEvent = true;
  const indexes = [0, 1, 2, 3, 4].filter(item => item !== currentEvent);

  for(let i=0; i<indexes.length; i++){
  
    let iStartHr=day[`ShiftEvent${indexes[i]}StartHour`].Value;
    let iStartMn=day[`ShiftEvent${indexes[i]}StartMinute`].Value;
    let iEndHr=day[`ShiftEvent${indexes[i]}EndHour`].Value;
    let iEndMn=day[`ShiftEvent${indexes[i]}EndMinute`].Value;
    // let iStartTime=moment().hour(iStartHr).minute(iStartMn)
    // let iEndTime=moment().hour(iEndHr).minute(iEndMn)
    

    const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker values
    const e2 = parseInt(endH) * 60 + parseInt(endM);    // time picker values
    // getting values from current xml tag and converting to minutes.
    const s1 =
      parseInt(iStartHr) * 60 +
      parseInt(iStartMn); // converting  to minutes
    const e1 =
      parseInt(iEndHr) * 60 +
      parseInt(iEndMn);

      (s2 < s1 && e2 < s1) || (s2 > e1 && e2 > e1)
      ? null
      : (validEvent = false);
  
  }
  
  return validEvent;
}


export const validateShiftEvents = (startH, startM, endH, endM, day) => {
  let validHeatEvent = true;
  // loop through all schedular xml tag
  for (let i = 0; i < 5; i++) {
    let iStartHr=day[`ShiftEvent${i}StartHour`].Value;
    let iStartMn=day[`ShiftEvent${i}StartMinute`].Value;
    let iEndHr=day[`ShiftEvent${i}EndHour`].Value;
    let iEndMn=day[`ShiftEvent${i}EndMinute`].Value;
    const s2 = parseInt(startH) * 60 + parseInt(startM); // time picker values
    const e2 = parseInt(endH) * 60 + parseInt(endM);    // time picker values
    // getting values from current xml tag and converting to minutes.
    const s1 =
      parseInt(iStartHr) * 60 +
      parseInt(iStartMn); // converting  to minutes
    const e1 =
      parseInt(iEndHr) * 60 +
      parseInt(iEndMn);
    // compare values
    (s2 < s1 && e2 < s1) || (s2 > e1 && e2 > e1)
      ? null
      : (validHeatEvent = false);
  }
  return validHeatEvent;
};