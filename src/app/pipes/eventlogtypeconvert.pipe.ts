import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventlogtypeconvert'
})
export class EventlogtypeconvertPipe implements PipeTransform {

  transform(value: any, arg1 : any, arg2 : any, arg3 : any): any {
    let return_=[]
    let type_;
    if(arg2=='event') {
      value.forEach(element => {
        type_ = element[arg3[arg1]]
        if(type_>0){
          element.Event_Logs.forEach(log => {
            if(log.EventType==arg3[arg1]) {
              return_.push(log)
            }
          });
        }
      });
    }
    else if(arg2=='zones') {
      value.forEach(element => {
        element.Event_Logs.forEach(log => {
          if(log.ZoneName==arg3[arg1]) {
            return_.push(log)
          }
        });
      });
    }
    return return_;
  }

}
