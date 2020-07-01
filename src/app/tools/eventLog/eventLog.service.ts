import { Injectable } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventLogService {

  authToken: any;
  formdata = { nor_id : null};

  private apiUrl: string = environment.BASE_URI;
  options;
  constructor(private authService: AuthService, private http: HttpClient) {}

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  getEventLogs(postData){
    this.formdata = postData;
    this.formdata.nor_id = this.authService.getNorId();
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(
      `${this.apiUrl}/eventlogs`,
      this.formdata,
      { headers }
    );
  }
  getEventLogType() {
    this.formdata.nor_id = this.authService.getNorId();
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(`${this.apiUrl}/eventlogs/eventtypes`,  this.formdata, {
      headers
    });
  }
  getEventLogZones() {
    this.formdata.nor_id = this.authService.getNorId();
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.post(`${this.apiUrl}/eventlogs/zones`, this.formdata, {
      headers
    });
  }
}
