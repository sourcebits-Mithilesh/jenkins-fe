import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeconvert'
})
export class TimeconvertPipe implements PipeTransform {
  transform(time: any, ...args): any {
    const timeFomrat = args[0];
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    let part = hour > timeFomrat ? 'PM' : '';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > timeFomrat ? hour - timeFomrat : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }
}
