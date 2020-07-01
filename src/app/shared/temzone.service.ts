import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TemzoneService {
  authToken: any;
  private url = environment.BASE_URI;
  constructor(private http: HttpClient, private authService: AuthService) {}

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }
  updateZoneNames(formValue) {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    const formData = {
      Nm_Zone1A: formValue.hose1,
      Nm_Zone2A: formValue.hose2,
      Nm_Zone3A: formValue.hose3,
      Nm_Zone4A: formValue.hose4,
      Nm_Zone5A: formValue.hose5,
      Nm_Zone6A: formValue.hose6,
      Nm_Zone7A: formValue.hose7,
      Nm_Zone8A: formValue.hose8,
      Nm_Zone9A: formValue.hose9,
      Nm_Zone10A: formValue.hose10,

      Nm_Zone1B: formValue.app1,
      Nm_Zone2B: formValue.app2,
      Nm_Zone3B: formValue.app3,
      Nm_Zone4B: formValue.app4,
      Nm_Zone5B: formValue.app5,
      Nm_Zone6B: formValue.app6,
      Nm_Zone7B: formValue.app7,
      Nm_Zone8B: formValue.app8,
      Nm_Zone9B: formValue.app9,
      Nm_Zone10B: formValue.app10,

      nor_id: this.authService.getNorId()
    };

    return this.http.post(`${this.url}/recipe/zonenames`, formData, {
      headers
    });
  }
}
