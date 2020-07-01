import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl: string = environment.BASE_URI;
  authToken: string;
  nor_id: any;
constructor(private http: HttpClient) { 

}
loadToken() {
  const token = localStorage.getItem('token');
  this.authToken = token;
}
getNorId(){
  this.nor_id = localStorage.getItem('nor_id');
  return this.nor_id;
}
getMaintenanceStatusList(){
  this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
  return this.http.get(`${this.apiUrl}/maintenance-list?nor_id=${this.getNorId()}`, { headers });
}
updateMaintenance(formData) {
  this.loadToken();
  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.authToken}`
  );
  formData.nor_id = this.getNorId();
  return this.http.post(`${this.apiUrl}/recipe/systempref`, formData, { headers });
}
getMaintenanceHistory(){
  this.loadToken();
  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.authToken}`
  );
  return this.http.get(`${this.apiUrl}/maintenance-history?nor_id=${this.getNorId()}`, { headers });
}
updateMaintenanceItem(formdata){
  this.loadToken();
  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.authToken}`
  );
  return this.http.post(`${this.apiUrl}/maintenance`,formdata, { headers });
}
getMaintenanceDetails(title){
  this.loadToken();
  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.authToken}`
  );
  return this.http.get(`${this.apiUrl}/maintenance-details?nor_id=${this.getNorId()}&title=${title}`, { headers });
}

}
