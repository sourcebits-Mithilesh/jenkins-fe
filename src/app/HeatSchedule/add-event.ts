import { validateHeatEvents, validate, validateSetbackEvents, validShiftEvent } from './event-validation';

export const addEvent = (date, startH, endH, startM, endM, id?,weekobj?) => {
  let indexes = [0, 1, 2, 3, 4, 5]
  let eventObj;
  let obj = {};
  if (id === "3") {
    for (let i = 1; i < indexes.length; i++) {
      const propertyStartType = `SchedulerEvent${i}StartType`;
      if (date[propertyStartType].Value === "0") {
        for (let j = 0; j < indexes.length; j++) {
          const propertyStartHour = `SchedulerEvent${j}StartHour`;
          const propertyEndHour = `SchedulerEvent${j}EndHour`;
          if (validate(date, startH, endH, startM, endM)) {
            obj[`SchedulerEvent${i}StartHour`] = startH;
            obj[`SchedulerEvent${i}EndHour`] = endH;
            obj[`SchedulerEvent${i}StartMinute`] = startM;
            obj[`SchedulerEvent${i}EndMinute`] = endM;
            obj[`SchedulerEvent${i}StartType`] = id;
            obj[`SchedulerEvent${i}EndType`] = 4;
            eventObj = obj;
            return eventObj;
          }
        }
      }
    }
  }
  else if (id === "2") {
    console.log('weekobj',weekobj);
    for (let i = 0; i < indexes.length; i++) {
      const propertyStartType = `SchedulerEvent${i}StartType`;
      if (date[propertyStartType].Value === "0") {
        obj[`SchedulerEvent${i}StartHour`] = startH;
        obj[`SchedulerEvent${i}EndHour`] = endH;
        obj[`SchedulerEvent${i}StartMinute`] = startM;
        obj[`SchedulerEvent${i}EndMinute`] = endM;
        obj[`SchedulerEvent${i}StartType`] = id;
        obj[`SchedulerEvent${i}EndType`] = 1;
        eventObj = obj;
        return eventObj;
      }
    }
  }
}

