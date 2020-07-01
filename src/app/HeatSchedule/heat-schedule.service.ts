import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
@Injectable({
  providedIn: 'root'
})
export class HeatScheduleService {
  authToken: any;
  heatScheduler = environment.heatScheduler;
  shiftScheduler=  environment.shiftScheduler;
  base_uri = environment.BASE_URI;
  sysSecurity = environment.sysSecurity;
  constructor(private http: HttpClient, private authService: AuthService) {}
  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
  schedulerOperations(formData) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    // nor_id
    formData.nor_id = this.authService.getNorId();
    return this.http.post(`${this.base_uri + this.heatScheduler}`, formData, {
      headers
    });
  }
  
shiftSchedulerOperations(formData){
  this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    // nor_id
    formData.nor_id = this.authService.getNorId();
    return this.http.post(`${this.base_uri + this.shiftScheduler}`, formData, {
      headers
    });
}

  saveSchedulerStatus(formData) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(`${this.base_uri + this.sysSecurity}`, formData, {
      headers
    });
  }
  getRequestData(
    jHStartH,
    jHStartM,
    jHEndH,
    jHEndM,
    eventStartType,
    eventEndType,
    jEventDay,
    tagObject
  ) {
    var reqFormat = {
      SUNDAY: {},
      MONDAY: {},
      TUESDAY: {},
      WEDNESDAY: {},
      THURSDAY: {},
      FRIDAY: {},
      SATURDAY: {}
    };
    if ('SUNDAY' == jEventDay) {
      reqFormat.SUNDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.SUNDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.SUNDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.SUNDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.SUNDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.SUNDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    } else if ('MONDAY' == jEventDay) {
      reqFormat.MONDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.MONDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.MONDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.MONDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.MONDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.MONDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    } else if ('TUESDAY' == jEventDay) {
      reqFormat.TUESDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.TUESDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.TUESDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.TUESDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.TUESDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.TUESDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    } else if ('WEDNUSDAY' == jEventDay) {
      reqFormat.WEDNESDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.WEDNESDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.WEDNESDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.WEDNESDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.WEDNESDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.WEDNESDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    } else if ('THURSDAY' == jEventDay) {
      reqFormat.THURSDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.THURSDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.THURSDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.THURSDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.THURSDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.THURSDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    } else if ('FRIDAY' == jEventDay.toUpperCase()) {
      reqFormat.FRIDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.FRIDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.FRIDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.FRIDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.FRIDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.FRIDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    } else if ('SATURDAY' == jEventDay.toUpperCase()) {
      reqFormat.SATURDAY[tagObject.hStartHTag] = jHStartH;
      reqFormat.SATURDAY[tagObject.hStartMTag] = jHStartM;
      reqFormat.SATURDAY[tagObject.hEndHTag] = jHEndH;
      reqFormat.SATURDAY[tagObject.hEndMTag] = jHEndM;
      reqFormat.SATURDAY[tagObject.eventStartTypeTag] = eventStartType;
      reqFormat.SATURDAY[tagObject.eventEndTypeTag] = eventEndType;
      return reqFormat;
    }
  }
}