export const addEvent1 = (weekArr,date, startH, endH, startM, endM, type,toaster?) => {
  // validate if first event try to add is Setback 
  if(date.SchedulerEvent0StartType.Value=='0'
  && date.SchedulerEvent1StartType.Value=='0'
  && date.SchedulerEvent2StartType.Value=='0'
  && date.SchedulerEvent3StartType.Value=='0'
  && date.SchedulerEvent4StartType.Value=='0'
  && date.SchedulerEvent5StartType.Value=='0'
  ){
    if (type === 'setbackEvent') {
      toaster.error('Setback event can not be added without Heat event', '', {
        timeOut: 3000
      });
      weekArr=[];
      return;
    }
  }
  let indexes = [0, 1, 2, 3, 4, 5]
  let eventObj;
  let obj = {};
  // loop through schedular xml tag
  for (let i = 0; i < indexes.length; i++) {
    const propertyStartType = `SchedulerEvent${i}StartType`;
    if (i === 0) {
      // if schedular type is 0 
      if (date[propertyStartType].Value === "0") {
        // if event type is heat 
        if (type == "heatEvent") {
          obj[`SchedulerEvent${i}StartHour`] = startH;
          obj[`SchedulerEvent${i}EndHour`] = endH;
          obj[`SchedulerEvent${i}StartMinute`] = startM;
          obj[`SchedulerEvent${i}EndMinute`] = endM;
          obj[`SchedulerEvent${i}StartType`] = 2;
          obj[`SchedulerEvent${i}EndType`] = 1;
          return eventObj = obj;
        }
        // if event type is setback
        else if(type == "setbackEvent"){
          obj[`SchedulerEvent${i}StartHour`] = startH;
          obj[`SchedulerEvent${i}EndHour`] = endH;
          obj[`SchedulerEvent${i}StartMinute`] = startM;
          obj[`SchedulerEvent${i}EndMinute`] = endM;
          obj[`SchedulerEvent${i}StartType`] = 3;
          obj[`SchedulerEvent${i}EndType`] = 4;
          return eventObj = obj;
        }
      }
    }
    else if (i === 1) {
        if (date[propertyStartType].Value === "0") {
          if (type == 'heatEvent') {
            if (validateHeatEvents(startH, startM, endH, endM, date)) {
              obj[`SchedulerEvent${i}StartHour`] = startH;
              obj[`SchedulerEvent${i}EndHour`] = endH;
              obj[`SchedulerEvent${i}StartMinute`] = startM;
              obj[`SchedulerEvent${i}EndMinute`] = endM;
              obj[`SchedulerEvent${i}StartType`] = 2;
              obj[`SchedulerEvent${i}EndType`] = 1;
              return eventObj = obj;
            }
            else {
              toaster.error('Heat event must not contain between Heat event range', '', {
                timeOut: 3000
              });
              weekArr=[];
              return;
            }
          }
          else if (type == 'setbackEvent') {
            if (validate(date, startH, endH, startM, endM)) {
              obj[`SchedulerEvent${i}StartHour`] = startH;
              obj[`SchedulerEvent${i}EndHour`] = endH;
              obj[`SchedulerEvent${i}StartMinute`] = startM;
              obj[`SchedulerEvent${i}EndMinute`] = endM;
              obj[`SchedulerEvent${i}StartType`] = 3;
              obj[`SchedulerEvent${i}EndType`] = 4;
              return eventObj = obj;
            }
            else {
              toaster.error('Setback event must contain between Heat event range', '', {
                  timeOut: 3000
              });
              weekArr=[];
              return;
            }
          }
        }
    }
    else if (i > 1) {
        if (date[propertyStartType].Value === "0") {
          // if event type is heat event
          if (type == 'heatEvent') {
            if (validateHeatEvents(startH, startM, endH, endM, date)) {
              obj[`SchedulerEvent${i}StartHour`] = startH;
              obj[`SchedulerEvent${i}EndHour`] = endH;
              obj[`SchedulerEvent${i}StartMinute`] = startM;
              obj[`SchedulerEvent${i}EndMinute`] = endM;
              obj[`SchedulerEvent${i}StartType`] = 2;
              obj[`SchedulerEvent${i}EndType`] = 1;
              return eventObj = obj;
            }
            else {
              toaster.error('Heat event already exists between time range', '', {
                timeOut: 3000
              });
              weekArr=[];
              return;
            }
            }
            // if event type is setback event
            else if (type == 'setbackEvent') {
              if (validate(date, startH, endH, startM, endM)) {
                if (!validateSetbackEvents(startH, startM, endH, endM, date)) {
                  toaster.error('Setback event already exists', '', {
                    timeOut: 3000
                  });
                  weekArr=[];
                  return;
                }
                else {
                  obj[`SchedulerEvent${i}StartHour`] = startH;
                  obj[`SchedulerEvent${i}EndHour`] = endH;
                  obj[`SchedulerEvent${i}StartMinute`] = startM;
                  obj[`SchedulerEvent${i}EndMinute`] = endM;
                  obj[`SchedulerEvent${i}StartType`] = 3;
                  obj[`SchedulerEvent${i}EndType`] = 4;
                  return eventObj = obj;
                }
              }
              else {
                toaster.error('Setback event must contain between Heat event range', '', {
                  timeOut: 3000
                });
                weekArr=[];
                return;
              }
            }
          }
    }
    }
}

export const addShiftEvent=(day, startH, endH, startM, endM, toaster,shift?)=>{

        if(validShiftEvent(day,startH, endH, startM, endM)){
            // for(let i=0; i<5; i++){
              if(day[`ShiftEvent${shift}StartHour`].Value=="255"){
                let event=new shiftEvent(shift,startH, endH, startM, endM)
                return event
              }else{
                toaster.error(`Shift ${shift+1} already exist`, '', {
                  timeOut: 3000
                });
              }
            // }
        }
        else {
          toaster.error('Shift event already exists between time range', '', {
            timeOut: 3000
          });
        }
 
 //TODO

}

class shiftEvent{
  constructor(i,startHr,endHr,startMn,endMn){
    this[`ShiftEvent${i}StartHour`]=startHr;
    this[`ShiftEvent${i}StartMinute`]=startMn;
    this[`ShiftEvent${i}EndHour`]=endHr;
    this[`ShiftEvent${i}EndMinute`]=endMn;
  }
}